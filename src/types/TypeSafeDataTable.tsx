import { ReactNode } from 'react'
// eslint-disable-next-line no-restricted-imports
import DataTable, { TableColumn, IDataTableProps, Media } from 'react-data-table-component'

export interface ITypeSafeDataTableColumn<T> extends Omit<TableColumn<T>, 'hide'> {
  /** Must be unique, but doesn't need to be a field in data objects. */
  id: string
  hide?: TableColumn<T>['hide'] | `${Media}`
}
export interface ITypeSafeDataTableProps<T> extends Omit<IDataTableProps<T>, 'keyField' | 'columns'> {
  keyField: Extract<keyof T, string>
  columns: ITypeSafeDataTableColumn<T>[]
}

/**
 * Helper component for react-data-table-component custom cells
 *
 * react-data-table-component handles expandableRows correctly only for text nodes
 * or it requires to apply data-tag="allowRowEvents" to the innermost element which is hard to control
 *
 * To prevent expanding add `onClick={e => e.stopPropagation()}`.
 *
 * TODO: check if this is still needed in v7.7.0
 */
function ExpandableCell(props: { children: ReactNode }) {
  return (
    <div
      onClick={e => {
        if (e.currentTarget.parentElement?.getAttribute('data-tag') !== 'allowRowEvents') {
          throw new Error('Could not find table cell')
        }
        e.currentTarget.parentElement!.click()
      }}
    >
      {props.children}
    </div>
  )
}

/**
 * Overrides DataTable type to ensure:
 * - `keyField` on rows is not missing and is valid
 * - `id` on cols is not missing
 *
 * Fixes expanding rows when clicking non-plaintext cells.
 */
export function TypeSafeDataTable<T>(props: ITypeSafeDataTableProps<T>): React.ReactElement {
  return (
    <DataTable
      {...props}
      columns={
        props.columns.map(col => ({
          ...col,
          cell: (row, rowIndex, column, id) => {
            return <ExpandableCell>{col.cell!(row, rowIndex, column, id)}</ExpandableCell>
          },
        })) as TableColumn<T>[]
      }
    />
  )
}
