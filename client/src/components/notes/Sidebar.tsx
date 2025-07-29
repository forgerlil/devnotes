import { useAuthStore } from '@/stores/AuthStore'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa'
import { CiStickyNote, CiStar } from 'react-icons/ci'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

// TODO: Remove this once it's in the backend
interface Note {
  id: string
  title: string
  content: string
  isFavorite: boolean
  space?: string
}

const SidebarActions = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className='flex flex-col gap-2 mt-8'>
      <button className='btn btn-ghost justify-start gap-2 hover:bg-base-300 rounded-md p-2 font-normal'>
        <CiStickyNote className='text-2xl flex-shrink-0' />
        <p
          className={`transition-all duration-200 ease-out whitespace-nowrap ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Create New Note
        </p>
      </button>
      <button className='btn btn-ghost justify-start gap-2 hover:bg-base-300 rounded-md p-2 font-normal'>
        <HiOutlineMagnifyingGlass className='text-2xl flex-shrink-0' />
        <p
          className={`transition-all duration-200 ease-in-out whitespace-nowrap ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Search Notes
        </p>
      </button>
    </div>
  )
}

const NoteList = ({ notes }: { notes: Note[] }) => {
  return (
    <div className='flex flex-col gap-2 mt-8'>
      {notes.map((note) => (
        <div className='btn btn-ghost justify-start gap-2 font-normal'>
          {note.isFavorite ? (
            <FaStar className='text-primary flex-shrink-0' />
          ) : (
            <CiStar className='flex-shrink-0' />
          )}
          <Link to={`/notes/${note.id}`} className='w-[95%]'>
            <p className='truncate text-left'>{note.title}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}

const Sidebar = () => {
  const { user } = useAuthStore()
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
  ]

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`relative bg-base-200 hidden md:block transition-all duration-100 ease-out px-3 pt-2 ${
          !isOpen && 'md:w-16'
        }`}
        style={isOpen ? { width: `${width}px` } : undefined}
      >
        <h2 className=''>{user?.email}</h2>

        <SidebarActions isOpen={isOpen} />

        {isOpen && <NoteList notes={notes} />}

        <button
          className='btn btn-ghost absolute bottom-3 right-2 text-xl'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
        </button>

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
