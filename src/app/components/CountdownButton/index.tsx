import { Button, ButtonExtendedProps } from 'grommet/es6/components/Button'
import { useEffect, useState } from 'react'

export const CountdownButton = (props: Omit<ButtonExtendedProps, 'disabled'>) => {
  const [countdown, setCountdown] = useState(5)
  const isDisabled = countdown > 0

  useEffect(() => {
    const timerId = setInterval(
      () => {
        setCountdown(prevCountdown => {
          const newCount = prevCountdown - 1
          if (newCount <= 0) clearInterval(timerId)
          return newCount
        })
      },
      process.env.REACT_APP_E2E_TEST ? 200 : 1000,
    )

    return () => clearInterval(timerId)
  }, [])

  return (
    <Button
      {...props}
      primary
      disabled={isDisabled}
      label={
        <span>
          {props.label} {isDisabled && <span>({countdown})</span>}
        </span>
      }
    />
  )
}
