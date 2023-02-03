import { Link } from 'react-router-dom';
import { GrTableAdd } from 'react-icons/gr';

interface HeaderProps {
  logo: string;
}

const Header: React.FC<HeaderProps> = ({ logo }) => {
  return (
    <header className='fixed top-0 left-0 right-0 bg-white border-b-2 border-[#EEEEEE]'>
      <div className='flex justify-between items-center px-2 py-2'>
        <Link to='/' className='flex items-center gap-1'>
          <img src={logo} alt='logo' className='w-8 md:w-12' />
          <h3 className='font-extrabold'>Mylinks</h3>
        </Link>
        <aside>
          <Link to='/table'>
            <button className='px-3 py-2 flex items-center rounded-3xl bg-[#2C2C2C]'>
              <span className='mr-2'>
                <span className='block w-6 h-6 bg-white rounded-full'>
                  <span className='flex items-center justify-center w-full h-full text-xs'>
                    <GrTableAdd />
                  </span>
                </span>
              </span>
              <span className='text-white'>새 테이블</span>
            </button>
          </Link>
        </aside>
      </div>
    </header>
  );
};

export default Header;
