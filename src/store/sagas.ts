import { all } from 'typed-redux-saga'

import { accountSaga } from 'app/state/account/saga'
import { networkSaga } from 'app/state/network/saga'
import { importAccountsSaga } from 'app/state/importaccounts/saga'
import { stakingSaga } from 'app/state/staking/saga'
import { transactionSaga } from 'app/state/transaction/saga'
import { rootWalletSaga } from 'app/state/wallet/saga'

export default function* rootSagas() {
  yield all([
    accountSaga(),
    networkSaga(),
    importAccountsSaga(),
    stakingSaga(),
    transactionSaga(),
    rootWalletSaga(),
  ])
}
