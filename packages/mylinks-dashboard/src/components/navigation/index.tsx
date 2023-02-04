import React, { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
// import uniqolor from 'uniqolor';
// import color from 'color';
import { CgTrash } from 'react-icons/cg';
import { useData } from '../../api';
import { useDashboardStore } from '../../store/dashboard';
import Pagination from './Pagination';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  // const dashboard = useData();
  const { id } = useParams();
  // const { data } = useQuery(
  //   `dashboard/table/${id}/ref`,
  //   () => {
  //     return dashboard.refTable();
  //   },
  //   {
  //     initialData: { data: [] },
  //     refetchOnWindowFocus: false,
  //   }
  // );

  return (
    <nav className='border-b-2 border-[#EEEEEE] box-border flex justify-between items-center'>
      <div className='px-3 py-2 overflow-x-auto'>
        <Entries tableId={id} />
        {/* <div className='whitespace-nowrap'>
          {data.data?.map((list) => {
            const unique = uniqolor(list.id);
            const text = unique.isLight
              ? color(unique.color)
                  .darken(0.7)
                  .hex()
              : color(unique.color)
                  .lighten(0.8)
                  .hex();
            return (
              <span
                key={list.id}
                style={{ background: unique.color, color: text }}
                className='inline-block px-2 py-1 rounded-full text-sm'
              >
                {list.title}
              </span>
            );
          })}
        </div> */}
      </div>
      <Pagination />
    </nav>
  );
};

interface EntriesProps {
  tableId: string;
}

const Entries: React.FC<EntriesProps> = ({ tableId }) => {
  const dashboard = useData();
  const queryClient = useQueryClient();
  const { selectedRows, setSelectedRows } = useDashboardStore();

  const mutation = useMutation(() => dashboard.deleteRows(selectedRows), {
    onSuccess: () => {
      queryClient.refetchQueries(`dashboard/table/${tableId}/rows`);
    },
  });

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

export default Navigation;
