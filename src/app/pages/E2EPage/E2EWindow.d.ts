import * as monitor from 'vendors/monitor'
import * as oasisscanV2 from 'vendors/oasisscan-v2'
import * as nexus from 'vendors/nexus'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import * as encryption from '../../state/persist/encryption'
import { Store } from '@reduxjs/toolkit'
import { RootState } from '../../../types'

interface _E2EWindow extends Window {
  monitor: typeof monitor
  oasisscanV2: typeof oasisscanV2
  nexus: typeof nexus
  oasis: typeof oasis
  oasisRT: typeof oasisRT
  encryption: typeof encryption
  store: Store<RootState>
}

export type E2EWindow = _E2EWindow & typeof globalThis
