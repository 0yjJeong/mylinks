import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../api';
import { TableRaw } from '../../types';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string | undefined;
}

const Title: React.FC<TitleProps> = ({ id, ...rest }) => {
  const navigate = useNavigate();
  const dashboard = useData();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (table: Partial<TableRaw>) => dashboard.editTable(id, table),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${id}`);
      },
    }
  );

  const onBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (id) {
      mutation.mutate({ title: value });
    } else {
      const table = await dashboard.addTable({ title: value });
      navigate(`/table/${table.data.id}`);
    }
  };

  return (
    <input
      className='flex-1 text-[#2C2C2C] text-sm outline-none md:text-xl'
      onBlur={onBlur}
      {...rest}
    />
  );
};

export default Title;
