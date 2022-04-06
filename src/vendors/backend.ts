import { getMonitorAPIs } from 'vendors/monitor'
import { getOasisscanAPIs } from 'vendors/oasisscan'

export enum BackendAPIs {
  OasisMonitor = 'oasismonitor',
  OasisScan = 'oasisscan',
}

const backendNameToApi = {
  [BackendAPIs.OasisMonitor]: getMonitorAPIs,
  [BackendAPIs.OasisScan]: getOasisscanAPIs,
}

export const backend = () => process.env.REACT_APP_BACKEND || BackendAPIs.OasisMonitor
export const backendApi = backendNameToApi[backend()]
