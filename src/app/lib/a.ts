import Transport from "@ledgerhq/hw-transport";
import {BleClient} from "@capacitor-community/bluetooth-le";
import {sendAPDU} from "@ledgerhq/devices/ble/sendAPDU";
import {receiveAPDU} from "@ledgerhq/devices/ble/receiveAPDU";
import {
  BluetoothInfos,
  getBluetoothServiceUuids,
  getInfosForServiceUuid,
} from "@ledgerhq/devices";
import type {DeviceModel} from "@ledgerhq/devices";
import {log} from "@ledgerhq/logs";
import {Observable, defer, merge, from, Subject, firstValueFrom} from "rxjs";
import {
  share,
  ignoreElements,
  first,
  map,
  tap,
} from "rxjs/operators";
import {
  CantOpenDevice,
  TransportError,
  DisconnectedDeviceDuringOperation,
} from "@ledgerhq/errors";
import {ScanResult} from "@capacitor-community/bluetooth-le/dist/esm/definitions";

const TAG = "ble-verbose";

export const monitorCharacteristic = (
  deviceId: string,
  service: string,
  characteristic: string
): Observable<Buffer> => {
  log("ble-verbose", "start monitor " + service);

  return new Observable<Buffer>(subscriber => {
    BleClient.startNotifications(deviceId, service, characteristic, rawData => {
      const value = Buffer.from(rawData.buffer, rawData.byteOffset, rawData.byteLength);
      subscriber.next(value);
    })

    return async () => {
      await BleClient.stopNotifications(deviceId, service, characteristic);
    }
  });
}


const transportsCache: { [deviceId: string]: BleTransport } = {};

let _bleClient: typeof BleClient | null = null;
const bleInstance = (): typeof BleClient => {
  if (!_bleClient) {
    BleClient.initialize({
      androidNeverForLocation: true
    })
    _bleClient = BleClient;
  }

  return _bleClient;
};

const clearDisconnectTimeout = (deviceId: string): void => {
  const cachedTransport = transportsCache[deviceId];
  if (cachedTransport && cachedTransport.disconnectTimeout) {
    log(TAG, "Clearing queued disconnect");
    clearTimeout(cachedTransport.disconnectTimeout);
  }
};

const open = async (scanResult: ScanResult): Promise<BleTransport> => {
  log(TAG, `Tries to open device: ${scanResult}`);

  const closedSubscription = new Subject<void>()

  try {
    log(TAG, `connectToDevice(${scanResult})`);
    await BleTransport.connect(scanResult.device.deviceId, () => {
      closedSubscription.next()
    })
  } catch (error) {
    log(TAG, `error code ${String(error)}`);

    throw new CantOpenDevice();
  }

  let bluetoothInfos: BluetoothInfos | undefined;
  let characteristics: string[] | undefined = [];

  for (const uuid of getBluetoothServiceUuids()) {
    if (scanResult.uuids) {
      const peripheralCharacteristic = scanResult.uuids.filter((service) => service === uuid);
      if (peripheralCharacteristic.length) {
        characteristics.push(...peripheralCharacteristic)
        bluetoothInfos = getInfosForServiceUuid(uuid);
        break;
      }
    }
  }

  if (!bluetoothInfos) {
    throw new TransportError("service not found", "BLEServiceNotFound");
  }

  const {deviceModel, serviceUuid, writeUuid, writeCmdUuid, notifyUuid} = bluetoothInfos;

  if (!characteristics) {
    if (scanResult.uuids) {
      const characteristic = scanResult.uuids.find((uuid) => uuid === serviceUuid)
      if (characteristic) {
        characteristics = [characteristic];
      }
    }
  }

  if (!characteristics.length) {
    throw new TransportError("service not found", "BLEServiceNotFound");
  }

  if (!writeUuid) {
    throw new TransportError(
      "write characteristic not found",
      "BLECharacteristicNotFound"
    );
  }

  if (!notifyUuid) {
    throw new TransportError(
      "notify characteristic not found",
      "BLECharacteristicNotFound"
    );
  }

  if (!writeUuid) {
    throw new TransportError(
      "write cmd characteristic not found",
      "BLECharacteristicInvalid"
    );
  }

  const notifyObservable = monitorCharacteristic(scanResult.device.deviceId, serviceUuid, notifyUuid).pipe(
    share()
  );
  const notifySubscription = notifyObservable.subscribe();
  const transport = new BleTransport(
    scanResult,
    writeUuid,
    writeCmdUuid,
    notifyObservable,
    deviceModel,
    bluetoothInfos
  );

  closedSubscription.pipe(
    first(),
    tap(() => {
      transport.isConnected = false;
      notifySubscription.unsubscribe();

      clearDisconnectTimeout(transport.id);
      delete transportsCache[transport.id];
      log(TAG, `BleTransport(${transport.id}) disconnected`);
      transport.emit("disconnect");
    })
  ).subscribe();

  transportsCache[transport.id] = transport;

  await transport.inferMTU();

  return transport;
}

