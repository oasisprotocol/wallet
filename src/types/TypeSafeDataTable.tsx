import DataTable, { IDataTableColumn, IDataTableProps } from 'react-data-table-component'

export interface ITypeSafeDataTableColumn<T> extends IDataTableColumn<T> {
  id: string
}
export interface ITypeSafeDataTableProps<T> extends Omit<IDataTableProps<T>, 'keyField'> {
  keyField: keyof T
  columns: ITypeSafeDataTableColumn<T>[]
}

/**
 * Overrides DataTable type to ensure:
 * - `keyField` on rows is not missing and is valid
 * - `id` on cols is not missing
 */
export function TypeSafeDataTable<T>(props: ITypeSafeDataTableProps<T>): React.ReactElement {
  return <DataTable {...(props as IDataTableProps<T>)} />
}
