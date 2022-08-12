import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import BigNumber from 'bignumber.js'
import { ContextSigner, Signer } from '@oasisprotocol/client/dist/signature'
import { WalletError, WalletErrors } from 'types/errors'
import { getEvmBech32Address } from 'app/lib/eth-helpers'
import { isValidEthAddress } from 'app/lib/eth-helpers'
import { addressToPublicKey, shortPublicKey } from './helpers'

type OasisClient = oasis.client.NodeInternal

export const signerFromPrivateKey = (privateKey: Uint8Array) => {
  return oasis.signature.NaclSigner.fromSecret(privateKey, 'this key is not important')
}

/** Transaction Wrapper */
export type TW<T> = oasis.consensus.TransactionWrapper<T>

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

  public static async buildParatimeTransfer(
    nic: OasisClient,
    signer: Signer,
    targetAddress: string,
    fromAddress: string,
    amount: string,
    runtimeId: string,
    runtimeDecimals: number,
  ): Promise<TW<oasisRT.types.ConsensusDeposit>> {
    const consensusRuntimeId = oasis.misc.fromHex(runtimeId)
    const txWrapper = new oasisRT.consensusAccounts.Wrapper(consensusRuntimeId).callDeposit()
    const accountsWrapper = new oasisRT.accounts.Wrapper(consensusRuntimeId)
    const nonce = await accountsWrapper
      .queryNonce()
      .setArgs({ address: await oasis.staking.addressFromBech32(fromAddress) })
      .query(nic)
    const feeAmount = 0n
    const feeGas = BigInt(15000)
    const signerInfo = {
      address_spec: { signature: { ed25519: signer.public() } },
      nonce,
    }

    txWrapper
      .setBody({
        amount: [
          oasis.quantity.fromBigInt(
            BigInt(new BigNumber(amount.toString()).shiftedBy(runtimeDecimals).toFixed()),
          ),
          oasisRT.token.NATIVE_DENOMINATION,
        ],
        to: await oasis.staking.addressFromBech32(
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

  public static async signParaTime<T>(chainContext: string, signer: Signer, tw: TW<T>): Promise<void> {
    return tw.sign([new oasis.signature.BlindContextSigner(signer)], chainContext)
  }

  public static async submit<T>(nic: OasisClient, tw: TW<T>): Promise<void> {
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
