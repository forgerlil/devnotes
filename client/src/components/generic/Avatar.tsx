import { User } from '@/types/auth.types'

const sizeClasses = {
  4: 'w-4 h-4',
  6: 'w-6 h-6',
  8: 'w-8 h-8',
  10: 'w-10 h-10',
  12: 'w-12 h-12',
  16: 'w-16 h-16',
  20: 'w-20 h-20',
  24: 'w-24 h-24',
} as const

const Avatar = ({
  user,
  className,
  size = 8,
}: {
  user: User
  className?: string
  size?: keyof typeof sizeClasses
}) => {
  return (
    <div className={`avatar ${className || ''}`}>
      <div className={`mask mask-hexagon-2 ${sizeClasses[size]}`}>
        <img
          src={user.avatar || 'https://placedog.net/80/80'}
          alt={`${user.displayName || user.email}'s avatar`}
        />
      </div>
    </div>
  )
}

export default Avatar
