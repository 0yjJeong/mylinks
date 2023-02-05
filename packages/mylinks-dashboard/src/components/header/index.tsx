import React from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../api';
import Delete from './Delete';
import Title from './Title';
import New from './New';

interface HeaderProps {
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ logo = '' }) => {
  const { id } = useParams();
  const dashboard = useData();
  const navigate = useNavigate();

  const { data } = useQuery(
    `dashboard/table/${id}`,
    () => {
      return dashboard.table(id);
    },
    {
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
      onError: () => {
        navigate('/table');
      },
    }
  );

  return (
    <div className='border-b-[1px] border-[#EEEEEE] box-border h-[49px] md:h-[57px]'>
      <div className='flex px-3 py-2'>
        <div>
          <Link to='/'>
            <img src={logo} alt='logo' className='w-8 md:w-10' />
          </Link>
        </div>
        <div className='h-4 self-center ml-3 mr-3 border-r-[1px] border-[#EEEEEE]' />
        <Title
          id={id}
          maxLength={30}
          defaultValue={data?.data.title ?? ''}
          placeholder='제목을 입력하세요'
        />
        <aside className='flex items-center gap-6'>
          {!!id && <Delete id={id} />}
          <New />
        </aside>
      </div>
    </div>
  );
};

export default Header;
