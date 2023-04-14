import { IDataTableStyles, ITheme } from 'react-data-table-component'

export const dataTableTheme = {
  background: { default: 'false' },
  highlightOnHover: {
    default: '#88888833',
    text: 'false',
  },
  text: {
    primary: 'false',
    secondary: 'false',
    disabled: 'false',
  },
  sortFocus: {
    default: 'false',
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
