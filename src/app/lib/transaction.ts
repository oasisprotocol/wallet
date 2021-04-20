import * as oasis from '@oasisprotocol/client'
import { Signer } from '@oasisprotocol/client/dist/signature'
import { WalletError, WalletErrors } from 'types/errors'

import { HDKey } from './hdkey'
import { addressToPublicKey, shortPublicKey } from './helpers'
import { nic } from './oasis-client'

export const signerFromPrivateKey = (privateKey: Uint8Array) => {
  return oasis.signature.NaclSigner.fromSecret(privateKey, 'this key is not important')
}

export const signerFromHDSecret = (secret: Uint8Array) => {
  return HDKey.fromSecret(secret)
}

type TW<T> = oasis.consensus.TransactionWrapper<T>

export class OasisTransaction {
  protected static chainContext?: string
  protected static genesis?: oasis.types.GenesisDocument

  public static async buildReclaimEscrow(
    signer: Signer,
    to: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingReclaimEscrow>> {
    const tw = oasis.staking.reclaimEscrowWrapper()
    const nonce = await OasisTransaction.getNonce(signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      account: await addressToPublicKey(to),
      shares: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildAddEscrow(
    signer: Signer,
    to: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingEscrow>> {
    const tw = oasis.staking.addEscrowWrapper()
    const nonce = await OasisTransaction.getNonce(signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      account: await addressToPublicKey(to),
      amount: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildTransfer(
    signer: Signer,
    to: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingTransfer>> {
    const tw = oasis.staking.transferWrapper()
    const nonce = await OasisTransaction.getNonce(signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      to: await addressToPublicKey(to),
      amount: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async sign<T>(signer: Signer, tw: TW<T>): Promise<void> {
    const chainContext = await OasisTransaction.getChaincontext()
    return tw.sign(new oasis.signature.BlindContextSigner(signer), chainContext)
  }

  public static async submit<T>(tw: TW<T>): Promise<void> {
    try {
      await tw.submit(nic)
    } catch (e) {
      const grpcError = e?.metadata?.['grpc-message']

      if (!grpcError) {
        throw new WalletError(WalletErrors.UnknownError, 'Unknown error', e)
      }

      switch (grpcError) {
        case 'transaction: invalid nonce':
          throw new WalletError(WalletErrors.InvalidNonce, 'Invalid nonce')
        case 'consensus: duplicate transaction':
          throw new WalletError(WalletErrors.DuplicateTransaction, 'Duplicate transaction')
        default:
          throw new WalletError(WalletErrors.UnknownError, 'Unknown gRPC Error', e)
      }
    }
  }

  protected static async getNonce(signer: Signer): Promise<bigint> {
    const nonce = await nic.consensusGetSignerNonce({
      account_address: await shortPublicKey(signer.public()),
      height: 0,
    })

    return BigInt(nonce || 0)
  }

  protected static async getChaincontext(): Promise<string> {
    if (!OasisTransaction.chainContext) {
      OasisTransaction.genesis = await nic.consensusGetGenesisDocument()
      OasisTransaction.chainContext = await oasis.genesis.chainContext(OasisTransaction.genesis)
    }

    return OasisTransaction.chainContext
  }
}
