import { uint2hex } from './helpers'
import { OasisTransaction, signerFromPrivateKey } from './transaction'
import { NodeInternal } from '@oasisprotocol/client/dist/client'
import { RpcError, StatusCode } from 'grpc-web'
import { OasisKey } from './key'

function wrapRpcError(method: string, grpcMessage: string) {
  const e = new RpcError(StatusCode.FAILED_PRECONDITION, 'RpcError: ..', {
    'grpc-message': grpcMessage,
  })

  // See https://github.com/oasisprotocol/oasis-sdk/blob/96d3997/client-sdk/ts-web/core/src/client.ts#L616-L620
  const innerMessage = e instanceof Error ? e.toString() : JSON.stringify(e)
  const message = `callUnary method ${method}: ${innerMessage}`
  const wrapped = new Error(message, { cause: e })
  return wrapped
}

jest.mock('@oasisprotocol/client/dist/client')

describe('OasisTransaction', () => {
  const privateKey =
    'X0jlpvskP1q8E6rHxWRJr7yTvpCuOPEKBGW8gtuVTxfnViTI0s2fBizgMxNzo75Q7w7MxdJXtOLeqDoFUGxxMg=='
  const testSigner = signerFromPrivateKey(OasisKey.fromBase64PrivateKey(privateKey))
  const nic = new NodeInternal('http://0.0.0.0')

  it('Should build reclaimEscrow transactions', async () => {
    const tw = await OasisTransaction.buildReclaimEscrow(
      nic,
      testSigner,
      'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
      BigInt(1250),
    )

    expect(tw.transaction.method).toEqual('staking.ReclaimEscrow')
    expect(tw.transaction.body).toHaveProperty('shares')
    expect((tw.transaction.body as any).shares).toEqual(new Uint8Array([4, 226])) // 1250
  })

  it('Should build addEscrow transactions', async () => {
    const tw = await OasisTransaction.buildAddEscrow(
      nic,
      testSigner,
      'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
      BigInt(1250),
    )

    expect(tw.transaction.method).toEqual('staking.AddEscrow')
    expect(tw.transaction.body).toHaveProperty('amount')
    expect((tw.transaction.body as any).amount).toEqual(new Uint8Array([4, 226])) // 1250
  })

  it('Should build transfer transactions', async () => {
    const tw = await OasisTransaction.buildTransfer(
      nic,
      testSigner,
      'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
      BigInt(1250),
    )

    expect(tw.transaction.method).toEqual('staking.Transfer')
    expect(tw.transaction.body).toHaveProperty('amount')
    expect((tw.transaction.body as any).amount).toEqual(new Uint8Array([4, 226])) // 1250
  })

  it('Should build staking allow transfer transactions', async () => {
    const tw = await OasisTransaction.buildStakingAllowTransfer(
      nic,
      testSigner,
      'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
      BigInt(1250),
    )

    expect(tw.transaction.method).toEqual('staking.Allow')
    expect(tw.transaction.body).toHaveProperty('beneficiary')
    expect((tw.transaction.body as any).negative).toEqual(false)
    expect((tw.transaction.body as any).amount_change).toEqual(new Uint8Array([4, 226])) // 1250
  })

  it('Should sign transactions', async () => {
    const tw = await OasisTransaction.buildTransfer(
      nic,
      testSigner,
      'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
      BigInt(1250),
    )

    expect(tw.signedTransaction).toEqual(null)

    await OasisTransaction.sign('', testSigner, tw)
    const hexSignature = uint2hex(tw.signedTransaction.signature.signature)
    expect(hexSignature).toEqual(
      '19f7c47e6b3c36fa88aa53b2e9e2cd47d7a6140a4cfbfdf28014ba6f81afbea27c76f9a3125e64f4297571ee0b5f0c5588895b0738975ec2ce3349adc3880e06',
    )
  })

  describe('#submit', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('Should submit transactions', async () => {
      const tw = await OasisTransaction.buildTransfer(
        nic,
        testSigner,
        'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
        BigInt(1250),
      )

      await OasisTransaction.sign('', testSigner, tw)
      await OasisTransaction.submit(nic, tw)
      expect(nic.consensusSubmitTx).toHaveBeenCalled()
      expect(jest.isMockFunction(nic.consensusSubmitTx)).toBe(true)
    })

    it('Should bubble-up grpc errors', async () => {
      const tw = await OasisTransaction.buildTransfer(
        nic,
        testSigner,
        'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
        BigInt(1250),
      )

      await OasisTransaction.sign('', testSigner, tw)

      const spy = jest.spyOn(tw, 'submit')
      spy.mockRejectedValueOnce(wrapRpcError('submit', 'transaction: invalid nonce'))
      await expect(OasisTransaction.submit(nic, tw)).rejects.toThrow(/Invalid nonce/)

      spy.mockRejectedValueOnce(wrapRpcError('submit', 'unhandled err'))
      await expect(OasisTransaction.submit(nic, tw)).rejects.toThrow(/unhandled err/)
    })
  })
})
