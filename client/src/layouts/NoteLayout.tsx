import { Outlet } from 'react-router'
import Sidebar from '@/components/notes/Sidebar'

const NoteLayout = () => {
  return (
    <>
      <div className='flex min-h-screen bg-base-100'>
        <Sidebar />
        <main className='relative flex flex-col flex-1 lg:overflow-y-auto lg:overflow-x-hidden'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default NoteLayout
