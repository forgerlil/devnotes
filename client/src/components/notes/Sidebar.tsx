import { useAuthStore } from '@/stores/AuthStore'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router'
import { FaStar } from 'react-icons/fa'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { CiStar } from 'react-icons/ci'
import { IoCreateOutline } from 'react-icons/io5'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import ThemeToggle from '../generic/ThemeToggle'
import { User } from '@/types/auth.types'

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
    <div className='relative flex flex-col gap-2 mt-4 overflow-y-auto overflow-x-hidden'>
      <div className='flex-shrink-0 flex flex-col gap-2'>
        <button className='btn btn-ghost border-none justify-start gap-2 hover:bg-base-300 rounded-md p-2 font-normal'>
          <IoCreateOutline className='text-2xl flex-shrink-0' />
          <p
            className={`transition-all duration-200 ease-out whitespace-nowrap ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Create New Note
          </p>
        </button>
        <button className='btn btn-ghost border-none justify-start gap-2 hover:bg-base-300 rounded-md p-2 font-normal'>
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
    </div>
  )
}

const NoteList = ({ notes }: { notes: Note[] }) => {
  return (
    <div className='flex flex-col gap-2 mb-16 overflow-y-auto overflow-x-hidden'>
      {notes.map((note) => (
        <div
          className='btn btn-ghost border-none hover:bg-base-300 justify-start gap-2 font-normal pr-3'
          key={note.id}
        >
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

const Avatar = ({ isOpen, user }: { isOpen: boolean; user: User }) => {
  return (
    <div className='relative btn btn-ghost border-none justify-start gap-2 font-normal w-full h-fit py-2 px-1 transition-all duration-200 ease-in-out hover:bg-base-300'>
      <div className='avatar'>
        <div className='mask mask-hexagon-2 w-9 h-9 bg-primary opacity-70 absolute -top-0.5 -left-0.5'></div>
        <div className='mask mask-hexagon-2 w-8 h-8'>
          <img src='https://placedog.net/80/80' />
        </div>
      </div>
      <p
        className={`transition-all duration-200 ease-in-out text-sm truncate ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {user?.email}
      </p>
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
        className={`sticky bg-base-200 hidden md:flex md:flex-col transition-all duration-100 ease-out pl-3 pt-2 top-0 h-screen ${
          !isOpen && 'md:w-16'
        }`}
        style={isOpen ? { width: `${width}px` } : undefined}
      >
        <div className='flex-shrink-0'>
          <Avatar isOpen={isOpen} user={user!} />
        </div>

        <div className='flex-shrink-0'>
          <SidebarActions isOpen={isOpen} />
          {isOpen && <hr className='my-4 text-primary/50 mr-3' />}
        </div>
        {isOpen && <NoteList notes={notes} />}

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
