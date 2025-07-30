import { useLoaderStore } from '@/stores/LoaderStore'

const AuthwallFallback = () => {
  const loadingProgress = useLoaderStore((state) => state.loadingProgress)

  return (
    <main className='flex flex-col items-center justify-center h-screen'>
      <div className='flex gap-2 items-center mb-10'>
        <img src='/logo.svg' alt='logo' className='w-10 md:w-20 h-10 md:h-20' />
        <h1 className='text-2xl md:text-4xl font-thin font-title'>DevNotes</h1>
      </div>
      {loadingProgress ? (
        <div className='skeleton w-56 bg-primary/20 rounded-full h-2 overflow-hidden'>
          <div
            className='h-full bg-primary transition-all duration-200 ease-in-out rounded-full'
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      ) : (
        <div className='skeleton h-2 w-56 bg-primary/20'></div>
      )}
    </main>
  )
}

export default AuthwallFallback
