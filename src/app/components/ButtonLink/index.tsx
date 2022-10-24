import { ButtonExtendedProps } from 'grommet'
import { Link, To } from 'react-router-dom'
import React from 'react'
import { Button } from 'types/grommet/Button'

type ButtonLinkProps = Omit<ButtonExtendedProps, 'label'> & { label: string; to: To }

/**
 * Behaves like {@link Link} and styled like {@link Button}. Needed because:
 * - Link isn't styled but routes correctly
 * - Button is styled but can't navigate
 * - Wrapping Link around Button adds two focusable elements
 */
export const ButtonLink = (props: ButtonLinkProps) => {
  const { label, to, ...buttonProps } = props
  return (
    <Link aria-label={label} to={to}>
      <Button {...buttonProps} label={label} tabIndex={-1} />
    </Link>
  )
}
