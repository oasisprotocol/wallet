import { Blank } from 'grommet-icons/es6/icons/Blank'
/* eslint-disable-next-line no-restricted-imports */
import { IconProps } from 'grommet-icons/es6/icons'

// From https://github.com/mui/material-ui/blob/4c336b8bd492749117a34947db44b0157a44c18b/packages/mui-icons-material/lib/esm/Lock.js#L6
export const MuiLockIcon = (props: IconProps) => (
  <Blank aria-hidden={undefined} aria-label="Lock" {...props}>
    <path
      fill="#333"
      d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1z"
    ></path>
  </Blank>
)
