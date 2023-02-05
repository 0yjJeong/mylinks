import React from 'react';
import { useParams } from 'react-router-dom';
import Pagination from './Pagination';
import Entries from './Entries';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const { id } = useParams();

  return (
    <nav className='border-b-2 border-[#EEEEEE] box-border flex justify-between items-center h-[42px]'>
      <div className='px-3 py-2 overflow-x-auto'>
        <Entries tableId={id} />
      </div>
      <Pagination />
    </nav>
  );
};

export default Navigation;
