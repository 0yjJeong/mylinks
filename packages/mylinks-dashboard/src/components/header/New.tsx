import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';

interface NewProps {}

const New: React.FC<NewProps> = () => {
  return (
    <Link
      to='/table'
      className='relative rounded-md bg-[#e8e9ff] flex justify-center items-center w-8 h-8 hover:bg-[#dedffc] after:content-[""] after:block after:pb-[100%]'
    >
      <AiOutlinePlus className='text-[#4b52db]' />
    </Link>
  );
};

export default New;
