const EVENT_NAME = 'liquisight:scans-updated'

export function emitScansUpdated() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function onScansUpdated(handler: () => void) {
  if (typeof window === 'undefined') return () => {}

  const listener = () => handler()
  window.addEventListener(EVENT_NAME, listener)

  return () => {
    window.removeEventListener(EVENT_NAME, listener)
  }
}
