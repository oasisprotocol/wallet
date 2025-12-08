import { ReactNode } from 'react'
import styled from 'styled-components'
import { Box } from 'grommet/es6/components/Box'
import { FormField } from 'grommet/es6/components/FormField'
import { Select } from 'grommet/es6/components/Select'
import { Tip } from 'grommet/es6/components/Tip'
import { CircleQuestion } from 'grommet-icons/es6/icons/CircleQuestion'

const StyledBox = styled(Box)`
  position: relative;
  flex-direction: row;
`

const StyledIconContainer = styled(Box)`
  position: absolute;
  top: 10px;
  left: 12px;
`

interface SelectWithIconProps<T> {
  icon: ReactNode
  id: string
  label: string
  name: string
  onChange: (option: T) => void
  options: { value: T; label: string }[]
  value: string
  tooltip?: string
}

export function SelectWithIcon<T>({
  icon,
  id,
  label,
  name,
  onChange,
  options,
  value,
  tooltip,
}: SelectWithIconProps<T>) {
  return (
    <FormField
      name={name}
      label={
        <>
          {label}
          {tooltip && (
            <>
              {' '}
              <Tip content={tooltip} dropProps={{ align: { bottom: 'top' } }}>
                <CircleQuestion size="16px" />
              </Tip>
            </>
          )}
        </>
      }
      contentProps={{ border: false }}
      style={{ margin: 0 }}
    >
      <StyledBox>
        <StyledIconContainer>{icon}</StyledIconContainer>
        <Select
          id={id}
          labelKey="label"
          name={name}
          onChange={({ option }) => onChange(option.value)}
          options={options}
          style={{ paddingLeft: '50px' }}
          value={value}
          valueKey={{ key: 'value', reduce: true }}
        />
      </StyledBox>
    </FormField>
  )
}
