import { hex2uint, uint2hex } from './helpers'
import { OasisTransaction, signerFromPrivateKey } from './transaction'
import { NodeInternal } from '@oasisprotocol/client/dist/client'

jest.mock('@oasisprotocol/client/dist/client')

describe('OasisTransaction', () => {
  const pkey =
    '5f48e5a6fb243f5abc13aac7c56449afbc93be90ae38f10a0465bc82db954f17e75624c8d2cd9f062ce0331373a3be50ef0eccc5d257b4e2dea83a05506c7132'
  const testSigner = signerFromPrivateKey(hex2uint(pkey))
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

  it('Should sign transactions', async () => {
    const tw = await OasisTransaction.buildTransfer(
      nic,
      testSigner,
      'oasis1qq5t7f2gecsjsdxmp5zxtwgck6pzpjmkvc657z6l',
      BigInt(1250),
    )

    expect(tw.signedTransaction).toBeUndefined()

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
      spy.mockRejectedValueOnce({ metadata: { 'grpc-message': 'transaction: invalid nonce' } })

      const call = OasisTransaction.submit(nic, tw)
      await expect(call).rejects.toThrow(/Invalid nonce/)
    })
  })
})
