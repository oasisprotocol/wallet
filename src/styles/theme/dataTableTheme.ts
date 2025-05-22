import { TableStyles, Theme } from 'react-data-table-component'

export const dataTableTheme = {
  background: { default: 'unset' },
  highlightOnHover: {
    default: '#88888833',
    text: 'unset',
  },
  text: {
    primary: 'unset',
    secondary: 'unset',
    disabled: 'unset',
  },
  sortFocus: {
    default: 'unset',
  },
  divider: { default: '#AAAAAAaa' },
} as Partial<Theme>

export const dataTableCustomStyles: TableStyles = {
  headCells: {
    style: {
      fontSize: '16px',
    },
  },
  rows: {
    style: {
      fontSize: '16px',
    },
  },
}
