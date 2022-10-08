import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalEditor } from 'lexical'
import { MutableRefObject } from 'react'

interface Props {
  editorRef: MutableRefObject<LexicalEditor | undefined>
  value?: string
}

const FormPlugin = (props: Props) => {
  const [editor] = useLexicalComposerContext()

  props.editorRef.current = editor

  return null
}

export default FormPlugin
