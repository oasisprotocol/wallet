/**
 *
 * ValidatorMediaInfo
 *
 */
import { ValidatorMediaInfo as MediaInfo } from 'app/state/staking/types'
import { Button } from 'grommet'
import { Home, MailOption, Twitter } from 'grommet-icons'
import React, { memo } from 'react'

interface Props {
  mediaInfo: MediaInfo
}

export const ValidatorMediaInfo = memo((props: Props) => {
  const info = props.mediaInfo
  return (
    <>
      {info.email_address && <MediaButton href={`mailto:${info.email_address}`} icon={<MailOption />} />}
      {info.website_link && <MediaButton href={info.website_link} icon={<Home />} />}
      {info.twitter_acc && <MediaButton href={info.twitter_acc} icon={<Twitter />} />}
    </>
  )
})

interface MediaButtonProps {
  icon: JSX.Element
  href: string
}
const MediaButton = memo((props: MediaButtonProps) => (
  <Button href={props.href} icon={props.icon} hoverIndicator size="small" target="_blank" />
))
