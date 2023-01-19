import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { AiFillFileAdd } from 'react-icons/ai';
import { useData } from '../../api';
import { ListRaw } from '../../types';

const Header = () => {
  const { id } = useParams();
  const dashboard = useData();
  const { data, isFetching } = useQuery(
    `dashboard/link/${id}`,
    () => {
      return dashboard.list();
    },
    { refetchOnWindowFocus: false }
  );

  if (isFetching) {
    return null;
  }

  return (
    <div className='flex justify-between'>
      <TitleInput
        id={id}
        maxLength={30}
        defaultValue={data.data.title}
        editList={dashboard.editList}
      />
      <aside className='flex gap-6'>
        <DeleteListButton deleteList={dashboard.deleteList} />
        <NewListButton />
      </aside>
    </div>
  );
};

interface TitleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  editList(list: Partial<ListRaw>): Promise<any>;
}

export const TitleInput: React.FC<TitleInputProps> = ({
  id,
  editList,
  ...rest
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation((list: Partial<ListRaw>) => editList(list), {
    onSuccess: () => {
      queryClient.refetchQueries(`dashboard/link/${id}`);
    },
  });

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const list = { title: e.target.value };
    mutation.mutate(list);
  };

  return <input className='text-[#2057e3] text-xl' onBlur={onBlur} {...rest} />;
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
      className='flex items-center gap-1 px-1 py-2 text-[#999999]'
      onClick={onClick}
    >
      <MdDelete />
      삭제
    </button>
  );
};

export const NewListButton = () => {
  return (
    <Link to='/list'>
      <button className='flex items-center gap-1 px-1 py-2 text-[#2057e3] hover:bg-[#e6edff]'>
        <AiFillFileAdd /> 새 리스트
      </button>
    </Link>
  );
};

export default Header;
