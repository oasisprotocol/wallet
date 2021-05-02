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
      'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
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
      'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
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
      'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
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
      'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
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
      'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
      BigInt(1250),
    )

    expect(tw.signedTransaction).toBeUndefined()

    await OasisTransaction.sign(nic, testSigner, tw)
    const hexSignature = uint2hex(tw.signedTransaction.signature.signature)
    expect(hexSignature).toEqual(
      '4a4245ccacd47236cd38c548d140ec6235701f34ec2e7cc1da0a44389bd187b1a46331b2a3b0af126af0b704e99a939670deeb2bad68a571206e4f2c65eb8405',
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
        'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
        BigInt(1250),
      )

      await OasisTransaction.sign(nic, testSigner, tw)
      await OasisTransaction.submit(nic, tw)
    })

    it('Should bubble-up grpc errors', async () => {
      const tw = await OasisTransaction.buildTransfer(
        nic,
        testSigner,
        'oasis1qq8dt2jxf57kuszg3mdf78wtkggsvtuepctlftnn',
        BigInt(1250),
      )

      await OasisTransaction.sign(nic, testSigner, tw)

      const spy = jest.spyOn(tw, 'submit')
      spy.mockRejectedValueOnce({ metadata: { 'grpc-message': 'transaction: invalid nonce' } })

      const call = OasisTransaction.submit(nic, tw)
      expect(call).rejects.toThrow(/Invalid nonce/)
    })
  })
})
