import { useAuthStore } from '@/stores/AuthStore'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router'

const NoteDashboard = () => {
  const navigate = useNavigate()
  const { user, token, setUser, setToken } = useAuthStore()

  if (!user) return <Navigate to='/login' />

  // TODO: Move this to action
  const logout = async () => {
    try {
      await axios.post(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      setUser(null)
      setToken(null)

      await navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='pt-4 px-12'>
      <h1 className='text-3xl font-thin tracking-wide mb-8 font-title'>NoteDashboard</h1>
      <div className='flex flex-col gap-4'>
        <p>Notes will be dynamically rendered here!</p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia dignissimos asperiores
          quo ipsa expedita, ipsum vel ut sint eos amet consequuntur non! Expedita, est officiis quo
          blanditiis dolorem quod minima labore atque saepe corrupti. Minima alias voluptate facilis
          optio quas laboriosam, dignissimos rem laborum unde beatae et nulla voluptatem obcaecati
          iste velit atque excepturi? Adipisci, aperiam hic deserunt est, animi sint aspernatur
          voluptas quia dolore quo iusto. Nisi repudiandae maxime ducimus esse nesciunt dolore, vel
          magni eos exercitationem similique omnis earum voluptatibus voluptates, totam deleniti ab
          quibusdam, magnam dolorem nobis! Atque ex odio numquam earum at dolor ratione nobis
          explicabo!
        </p>
        <p>
          Lorem ipsum dolor <span className='italic'>sit amet consectetur</span> adipisicing elit.
          Id doloremque, facere ut asperiores quaerat velit.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, illo beatae nam velit,
          eaque cumque nesciunt obcaecati reprehenderit dignissimos ut, voluptatibus deleniti.
          Eligendi nostrum{' '}
          <span className='underline'>
            tempora eos quidem, architecto sed nam corrupti veniam accusantium consequatur animi
            illum quasi, iste eum aliquam enim
          </span>{' '}
          voluptatum. Vitae dolorum, nam ipsa vel facilis eligendi, autem, ab dignissimos suscipit
          nemo blanditiis alias dolores! Recusandae, debitis sed corporis sit repellendus eos, aut
          beatae reiciendis repudiandae veritatis, ipsa architecto. Sapiente consequuntur, doloribus
          cumque nihil tenetur quia distinctio repellat, ipsa ab labore magnam omnis sit nobis a
          expedita molestiae vitae laborum assumenda beatae? Delectus hic doloribus eius nesciunt
          nisi a vero dolores? Nulla cumque eum{' '}
          <span className='font-extralight'>reiciendis dolor?</span> Sequi excepturi voluptates
          autem facilis sunt laborum aut molestias alias velit similique eos, accusamus quis quas
          nam quae dolore, illo expedita eligendi quos. Tempore enim doloribus hic voluptates cumque
          architecto quos quis saepe quam dolor quod corrupti, nisi distinctio repudiandae
          voluptatibus tenetur doloremque in mollitia eligendi facere magni assumenda quasi
          inventore eaque. Quaerat maiores sapiente iste molestiae voluptates ducimus asperiores ut
          facere in ad vitae reprehenderit magni, culpa natus quam non. Aliquid beatae voluptates
          laboriosam, nemo voluptas ullam! Accusantium facere molestiae, repellat, ex dicta vero,
          amet eum molestias ipsa numquam officiis soluta.
        </p>
        <div>
          <button onClick={logout} className='btn btn-primary'>
            Logout
          </button>
          <Link className='btn btn-primary' to={`/notes/${crypto.randomUUID()}`}>
            Other note
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NoteDashboard
