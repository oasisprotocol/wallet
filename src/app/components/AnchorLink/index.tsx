import { Anchor, AnchorExtendedProps } from 'grommet/es6/components/Anchor'
import { Link, LinkProps } from 'react-router-dom'
import React from 'react'

type AnchorLinkProps = LinkProps & AnchorExtendedProps

/**
 * Behaves like {@link Link} and styled like {@link Anchor}. Needed because:
 * - Link isn't styled but routes correctly
 * - Anchor is styled but does a full reload
 */
export const AnchorLink = (props: AnchorLinkProps) => {
  return <Anchor as={Link} {...props} />
}
