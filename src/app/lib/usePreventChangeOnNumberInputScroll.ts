import { TextInputProps } from 'grommet/es6/components/TextInput'

export const usePreventChangeOnNumberInputScroll = ({ onWheel }: Pick<TextInputProps, 'onWheel'> = {}): Pick<
  TextInputProps,
  'onWheel'
> => {
  return {
    onWheel: e => {
      onWheel?.(e)

      const target = e.target as HTMLElement
      if (target !== document.activeElement) return

      // Prevents input value change
      target.blur()

      // Focus after blur
      setTimeout(() => {
        target.focus()
      }, 0)
    },
  }
}
