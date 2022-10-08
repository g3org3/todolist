import { useCallback, useEffect } from 'react'

export const useShortcut = (obj: any = {}, deps: any[]) => {
  let previousKey = ''
  const handleKeyPress = useCallback((event: any) => {
    let hash = (event.metaKey ? 'meta-' : '') + event.key
    if (previousKey === 'Control') {
      hash = 'meta-' + event.key
    }

    const func = obj[hash]
    if (typeof func === 'function') {
      func(event)
    }
    previousKey = event.key
  }, deps)

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress)

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])
}
