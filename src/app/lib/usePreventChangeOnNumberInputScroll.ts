import { RefObject, useRef } from 'react'
import { TextInputProps } from 'grommet/es6/components/TextInput'

export const usePreventChangeOnNumberInputScroll = ({
  onWheel,
  onFocus,
  onMouseOut,
}: Pick<TextInputProps, 'onWheel' | 'onFocus' | 'onMouseOut'> = {}): Pick<
  TextInputProps,
  'onWheel' | 'onFocus' | 'onMouseOut' | 'ref'
> => {
  const inputRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>
  const isFocused = useRef(false)

  return {
    onWheel: e => {
      onWheel?.(e)

      const target = e.target as HTMLElement

      // Prevents input value change
      target.blur()
      // Prevents scrolling
      e.stopPropagation()

      if (!isFocused.current) return

      // Focus after blur
      setTimeout(() => {
        target.focus()
      }, 0)
    },
    ref: inputRef,
    onFocus: e => {
      onFocus?.(e)

      isFocused.current = true
    },
    onMouseOut: e => {
      onMouseOut?.(e)

      if (document.activeElement === inputRef?.current) {
        isFocused.current = false
      }
    },
  }
}
