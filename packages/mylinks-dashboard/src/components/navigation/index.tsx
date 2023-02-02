import React, { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
// import uniqolor from 'uniqolor';
// import color from 'color';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { CgTrash } from 'react-icons/cg';
import { useData } from '../../api';
import { useDashboardStore } from '../../store/dashboard';

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

interface PaginationProps {}

export const Pagination: React.FC<PaginationProps> = () => {
  const { total } = useDashboardStore();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const offset = useMemo(
    () => parseInt(searchParams.get('offset') ?? '1', 10),
    [total, location.search]
  );
  const limit = useMemo(() => parseInt(searchParams.get('limit'), 10) || 10, [
    location.search,
  ]);

  const prevPage = useMemo(() => (total === 0 ? 0 : offset), [total, offset]);
  const nextPage = useMemo(
    () => (offset + limit > total ? total : offset + limit),
    [total, offset, limit]
  );

  const canGoToPrevPage = useMemo(() => prevPage - limit > 0, [prevPage]);
  const canGoToNextPage = useMemo(() => nextPage > total, [nextPage, total]);

  return (
    <div className='flex whitespace-nowrap pl-2 pr-3 mt-2 mb-2'>
      <div className='pl-2 flex gap-1'>
        <button
          className={`w-6 flex items-center justify-center text-[#999999] hover:text-[#2C2C2C] ${!canGoToPrevPage &&
            'pointer-events-none hover:text-[#999999]'}`}
        >
          <Link
            to={`${location.pathname}?offset=${offset - limit}&limit=${limit}`}
          >
            <MdKeyboardArrowLeft />
          </Link>
        </button>
        <span>
          <strong className='font-medium'>{total}</strong>개 중
          <span className='pl-1'>
            <span className='inline-flex p-1 h-5 items-center justify-center rounded-md'>
              {prevPage}-{nextPage}
            </span>
          </span>
        </span>
        <button
          className={`w-6 flex items-center justify-center text-[#999999] hover:text-[#2C2C2C] ${!canGoToNextPage &&
            'pointer-events-none hover:text-[#999999]'}`}
        >
          <Link
            to={`${location.pathname}?offset=${offset + limit}&limit=${limit}`}
          >
            <MdKeyboardArrowRight />
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
