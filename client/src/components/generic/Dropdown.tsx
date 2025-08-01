const DropdownHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      tabIndex={0}
      role='button'
      className={`btn btn-ghost m-1 h-fit py-2 w-full ${className || ''}`}
    >
      {children}
    </div>
  )
}

const DropdownItems = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <ul
      tabIndex={0}
      className={`dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm ${
        className || ''
      }`}
    >
      {children}
    </ul>
  )
}

const DropdownItem = ({ children }: { children: React.ReactNode }) => {
  return <li className='w-full'>{children}</li>
}

const Dropdown = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`dropdown ${className}`}>{children}</div>
}

Dropdown.Items = DropdownItems
Dropdown.Item = DropdownItem
Dropdown.Header = DropdownHeader

export default Dropdown
