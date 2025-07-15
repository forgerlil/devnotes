import { Link } from 'react-router'

const App = () => {
  return (
    <div className=''>
      <h1>DevNotes, keep all your coding notes in one place!</h1>
      <Link to='/login' className='btn btn-primary'>
        Login
      </Link>
      <Link to='/register' className='btn btn-primary'>
        Register
      </Link>
    </div>
  )
}

export default App
