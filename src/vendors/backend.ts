import { getMonitorAPIs } from 'vendors/monitor'
import { getOasisscanAPIs } from 'vendors/oasisscan'
import { BackendAPIs } from 'config'

const backendNameToApi = {
  [BackendAPIs.OasisMonitor]: getMonitorAPIs,
  [BackendAPIs.OasisScan]: getOasisscanAPIs,
}

export const backend = () => process.env.REACT_APP_BACKEND || BackendAPIs.OasisMonitor
export const backendApi = backendNameToApi[backend()]
