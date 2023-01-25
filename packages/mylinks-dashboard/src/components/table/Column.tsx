import React, { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useData } from '../../api';
import { useDashboardStore } from '../../store/dashboard';
import { RowRaw } from '../../types';

interface ColumnProps {
  id: string;
  name: string;
  value: string;
  tableId: string;
  isSelected: boolean;
  focused: boolean;
}

const Column: React.FC<ColumnProps> = ({
  id,
  name,
  value,
  tableId,
  isSelected,
  focused,
}) => {
  const ref = useRef<HTMLElement>();
  const queryClient = useQueryClient();
  const dashboard = useData();
  const { select, unselect } = useDashboardStore();

  useEffect(() => {
    if (isSelected) {
      if (!focused) {
        const value = ref.current.innerText;
        mutation.mutate({ [name]: value });
        unselect();
      }
    }
  }, [isSelected, focused]);

  const mutation = useMutation(
    (row: Partial<RowRaw>) => dashboard.editRow(id, row),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${tableId}/rows`);
      },
    }
  );

  const onClick = useCallback(() => {
    select({ id, name });
  }, [id, name, select]);

  return (
    <td
      className='flex items-center bg-white border-b-[1px] border-[#D5D5D5] mr-[1px]'
      onClick={onClick}
    >
      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning={true}
        data-id={id}
        data-name={name}
        className={`py-[9px] pl-2 h-[39px] text-sm leading-[19px] outline-none w-full color-[#2C2C2C] block whitespace-nowrap text-ellipsis overflow-hidden ${isSelected &&
          'rounded-sm border-[1px] border-[#2057e3]'}`}
      >
        {value}
      </span>
    </td>
  );
};

export default Column;
