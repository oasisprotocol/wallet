import * as React from 'react'
import { render } from '@testing-library/react'

import { AccountSelector } from '..'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

describe('<AccountSelector  />', () => {
  it.todo('should match snapshot')
})
