import * as React from 'react'
// eslint-disable-next-line no-restricted-imports
import DataTable from 'react-data-table-component'
import { TypeSafeDataTable } from 'types/TypeSafeDataTable'

describe('type-only test', () => {
  describe('TypeSafeDataTable is strictly typed', () => {
    it('correct usage', () => {
      expect(
        <TypeSafeDataTable
          data={[
            { idField: 1, value: 1 },
            { idField: 2, value: 1 },
          ]}
          columns={[
            {
              name: 'value',
              id: 'value',
            },
          ]}
          keyField="idField"
        ></TypeSafeDataTable>,
      ).toBeDefined()
    })

    it('detect mistakes', () => {
      expect(
        <TypeSafeDataTable
          data={[
            { idField: 1, value: 1 },
            { idField: 2, value: 1 },
          ]}
          columns={[
            // @ts-expect-error Expect typescript to detect missing "id" field
            {
              name: 'value',
            },
          ]}
          keyField="idField"
        ></TypeSafeDataTable>,
      ).toBeDefined()

      expect(
        // @ts-expect-error Expect typescript to detect missing "keyField" field
        <TypeSafeDataTable
          data={[
            { idField: 1, value: 1 },
            { idField: 2, value: 1 },
          ]}
          columns={[
            {
              name: 'value',
              id: 'value',
            },
          ]}
        ></TypeSafeDataTable>,
      ).toBeDefined()

      expect(
        <TypeSafeDataTable
          data={[
            { idField: 1, value: 1 },
            { idField: 2, value: 1 },
          ]}
          columns={[
            {
              name: 'value',
              id: 'value',
            },
          ]}
          // @ts-expect-error Expect typescript to detect incorrect field
          keyField="does_not_exist"
        ></TypeSafeDataTable>,
      ).toBeDefined()
    })

    it('original DataTable is not strict', () => {
      expect(
        <DataTable
          data={[
            { idField: 1, value: 1 },
            { idField: 2, value: 1 },
          ]}
          columns={[
            {
              name: 'value',
            },
          ]}
        ></DataTable>,
      ).toBeDefined()
    })
  })
})
