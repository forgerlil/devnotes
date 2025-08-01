import { useState, useRef, useCallback, useEffect } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import ThemeToggle from '@/components/generic/ThemeToggle'
import SidebarActions from './SidebarActions'
import NoteMenu from './NoteMenu'
import { Note } from '@/types/note.types'
import UserActions from './UserActions'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [width, setWidth] = useState(localStorage.getItem('sidebarWidth') || 256)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  const MIN_WIDTH = 208 // w-52 = 208px
  const MAX_WIDTH = 384 // w-96 = 384px

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return

      const rect = sidebarRef.current.getBoundingClientRect()
      const newWidth = e.clientX - rect.left

      // Constrain width between MIN_WIDTH and MAX_WIDTH
      const constrainedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))
      setWidth(constrainedWidth)
    },
    [isResizing]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    localStorage.setItem('sidebarWidth', width.toString())
  }, [width])

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // TODO: Remove this once it's in the backend
  const notes: Note[] = [
    {
      id: crypto.randomUUID(),
      title: 'Python Lists',
      content: 'This is the content of note 1',
      space: 'python',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'JS Closures',
      content: 'This is the content of note 3',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'React Hooks',
      content: 'This is the content of note 2',
      isFavorite: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Event loop and the call stack, micro and macro tasks',
      content: 'This is the content of note 3',
      isFavorite: false,
      space: 'javascript',
    },
    {
      id: crypto.randomUUID(),
      title: 'Python Lists',
      content: 'This is the content of note 1',
      space: 'python',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'JS Closures',
      content: 'This is the content of note 3',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'React Hooks',
      content: 'This is the content of note 2',
      isFavorite: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Event loop and the call stack, micro and macro tasks',
      content: 'This is the content of note 3',
      isFavorite: false,
      space: 'javascript',
    },
    {
      id: crypto.randomUUID(),
      title: 'Python Lists',
      content: 'This is the content of note 1',
      space: 'python',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'JS Closures',
      content: 'This is the content of note 3',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'React Hooks',
      content: 'This is the content of note 2',
      isFavorite: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Event loop and the call stack, micro and macro tasks',
      content: 'This is the content of note 3',
      isFavorite: false,
      space: 'javascript',
    },
    {
      id: crypto.randomUUID(),
      title: 'Python Lists',
      content: 'This is the content of note 1',
      space: 'python',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'JS Closures',
      content: 'This is the content of note 3',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'React Hooks',
      content: 'This is the content of note 2',
      isFavorite: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Event loop and the call stack, micro and macro tasks',
      content: 'This is the content of note 3',
      isFavorite: false,
      space: 'javascript',
    },
    {
      id: crypto.randomUUID(),
      title: 'Python Lists',
      content: 'This is the content of note 1',
      space: 'python',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'JS Closures',
      content: 'This is the content of note 3',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'React Hooks',
      content: 'This is the content of note 2',
      isFavorite: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Event loop and the call stack, micro and macro tasks',
      content: 'This is the content of note 3',
      isFavorite: false,
      space: 'javascript',
    },
    {
      id: crypto.randomUUID(),
      title: 'Python Lists',
      content: 'This is the content of note 1',
      space: 'python',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'JS Closures',
      content: 'This is the content of note 3',
      isFavorite: true,
    },
    {
      id: crypto.randomUUID(),
      title: 'React Hooks',
      content: 'This is the content of note 2',
      isFavorite: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Last',
      content: 'This is the content of note 3',
      isFavorite: false,
      space: 'javascript',
    },
  ]

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`sticky bg-base-200 flex flex-col transition-all duration-100 ease-out pl-3 pt-2 top-0 h-screen z-10 overflow-visible ${
          !isOpen && 'w-16'
        }`}
        style={isOpen ? { width: `${width}px` } : undefined}
      >
        <div className={`flex-shrink-0 pr-3 ${!isOpen ? 'relative' : ''}`}>
          <UserActions isOpen={isOpen} />
        </div>

        <div className='flex-shrink-0 pr-3'>
          <SidebarActions isOpen={isOpen} />
          {isOpen && <hr className='my-4 text-primary/50 mr-3' />}
        </div>
        {isOpen && <NoteMenu notes={notes} />}

        <div
          className={`absolute bottom-0 right-0 flex bg-base-200 w-full py-2 px-3 items-center ${
            isOpen ? 'justify-between' : 'justify-end'
          }`}
        >
          {isOpen && <ThemeToggle icon />}
          <button className='btn btn-ghost' onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
          </button>
        </div>

        {isOpen && (
          <div
            className='absolute right-0 top-0 bottom-0 w-4 cursor-col-resize'
            onMouseDown={handleMouseDown}
          >
            <div className='absolute right-0 top-0 bottom-0 w-1 hover:bg-linear-to-b hover:from-transparent hover:via-primary/20 hover:to-transparent transition-colors duration-50' />
          </div>
        )}
      </aside>

      {isResizing && <div className='fixed inset-0 z-50 cursor-col-resize' />}
    </>
  )
}

export default Sidebar
