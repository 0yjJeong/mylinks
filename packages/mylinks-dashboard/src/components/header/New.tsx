import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';

interface NewProps {}

const New: React.FC<NewProps> = () => {
  return (
    <button className='flex justify-center items-center w-[49px] h-[49px] md:w-[57px] md:h-[57px] bg-[#e8e9ff] hover:bg-[#dedffc]'>
      <Link to='/table' className='text-[#4b52db]'>
        <AiOutlinePlus />
      </Link>
    </button>
  );
};

export default New;
