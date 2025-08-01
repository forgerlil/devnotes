import { FaStar } from 'react-icons/fa'
import { CiStar } from 'react-icons/ci'
import { Link } from 'react-router'
import { Note } from '@/types/note.types'

const NoteMenu = ({ notes }: { notes: Note[] }) => {
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

export default NoteMenu
