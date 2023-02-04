import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import min from 'lodash.min';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useDashboardStore } from '../../store/dashboard';

interface PaginationProps {}

const Pagination: React.FC<PaginationProps> = () => {
  const { total } = useDashboardStore();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const offset = useMemo(
    () => parseInt(searchParams.get('offset') ?? '0', 10),
    [total, location.search]
  );
  const limit = useMemo(() => parseInt(searchParams.get('limit'), 10) || 10, [
    location.search,
  ]);

  const from = useMemo(() => offset + 1, [offset]);
  const to = useMemo(() => from + limit - 1, [total, from, limit]);

  const before = useMemo(() => from > 1, [from]);
  const next = useMemo(() => total > to, [to, total]);

  return (
    <div className='flex whitespace-nowrap pl-2 pr-3 mt-2 mb-2'>
      <div className='pl-2 flex gap-1'>
        <button
          className={`w-6 flex items-center justify-center text-[#999999] hover:text-[#2C2C2C] ${!before &&
            'pointer-events-none hover:text-[#999999]'}`}
        >
          <Link
            to={`${location.pathname}?offset=${offset - limit}&limit=${limit}`}
            replace={true}
          >
            <MdKeyboardArrowLeft />
          </Link>
        </button>
        <span>
          <strong className='font-medium'>{total}</strong>개 중
          <span className='pl-1'>
            <span className='inline-flex p-1 h-5 items-center justify-center rounded-md'>
              {min([from, total])}-{min([to, total])}
            </span>
          </span>
        </span>
        <button
          className={`w-6 flex items-center justify-center text-[#999999] hover:text-[#2C2C2C] ${!next &&
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

export default Pagination;
