import React from 'react'
import { render } from '@testing-library/react'
import { Language } from 'styles/theme/icons/language/Language'
import { Language as GrommetLanguage } from 'grommet-icons/es6/icons/Language'

test('Custom Language icon should behave like grommet-icons', () => {
  const customIcon = render(<Language />)
  const grommetIcon = render(<GrommetLanguage />)
  customIcon.container.querySelector('path')!.remove()
  grommetIcon.container.querySelector('path')!.remove()
  expect(customIcon.container.innerHTML).toEqual(grommetIcon.container.innerHTML)
})
