export const config = {
  mainnet: {
    grpc: 'https://grpc.oasis.dev',
    explorer: 'https://monitor.oasis.dev',
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.dev',
    explorer: 'https://monitor.oasis.dev/api/testnet',
  },
  local: {
    grpc: 'http://localhost:42280',
    explorer: 'http://localhost:9001',
  },
}