/**
 * Ionic bluetooth BLE implementation
 */
export default class BleTransport extends Transport {
  static disconnectTimeoutMs = 5000;
  static isSupported = (): Promise<boolean> =>
    Promise.resolve(typeof BleClient === "object");

  static isEnabled = (): Promise<boolean> => bleInstance().isEnabled()

  static connect = (deviceId: string, onDisconnect: (deviceId: string) => void): Promise<void> => {
    return bleInstance().connect(deviceId, onDisconnect);
  }

  static list = (stopScanTimeout = BleTransport.disconnectTimeoutMs): Promise<ScanResult[]> => {
    let devices: ScanResult[] = []

    return new Promise((resolve, reject) => {
      bleInstance().requestLEScan({services: getBluetoothServiceUuids()}, data => {
        devices = [
          ...devices.filter(prevDevice => prevDevice.device.deviceId !== data.device.deviceId),
          data
        ]

      });

      setTimeout(async () => {
          await bleInstance().stopLEScan()
          try {
            log(TAG, 'BLE scan complete')
            resolve(devices);
          } catch (err) {
            log(TAG, 'BLE scan failed')
            reject(err)
          }
        },
        stopScanTimeout,
      );

    })
  };

  static async open(scanResult: ScanResult): Promise<BleTransport> {
    return open(scanResult);
  }

  /**
   * Exposed method from the @capacitor-community/bluetooth-le library
   * Disconnects from {@link ScanResult} if it's connected or cancels pending connection.
   */
  static disconnect = async (id: string): Promise<void> => {
    log(TAG, `user disconnect(${id})`);
    await bleInstance().disconnect(id);
    log(TAG, "disconnected");
  };

  device: ScanResult;
  deviceModel: DeviceModel;
  disconnectTimeout: null | ReturnType<typeof setTimeout> = null;
  id: string;
  isConnected = true;
  mtuSize = 20;
  notifyObservable: Observable<Buffer>;
  writeCharacteristic: string;
  writeCmdCharacteristic: string | undefined;
  bluetoothInfos: BluetoothInfos;

  constructor(
    device: ScanResult,
    writeCharacteristic: string,
    writeCmdCharacteristic: string | undefined,
    notifyObservable: Observable<Buffer>,
    deviceModel: DeviceModel,
    bluetoothInfos: BluetoothInfos
  ) {
    super();
    this.id = device.device.deviceId;
    this.device = device;
    this.writeCharacteristic = writeCharacteristic;
    this.writeCmdCharacteristic = writeCmdCharacteristic;
    this.notifyObservable = notifyObservable;
    this.deviceModel = deviceModel;
    this.bluetoothInfos = bluetoothInfos;

    log(TAG, `BLE(${String(this.id)}) new instance`);
    clearDisconnectTimeout(this.id);
  }

