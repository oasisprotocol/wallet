import { AccountsApi, BlocksApi, Configuration, OperationsListApi } from 'vendors/explorer'

const config = new Configuration({
  basePath: process.env.REACT_APP_EXPLORER_ADDRESS ?? 'http://localhost:9001',
})
export const accounts = new AccountsApi(config)
export const blocks = new BlocksApi(config)
export const operations = new OperationsListApi(config)
