import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../api';

interface DeleteProps {
  id: string;
}

const Delete: React.FC<DeleteProps> = ({ id }) => {
  const navigate = useNavigate();
  const dashboard = useData();

  const mutation = useMutation(() => dashboard.deleteTable(id), {
    onSuccess: () => {
      navigate('/');
    },
  });

  const onClick = () => {
    mutation.mutate();
  };

  return (
    <button
      className='flex items-center gap-1 px-1 text-[#999999] hover:text-[#2C2C2C] text-sm md:text-xl'
      onClick={onClick}
    >
      <span>삭제</span>
    </button>
  );
};

export default Delete;
