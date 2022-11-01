import { RootState } from 'types'

export interface SyncedRootState extends Pick<RootState, 'theme' | 'wallet' | 'network'> {}
