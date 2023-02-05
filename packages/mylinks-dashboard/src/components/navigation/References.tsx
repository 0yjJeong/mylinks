import React from 'react';
import { useQuery } from 'react-query';
import uniqolor from 'uniqolor';
import color from 'color';
import { useData } from '../../api';

interface ReferencesProps {
  tableId: string;
}

const References: React.FC<ReferencesProps> = ({ tableId }) => {
  const dashboard = useData();
  const { data } = useQuery(
    `dashboard/table/${tableId}/ref`,
    () => {
      return dashboard.refTable(tableId);
    },
    {
      enabled: !!tableId,
      initialData: { data: [] },
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className='whitespace-nowrap'>
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
    </div>
  );
};

export default References;
