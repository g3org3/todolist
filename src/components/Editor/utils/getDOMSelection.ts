export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

export const getSelection = (): Selection | null => (CAN_USE_DOM ? window.getSelection() : null)
