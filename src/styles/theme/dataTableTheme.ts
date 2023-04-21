import { IDataTableStyles, ITheme } from 'react-data-table-component'

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
} as Partial<ITheme>

export const dataTableCustomStyles: IDataTableStyles = {
  headCells: {
    style: {
      fontSize: '18px',
    },
  },
  rows: {
    style: {
      fontSize: '16x',
    },
  },
}
