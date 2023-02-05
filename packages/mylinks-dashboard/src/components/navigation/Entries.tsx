import React, { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CgTrash } from 'react-icons/cg';
import { useData } from '../../api';
import { useDashboardStore } from '../../store/dashboard';

interface EntriesProps {
  tableId: string;
}

const Entries: React.FC<EntriesProps> = ({ tableId }) => {
  const dashboard = useData();
  const queryClient = useQueryClient();
  const { selectedRows, setSelectedRows } = useDashboardStore();

  const mutation = useMutation(
    () => dashboard.deleteRows(tableId, selectedRows),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${tableId}/rows`);
      },
    }
  );

  const onClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    await mutation.mutate();
    setSelectedRows([]);
  }, []);

  if (selectedRows.length === 0) return null;

  return (
    <div className='flex items-center'>
      <div className='text-sm text-[#2C2C2C]'>
        {selectedRows.length}개 항목 선택
      </div>
      <div className='flex ml-4'>
        <button
          className='p-0.5 rounded text-[#999999] border-[1px] border-[#D5D5D5] hover:bg-[#f7f8fa]'
          onClick={onClick}
        >
          <CgTrash />
        </button>
      </div>
    </div>
  );
};

export default Entries;
