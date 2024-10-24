import { getMonitorAPIs } from 'vendors/monitor'
import { getOasisscanAPIs } from 'vendors/oasisscan'
import { getOasisscanV2APIs } from 'vendors/oasisscan-v2'
import { BackendAPIs } from 'config'

const backendNameToApi = {
  [BackendAPIs.OasisMonitor]: getMonitorAPIs,
  [BackendAPIs.OasisScan]: getOasisscanAPIs,
  [BackendAPIs.OasisScanV2]: getOasisscanV2APIs,
}

export const backend = () => process.env.REACT_APP_BACKEND || BackendAPIs.OasisMonitor
export const backendApi = backendNameToApi[backend()]
