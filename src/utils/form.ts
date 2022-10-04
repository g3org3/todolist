import z from 'zod'

export const getFormValues = <T>(current?: HTMLFormElement | null) => {
  if (!current) return

  return Array.from(current.children).reduce<any>((byName, input: any) => {
    if (!input.name || input.value === undefined) return byName
    byName[input.name] = input

    return byName
  }, {}) as T
}
