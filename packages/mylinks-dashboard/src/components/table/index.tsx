import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useData } from '../../api';

import Head from './Head';

interface TableProps {
  rows?: Record<string, string>[];
  minCellWidth?: number;
  children?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({
  rows,
  minCellWidth = 150,
  children,
}) => {
  const ref = useRef<HTMLTableElement>(null);
  const { id } = useParams();
  const dashboard = useData();
  const [activeIndex, setActiveIndex] = useState<number>(null);

  const refs = useRef<React.MutableRefObject<HTMLElement>[]>([]);

  const { data, isFetching } = useQuery(
    `dashboard/list/${id}/links`,
    () => {
      return dashboard.links();
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex]);

  const removeListeners = () => {
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
  };

  const mouseDown = useCallback(
    (index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      const gridColumns = refs.current.map((col, i) => {
        if (i === activeIndex) {
          const scrollLeft = ref.current.scrollLeft - col.current.offsetLeft;
          const width = e.clientX + scrollLeft;
          if (minCellWidth <= width) {
            return `${width}px`;
          }
        }
        return `${col.current.offsetWidth}px`;
      });
      ref.current.style.gridTemplateColumns = `${gridColumns.join(' ')}`;
    },
    [activeIndex, ref.current, ref.current]
  );

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const childRef = useRef<HTMLTableCellElement>();
      refs.current[index] = childRef;
      return React.cloneElement<any>(child, {
        ref: childRef,
        index,
        mouseDown,
      });
    }
    return child;
  });

  const cols = useMemo(
    () =>
      `${Array.from({ length: childrenWithProps.length })
        .map(() => `minmax(${minCellWidth}px,3fr)`)
        .join('_')}`,
    [minCellWidth, childrenWithProps.length]
  );

  if (isFetching) {
    return null;
  }

  return (
    <div className='w-full h-full relative overflow-auto'>
      <table
        ref={ref}
        className={`overflow-auto absolute top-0 bottom-0 content-start grid grid-cols-[${cols}]`}
      >
        <thead className='contents'>
          <tr className='contents'>{childrenWithProps}</tr>
        </thead>
        <tbody className='contents'>
          {data.data.map((row) => (
            <tr key={row.id} className='contents'>
              {(childrenWithProps as React.ReactElement[]).map((child) => {
                const name = child.props.name;
                return (
                  <td
                    key={name}
                    className='block whitespace-nowrap text-ellipsis overflow-hidden'
                  >
                    {row[name]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Head };
export default Table;
