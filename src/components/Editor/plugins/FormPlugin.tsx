import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalEditor } from 'lexical'

interface Props {
  setEditor?: (editor: LexicalEditor) => void
  value?: string
}

const FormPlugin = (props: Props) => {
  const [editor] = useLexicalComposerContext()

  if (props.setEditor) props.setEditor(editor)

  return null
}

export default FormPlugin
