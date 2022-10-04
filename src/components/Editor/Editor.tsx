import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { TRANSFORMERS } from '@lexical/markdown'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { LexicalEditor } from 'lexical'

import { ExcalidrawNode } from './nodes/ExcalidrawNode'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin'
import FormPlugin from './plugins/FormPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import ExampleTheme from './themes/ExampleTheme'

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>
}

interface Props {
  setEditor?: (e: LexicalEditor) => void
  value?: string | null
}

export default function Editor(props: Props) {
  return (
    <LexicalComposer
      // @ts-ignore
      initialConfig={{
        editorState: !!props.value?.trim() ? props.value : undefined,
        // The editor theme
        theme: ExampleTheme,
        // Handling of errors during update
        onError(error: Error) {
          console.error(error)
          throw error
        },
        // Any custom nodes go here
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          AutoLinkNode,
          LinkNode,
          ExcalidrawNode,
        ],
      }}
    >
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <ExcalidrawPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <FormPlugin setEditor={props.setEditor} />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  )
}
