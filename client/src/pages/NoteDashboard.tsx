import { useReducer } from 'react'
import Block from '@/components/notes/Block'
import { Action, ActionType, Block as BlockType } from '@/types/note.types'

// TODO: Refactor logic to send to backend instead
const reducer = (state: BlockType[], action: Action): BlockType[] => {
  const { type, payload } = action
  switch (type) {
    case ActionType.CREATE: {
      const newBlock = { id: crypto.randomUUID(), content: '' }
      const insertIndex = state.findIndex((block) => block.id === payload.id)

      if (insertIndex === -1) return [...state, newBlock]

      const newBlocks = [...state]
      newBlocks.splice(insertIndex + 1, 0, newBlock)
      return newBlocks
    }
    case ActionType.UPDATE: {
      return state.map((block) =>
        block.id === payload.id ? { ...block, content: payload.content ?? '' } : block
      )
    }
    case ActionType.DELETE: {
      return state.filter((block) => block.id !== payload.id)
    }
    default:
      throw new Error('Invalid action type')
  }
}

const mockBlocks: BlockType[] = [
  {
    id: crypto.randomUUID(),
    content: `# Welcome to DevNotes!`,
  },
  {
    id: crypto.randomUUID(),
    content: `This is a **markdown-enabled** note-taking application. You can use various markdown features:`,
  },
  {
    id: crypto.randomUUID(),
    content: `## Features`,
  },
  {
    id: crypto.randomUUID(),
    content: `- **Bold text** and *italic text*`,
  },
  {
    id: crypto.randomUUID(),
    content: `- \`Inline code\` and code blocks`,
  },
  {
    id: crypto.randomUUID(),
    content: `- [Links](https://example.com)`,
  },
  {
    id: crypto.randomUUID(),
    content: `- Lists and numbered lists`,
  },
  {
    id: crypto.randomUUID(),
    content: `### Code Example`,
  },
  {
    id: crypto.randomUUID(),
    content: `\`\`\`javascript
function hello() {
console.log("Hello, World!");
}
\`\`\``,
  },
  {
    id: crypto.randomUUID(),
    content: `### Lists`,
  },
  {
    id: crypto.randomUUID(),
    content: `- Item 1`,
  },
  {
    id: crypto.randomUUID(),
    content: `- Item 2`,
  },
  {
    id: crypto.randomUUID(),
    content: `  - Nested item`,
  },
  {
    id: crypto.randomUUID(),
    content: `- Item 3`,
  },
  {
    id: crypto.randomUUID(),
    content: `1. First item`,
  },
  {
    id: crypto.randomUUID(),
    content: `2. Second item`,
  },
  {
    id: crypto.randomUUID(),
    content: `3. Third item`,
  },
  {
    id: crypto.randomUUID(),
    content: `> This is a blockquote with some important information.`,
  },
  {
    id: crypto.randomUUID(),
    content: `Click on any markdown block to edit it!`,
  },
]

const NoteDashboard = () => {
  const [blocks, dispatch] = useReducer(reducer, mockBlocks)

  return (
    <div className='mt-20 px-12'>
      {blocks.map((block) => (
        <Block key={'block-' + block.id} blockDispatch={dispatch} {...block} />
      ))}
    </div>
  )
}

export default NoteDashboard
