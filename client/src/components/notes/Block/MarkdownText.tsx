import { useState, useRef, useEffect, useCallback, Dispatch } from 'react'
import Markdown from 'react-markdown'
import { getCodeClassName } from '@/lib/highlight'
import { Action, ActionType } from '@/types/note.types'

interface Props {
  id: string
  content: string
  blockDispatch: Dispatch<Action>
  className?: string
  placeholder?: string
}

const MarkdownText = ({
  id,
  content,
  blockDispatch,
  className = '',
  placeholder = 'Click to edit...',
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing) setEditContent(content)
  }, [isEditing, content])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsEditing(true)
      setEditContent(content)
    },
    [content]
  )

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (editContent !== content)
      blockDispatch({ type: ActionType.UPDATE, payload: { id, content: editContent } })
  }, [editContent, content, blockDispatch, id])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).textContent || ''
    setEditContent(newContent)
  }, [])

  if (isEditing) {
    return (
      <div
        ref={contentRef}
        className={`min-h-10 rounded-md focus:outline-none p-2 bg-base-200 font-mono text-sm whitespace-pre-wrap break-words ${className}`}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onInput={handleInput}
        data-placeholder={placeholder}
      >
        {editContent}
      </div>
    )
  }

  return (
    <div
      className={`min-h-10 rounded-md hover:cursor-text focus:outline-none p-2 ${className}`}
      onClick={handleClick}
    >
      <Markdown
        components={{
          p: ({ children, ...props }) => <p {...props}>{children}</p>,
          h1: ({ children, ...props }) => (
            <h1 className='text-3xl font-bold mb-2 text-primary' {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className='text-2xl font-bold mb-2 text-primary' {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className='text-xl font-bold mb-2 text-accent' {...props}>
              {children}
            </h3>
          ),
          code: ({ children, ...props }) => {
            const language = props.className?.split('-')[1]

            if (language) {
              const codeClassName = getCodeClassName(language)
              return (
                <pre className='bg-base-300 p-4 rounded-lg overflow-x-auto'>
                  <code className={codeClassName} {...props}>
                    {children}
                  </code>
                </pre>
              )
            }

            return (
              <code
                className='bg-base-300 px-1 py-0.5 rounded text-sm font-mono text-accent'
                {...props}
              >
                {children}
              </code>
            )
          },
          blockquote: ({ children, ...props }) => (
            <blockquote
              className='border-l-4 border-primary pl-4 italic bg-base-300/50 py-2 my-2'
              {...props}
            >
              {children}
            </blockquote>
          ),
          ul: ({ children, ...props }) => (
            <ul className='list-disc list-inside space-y-1 ml-4' {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className='list-decimal list-inside space-y-1 ml-4' {...props}>
              {children}
            </ol>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className='text-primary hover:underline'
              target='_blank'
              rel='noopener noreferrer'
              {...props}
            >
              {children}
            </a>
          ),
          em: ({ children, ...props }) => (
            <em className='italic' {...props}>
              {children}
            </em>
          ),
          strong: ({ children, ...props }) => (
            <strong className='font-semibold' {...props}>
              {children}
            </strong>
          ),
        }}
      >
        {content || placeholder}
      </Markdown>
    </div>
  )
}

export default MarkdownText
