import { Link } from 'react-router'

const App = () => {
  return (
    <main>
      <div className='hero min-h-[60dvh]'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <h1 className='text-5xl font-bold font-title'>DevNotes</h1>
            <p className='py-6'>Keep all your coding notes in one place!</p>
            <Link to='/login' className='btn btn-primary'>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
