import { render, screen } from '@testing-library/react'

import { ShortAddress } from '..'
import type { UseTranslationResponse, Trans } from 'react-i18next'

type TransType = typeof Trans
jest.mock('react-i18next', () => ({
  Trans: (({ i18nKey }) => <>{i18nKey}</>) as TransType,
  useTranslation: () => {
    return {
      t: str => str,
    } as UseTranslationResponse<'translation'>
  },
}))

describe('<ShortAddress  />', () => {
  it('should render short address', () => {
    render(<ShortAddress address="qwertyuiopasdfghjkl" />)
    expect(screen.getByText('qwertyuiop...sdfghjkl')).toBeInTheDocument()
  })

  it('should fallback to unavailable label when short address cannot be created', () => {
    render(<ShortAddress address="" />)
    expect(screen.getByText('common.unavailable')).toBeInTheDocument()
  })
})
