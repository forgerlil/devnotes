import { Link } from 'react-router'

const NotFound = () => {
  return (
    <main className='flex-1 my-20'>
      <h1 className='text-3xl font-bold tracking-wide text-center mb-12 font-title'>Not Found</h1>
      <p className='text-center text-xl mb-12'>
        The page you are looking for does not exist or has been moved...
      </p>
      <div className='flex justify-center'>
        <Link to='/' className='btn btn-primary'>
          Take me home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
