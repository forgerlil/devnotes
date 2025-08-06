import { Outlet } from 'react-router'
import Sidebar from '@/components/notes/Sidebar'
import { useAuthStore } from '@/stores/AuthStore'
import AuthwallFallback from '@/components/auth/AuthwallFallback'

const NoteLayout = () => {
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut)

  if (isLoggingOut) return <AuthwallFallback />

  return (
    <div className='flex min-h-screen bg-base-100'>
      <Sidebar />
      <main className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
        <Outlet />
      </main>
    </div>
  )
}

export default NoteLayout
