import { CiCirclePlus } from 'react-icons/ci'
import { GoGrabber } from 'react-icons/go'
import { Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import MarkdownText from './MarkdownText'
import { Action, ActionType } from '@/types/note.types'

type Props = {
  id: string
  content: string
  blockDispatch: Dispatch<Action>
}

const Block = ({ id, content, blockDispatch }: Props) => {
  const blockRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleGrabberClick = () => {
    blockRef.current?.focus()
    setIsFocused(true)
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target === blockRef.current && (e.key === 'Backspace' || e.key === 'Delete')) {
        blockDispatch({ type: ActionType.DELETE, payload: { id } })
        setIsFocused(false)
      }
    },
    [id, blockDispatch]
  )

  useEffect(() => {
    const currentBlock = blockRef.current
    if (isFocused && currentBlock) {
      currentBlock.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      currentBlock?.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFocused, handleKeyDown])

  return (
    <div
      ref={blockRef}
      tabIndex={0}
      className='group flex flex-wrap gap-1 max-w-4xl mx-auto focus:bg-base-200 focus:outline-none rounded-md transition-all duration-200 ease-in-out'
    >
      <div className='opacity-0 flex group-hover:opacity-100 text-primary h-10 p-2'>
        <GoGrabber size={24} onClick={handleGrabberClick} className='hover:cursor-grab' />
        <CiCirclePlus
          size={24}
          onClick={() => blockDispatch({ type: ActionType.CREATE, payload: { id } })}
          className='hover:cursor-pointer'
        />
      </div>
      <div className='flex-1'>
        <MarkdownText id={id} content={content} blockDispatch={blockDispatch} />
      </div>
    </div>
  )
}

export default Block
