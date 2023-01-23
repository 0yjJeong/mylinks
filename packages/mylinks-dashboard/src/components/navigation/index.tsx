import React from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import uniqolor from 'uniqolor';
import color from 'color';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useData } from '../../api';
import { useDashboardStore } from '../../store/dashboard';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const dashboard = useData();
  const { id } = useParams();
  const { data, isFetching } = useQuery(
    `dashboard/table/${id}/ref`,
    () => {
      return dashboard.refTable();
    },
    { refetchOnWindowFocus: false }
  );

  if (isFetching) {
    return null;
  }

  return (
    <nav className='border-b-2 border-[#EEEEEE] box-border flex justify-between items-center'>
      <div className='px-3 py-2 overflow-x-auto'>
        <div className='whitespace-nowrap'>
          {data.data.map((list) => {
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
        </div>
      </div>
      <Pagination />
    </nav>
  );
};

interface PaginationProps {}

export const Pagination: React.FC<PaginationProps> = () => {
  const { total } = useDashboardStore();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const offset = parseInt(searchParams.get('offset'), 10) || 1;
  const limit = parseInt(searchParams.get('limit'), 10) || 10;

  return (
    <div className='flex whitespace-nowrap pl-2 pr-3'>
      <span>
        {total}개 중 {offset}-{offset + limit - 1}
      </span>
      <div className='pl-2 flex gap-1'>
        <button
          className={`w-6 flex items-center justify-center border-2 border-[#EEEEEE] ${
            offset - limit < 0 ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <Link
            to={`${location.pathname}?offset=${offset - limit}&limit=${limit}`}
          >
            <MdKeyboardArrowLeft />
          </Link>
        </button>
        <button className='w-6 flex items-center justify-center border-2 border-[#EEEEEE]'>
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
