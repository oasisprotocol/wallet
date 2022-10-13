import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import BigNumber from 'bignumber.js'
import { ContextSigner, Signer } from '@oasisprotocol/client/dist/signature'
import { WalletError, WalletErrors } from 'types/errors'
import { getEvmBech32Address } from 'app/lib/eth-helpers'
import { isValidEthAddress } from 'app/lib/eth-helpers'
import { ParaTimeTransaction, TransactionTypes } from 'app/state/paratimes/types'
import { addressToPublicKey, parseRoseStringToBigNumber, shortPublicKey } from './helpers'
import { consensusDecimals } from '../../config'

type OasisClient = oasis.client.NodeInternal

export const signerFromPrivateKey = (privateKey: Uint8Array) => {
  return oasis.signature.NaclSigner.fromSecret(privateKey, 'this key is not important')
}

export const signerFromEthPrivateKey = (ethPrivateKey: Uint8Array) => {
  return oasisRT.signatureSecp256k1.EllipticSigner.fromPrivate(ethPrivateKey, 'this key is not important')
}

/** Transaction Wrapper */
export type TW<T> = oasis.consensus.TransactionWrapper<T>

/** Runtime Transaction Wrapper */
type RTW<T> = oasisRT.wrapper.TransactionWrapper<T, void>

// A wild guess: the minimum gas price on Emerald (100 nano ROSE) times the default loose
// overestimate of the gas (15k).
const defaultWithdrawFeeAmount = '1500000'
const defaultDepositFeeAmount = '0'

export class OasisTransaction {
  protected static genesis?: oasis.types.GenesisDocument

  public static async buildReclaimEscrow(
    nic: OasisClient,
    signer: Signer,
    account: string,
    shares: bigint,
  ): Promise<TW<oasis.types.StakingReclaimEscrow>> {
    const tw = oasis.staking.reclaimEscrowWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      account: await addressToPublicKey(account),
      shares: oasis.quantity.fromBigInt(shares),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildAddEscrow(
    nic: OasisClient,
    signer: Signer,
    account: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingEscrow>> {
    const tw = oasis.staking.addEscrowWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      account: await addressToPublicKey(account),
      amount: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  public static async buildTransfer(
    nic: OasisClient,
    signer: Signer,
    to: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingTransfer>> {
    const tw = oasis.staking.transferWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
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

  public static async buildStakingAllowTransfer(
    nic: OasisClient,
    signer: Signer,
    to: string,
    amount: bigint,
  ): Promise<TW<oasis.types.StakingAllow>> {
    const tw = oasis.staking.allowWrapper()
    const nonce = await OasisTransaction.getNonce(nic, signer)
    const beneficiary = await addressToPublicKey(to)

    tw.setNonce(nonce)
    tw.setFeeAmount(oasis.quantity.fromBigInt(0n))
    tw.setBody({
      beneficiary,
      negative: false,
      amount_change: oasis.quantity.fromBigInt(amount),
    })

    const gas = await tw.estimateGas(nic, signer.public())
    tw.setFeeGas(gas)

    return tw
  }

  /**
   * Note: uses raw user input amounts in ROSE as parameter instead of
   * normalized bigint base units, because it needs to convert to base units
   * dependent on paratime decimals.
   */
  public static async buildParaTimeTransfer(
    nic: OasisClient,
    signer: Signer,
    transaction: ParaTimeTransaction,
    fromAddress: string,
    runtimeId: string,
    runtimeDecimals: number,
  ): Promise<RTW<oasisRT.types.ConsensusDeposit | oasisRT.types.ConsensusWithdraw>> {
    const { amount, recipient: targetAddress, type } = transaction
    const isDepositing = type === TransactionTypes.Deposit
    const consensusRuntimeId = oasis.misc.fromHex(runtimeId)
    const txWrapper = new oasisRT.consensusAccounts.Wrapper(consensusRuntimeId)[
      isDepositing ? 'callDeposit' : 'callWithdraw'
    ]()
    const accountsWrapper = new oasisRT.accounts.Wrapper(consensusRuntimeId)
    const nonce = await accountsWrapper
      .queryNonce()
      .setArgs({ address: oasis.staking.addressFromBech32(fromAddress) })
      .query(nic)
    const feeAmount = BigInt(
      new BigNumber(
        transaction.feeAmount
          ? transaction.feeAmount
          : isDepositing
          ? defaultDepositFeeAmount
          : defaultWithdrawFeeAmount,
      )
        .shiftedBy(runtimeDecimals)
        .shiftedBy(-consensusDecimals)
        .toFixed(0),
    )
    const feeGas = transaction.feeGas ? BigInt(transaction.feeGas) : 15000n
    const signerInfo = {
      address_spec: {
        signature: { [transaction.ethPrivateKey ? 'secp256k1eth' : 'ed25519']: signer.public() },
      },
      nonce,
    }

    txWrapper
      .setBody({
        amount: [
          oasis.quantity.fromBigInt(BigInt(parseRoseStringToBigNumber(amount, runtimeDecimals).toFixed(0))),
          oasisRT.token.NATIVE_DENOMINATION,
        ],
        to: oasis.staking.addressFromBech32(
          isValidEthAddress(targetAddress) ? await getEvmBech32Address(targetAddress) : targetAddress,
        ),
      })
      .setFeeAmount([oasis.quantity.fromBigInt(feeAmount), oasisRT.token.NATIVE_DENOMINATION])
      .setFeeGas(feeGas)
      .setFeeConsensusMessages(1)
      .setSignerInfo([signerInfo])

    return txWrapper
  }

  public static async signUsingLedger<T>(
    chainContext: string,
    signer: ContextSigner,
    tw: TW<T>,
  ): Promise<void> {
    await tw.sign(signer, chainContext)

    // @todo Upstream bug in oasis-app, the signature is larger than 64 bytes
    tw.signedTransaction.signature.signature = tw.signedTransaction.signature.signature.slice(0, 64)
  }

  public static async sign<T>(chainContext: string, signer: Signer, tw: TW<T>): Promise<void> {
    return tw.sign(new oasis.signature.BlindContextSigner(signer), chainContext)
  }

  public static async signParaTime<T>(chainContext: string, signer: Signer, tw: RTW<T>): Promise<void> {
    return tw.sign([new oasis.signature.BlindContextSigner(signer)], chainContext)
  }

  public static async submit<T>(nic: OasisClient, tw: TW<T> | RTW<T>): Promise<void> {
    try {
      await tw.submit(nic)
    } catch (e: any) {
      const grpcError = e?.cause?.metadata?.['grpc-message'] || e.message

      if (!grpcError) {
        throw new WalletError(WalletErrors.UnknownError, grpcError, e)
      }

      switch (grpcError) {
        case 'transaction: invalid nonce':
          throw new WalletError(WalletErrors.InvalidNonce, 'Invalid nonce')
        case 'consensus: duplicate transaction':
          throw new WalletError(WalletErrors.DuplicateTransaction, 'Duplicate transaction')
        default:
          throw new WalletError(WalletErrors.UnknownGrpcError, grpcError, e)
      }
    }
  }

  protected static async getNonce(nic: OasisClient, signer: Signer): Promise<bigint> {
    const nonce = await nic.consensusGetSignerNonce({
      account_address: await shortPublicKey(signer.public()),
      height: 0,
    })

    return BigInt(nonce || 0)
  }
}
