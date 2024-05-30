import { useEffect } from 'react'

const handleWheel = (event: WheelEvent) => {
  const { tagName, type } = event.target as HTMLInputElement
  if (tagName.toLowerCase() === 'input' && type === 'number') {
    event.preventDefault()
  }
}

export const usePreventChangeOnNumberInputScroll = () => {
  useEffect(() => {
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [])
}
