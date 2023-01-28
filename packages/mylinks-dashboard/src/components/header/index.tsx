import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { useData } from '../../api';
import { RowRaw, TableRaw } from '../../types';

interface HeaderProps {
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ logo = '' }) => {
  const { id } = useParams();
  const dashboard = useData();
  const { data } = useQuery(
    `dashboard/table/${id}`,
    () => {
      return dashboard.table();
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className='border-b-2 border-[#EEEEEE] box-border'>
      <div className='flex px-3 py-2'>
        <div>
          <Link to='/'>
            <img src={logo} alt='logo' className='w-8 md:w-10' />
          </Link>
        </div>
        <div className='h-4 self-center ml-3 mr-3 border-r-2 border-[#EEEEEE]' />
        <TitleInput
          id={id}
          maxLength={30}
          defaultValue={data?.data.title ?? ''}
          editList={dashboard.editTable}
        />
        <aside className='flex gap-6'>
          <DeleteListButton deleteList={dashboard.deleteTable} />
          <NewListButton />
        </aside>
      </div>
    </div>
  );
};

interface TitleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  editList(list: Partial<RowRaw>): Promise<any>;
}

export const TitleInput: React.FC<TitleInputProps> = ({
  id,
  editList,
  ...rest
}) => {
  const dashboard = useData();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (table: Partial<TableRaw>) => dashboard.editTable(table),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${id}`);
      },
    }
  );

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const list = { title: e.target.value };
    mutation.mutate(list);
  };

  return (
    <input
      className='flex-1 text-[#2C2C2C] text-sm md:text-xl'
      onBlur={onBlur}
      {...rest}
    />
  );
};

interface DeleteListButtonProps {
  deleteList(): Promise<any>;
}

export const DeleteListButton: React.FC<DeleteListButtonProps> = ({
  deleteList,
}) => {
  const navigate = useNavigate();
  const mutation = useMutation(() => deleteList(), {
    onSuccess: () => {
      navigate('/');
    },
  });

  const onClick = () => {
    mutation.mutate();
  };

  return (
    <button
      className='flex items-center gap-1 px-1 py-2 text-[#999999] hover:text-[#2C2C2C] text-sm md:text-xl'
      onClick={onClick}
    >
      <span>삭제</span>
    </button>
  );
};

interface NewListButtonProps {}

export const NewListButton: React.FC<NewListButtonProps> = () => {
  return (
    <Link
      to='/list'
      className='relative w-8 rounded-md bg-[#e8e9ff] hover:bg-[#dedffc] after:content-[""] after:block after:pb-[100%]'
    >
      <span className='absolute w-full h-full flex items-center justify-center'>
        <AiOutlinePlus className='text-[#4b52db]' />
      </span>
    </Link>
  );
};

export default Header;
