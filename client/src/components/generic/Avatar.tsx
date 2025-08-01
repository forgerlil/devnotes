import { User } from '@/types/auth.types'

const Avatar = ({
  user,
  className,
  size = 8,
}: {
  user: User
  className?: string
  size?: number
}) => {
  return (
    <div className='avatar'>
      <div className={`mask mask-hexagon-2 w-${size} h-${size} ${className}`}>
        <img
          src={user.avatar || 'https://placedog.net/80/80'}
          alt={`${user.displayName || user.email}'s avatar`}
        />
      </div>
    </div>
  )
}

export default Avatar
