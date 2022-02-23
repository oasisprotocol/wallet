import { getMonitorAPIs } from 'vendors/monitor'
import { getOasisscanAPIs } from 'vendors/oasisscan'

export enum BackendAPIs {
  OasisMonitor = 'oasismonitor',
  OasisScan = 'oasisscan',
}

export const backend = process.env.REACT_APP_BACKEND || BackendAPIs.OasisMonitor
export const backendApi = backend === BackendAPIs.OasisScan ? getOasisscanAPIs : getMonitorAPIs