  /**
   * Send data to the device using a low level API.
   * It's recommended to use the "send" method for a higher level API.
   * @param {Buffer} apdu - The data to send.
   * @returns {Promise<Buffer>} A promise that resolves with the response data from the device.
   */
  exchange = async (apdu: Buffer): Promise<Buffer> => {
    if (!this.isConnected) {
      throw new DisconnectedDeviceDuringOperation("Device not connected");
    }

    return this.exchangeAtomicImpl(async () => {
      try {
        const msgIn = apdu.toString("hex");
        log("apdu", `=> ${msgIn}`);

        const dataObservable: Observable<Buffer> = merge(
          this.notifyObservable.pipe(receiveAPDU),
          sendAPDU(this.write, apdu, this.mtuSize)
        );

        const data: Buffer = await firstValueFrom(dataObservable);

        if (!data) {
          throw new Error("Received data is undefined");
        }

        const msgOut = data.toString("hex");
        log("apdu", `<= ${msgOut}`);

        return data;
      } catch (e) {
        log("ble-error", "exchange got " + String(e));
      }
    }) as Promise<Buffer>
  }

  /**
   * Negotiate with the device the maximum transfer unit for the ble frames
   * @returns Promise<number>
   */
  async inferMTU(): Promise<number> {
    let mtu = this.mtuSize;

    await this.exchangeAtomicImpl(async () => {
      try {
        const mtuObservable: Observable<number> = merge(
          this.notifyObservable.pipe(
            tap((maybeError) => {
              if (maybeError instanceof Error) throw maybeError;
            }),
            first((buffer) => buffer.readUInt8(0) === 0x08),
            map((buffer) => buffer.readUInt8(5))
          ),
          defer(() => from(this.write(Buffer.from([0x08, 0, 0, 0, 0])))).pipe(
            ignoreElements()
          )
        );

        mtu = await firstValueFrom(mtuObservable);

        if (mtu === undefined) {
          throw new Error("MTU negotiation failed, received undefined");
        }
      } catch (e) {
        log("ble-error", "inferMTU got " + JSON.stringify(e));

        try {
          await bleInstance().disconnect(this.device.device.deviceId)
        } catch (ex) {
          // Ignore error
        }

        throw e;
      }
    });

    if (mtu > 20) {
      this.mtuSize = mtu;
      log(TAG, `BleTransport(${this.id}) mtu set to ${this.mtuSize}`);
    }

    return this.mtuSize;
  }

  /**
   * Do not call this directly unless you know what you're doing. Communication
   * with a Ledger device should be through the {@link exchange} method.
   * @param buffer
   */
  write = async (buffer: Buffer): Promise<void> => {
    log("ble-frame", "=> " + buffer.toString("hex"));
    if (this.writeCmdCharacteristic) {
      try {
        const data = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
        return await bleInstance().writeWithoutResponse(this.device.device.deviceId, this.bluetoothInfos.serviceUuid, this.bluetoothInfos.writeCmdUuid, data)
      } catch (e) {
        throw new DisconnectedDeviceDuringOperation(String(e));
      }
    } else {
      try {
        const data = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
        return await bleInstance().write(this.device.device.deviceId, this.bluetoothInfos.serviceUuid, this.bluetoothInfos.writeUuid, data)
      } catch (e) {
        throw new DisconnectedDeviceDuringOperation(String(e));
      }
    }
  };

  /**
   * We intentionally do not immediately close a transport connection.
   * Instead, we queue the disconnect and wait for a future connection to dismiss the event.
   * This approach prevents unnecessary disconnects and reconnects. We use the isConnected
   * flag to ensure that we do not trigger a disconnect if the current cached transport has
   * already been disconnected.
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    let resolve: (value?: PromiseLike<void>) => void;
    const disconnectPromise = new Promise<void>((innerResolve) => {
      resolve = innerResolve;
    });

    clearDisconnectTimeout(this.id);

    log(TAG, "Queuing a disconnect");

    this.disconnectTimeout = global.setTimeout(async () => {
      log(TAG, `Triggering a disconnect from ${this.id}`);
      if (this.isConnected) {
        try {
          await BleTransport.disconnect(this.id)
        } finally {
          resolve();
        }
      } else {
        resolve();
      }
    }, BleTransport.disconnectTimeoutMs);

    // The closure will occur no later than 5s, triggered either by disconnection
    // or the actual response of the apdu.
    await Promise.race([
      this.exchangeBusyPromise || Promise.resolve(),
      disconnectPromise,
    ]);

    return;
  }
}
