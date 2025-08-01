import { IoCreateOutline } from 'react-icons/io5'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

const SidebarActions = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className='relative flex flex-col gap-2 mt-4 overflow-y-auto overflow-x-hidden'>
      <div className='flex-shrink-0 flex flex-col gap-2'>
        <button className='btn btn-ghost border-none justify-start gap-2 hover:bg-base-300 rounded-md p-2 font-normal'>
          <IoCreateOutline className='text-2xl flex-shrink-0' />
          <p
            className={`transition-all duration-200 ease-out whitespace-nowrap ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Create New Note
          </p>
        </button>
        <button className='btn btn-ghost border-none justify-start gap-2 hover:bg-base-300 rounded-md p-2 font-normal'>
          <HiOutlineMagnifyingGlass className='text-2xl flex-shrink-0' />
          <p
            className={`transition-all duration-200 ease-in-out whitespace-nowrap ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Search Notes
          </p>
        </button>
      </div>
    </div>
  )
}

export default SidebarActions
