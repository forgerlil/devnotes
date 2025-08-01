const NotesFallback = () => {
  return (
    <div className='flex min-h-screen bg-base-100'>
      <aside className='relative flex flex-col gap-4 w-56 bg-base-200 h-screen pt-4 px-3'>
        <div className=' flex items-center gap-2 pr-3'>
          <div className='skeleton mask mask-hexagon-2 h-8 w-8 shrink-0'></div>
          <div className='skeleton h-6 w-full'></div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='skeleton h-8 w-full'></div>
          <div className='skeleton h-8 w-full'></div>
        </div>
        <div className='flex flex-col gap-4 mt-4'>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
          <div className='skeleton h-4 w-full'></div>
        </div>
        <div className='absolute bottom-2 right-0 p-2 flex w-full justify-between gap-2'>
          <div className='skeleton h-8 w-8'></div>
          <div className='skeleton h-8 w-8'></div>
        </div>
      </aside>
      <main className='flex-1'>
        <div className='pt-4 px-12'>
          <h1 className='skeleton text-3xl h-8 w-1/2 mt-8'></h1>
        </div>
      </main>
    </div>
  )
}

export default NotesFallback
