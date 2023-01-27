import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MdAddCircle } from 'react-icons/md';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useData } from '../../api';
import { useEventStore } from '../../store/event';
import Column from './Column';

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
  const { id } = useParams();
  const dashboard = useData();

  const [activeIndex, setActiveIndex] = useState<number>(null);
  const ref = useRef<HTMLTableElement>(null);
  const refs = useRef<React.MutableRefObject<HTMLElement>[]>([]);

  const { selected, focused } = useEventStore();

  const { data, refetch } = useQuery(
    `dashboard/table/${id}/rows`,
    () => {
      return dashboard.rows();
    },
    { initialData: { data: [], count: 0 }, refetchOnWindowFocus: false }
  );

  const mutation = useMutation(() => dashboard.addRow(), {
    onSuccess: () => {
      refetch();
    },
  });

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
        rowLength: data?.data.length ?? rows?.length,
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

  return (
    <div
      style={{ height: 'calc(100% - 84px)' }}
      className='w-full relative overflow-auto bg-[#F6F6F6]'
    >
      <table
        ref={ref}
        style={{
          gridTemplateColumns: `repeat(${childrenWithProps.length}, minmax(${minCellWidth}px,3fr))`,
        }}
        /**
         * position:sticky always behave on parent's scroll container, so table must have full width size.
         */
        className={`overflow-auto absolute top-0 bottom-0 w-full content-start grid grid-cols-[${cols}]`}
      >
        <thead className='contents'>
          <tr className='contents'>{childrenWithProps}</tr>
        </thead>
        <tbody className='contents'>
          {data?.data.map((row) => (
            <tr key={row.id} className='contents'>
              {(childrenWithProps as React.ReactElement[]).map(
                (child, index) => {
                  const name = child.props.name;
                  const editable = !!child.props.editable;
                  const nameInRow = name in row;
                  const rowSelected = !!selected && selected.id === row.id;
                  const isSelected = rowSelected && selected.name === name;
                  const classes = index === 0 && 'sticky left-0 z-40';

                  if (!nameInRow) return null;
                  return (
                    <Column
                      key={name}
                      isSelected={isSelected}
                      focused={focused}
                      id={row.id}
                      name={name}
                      tableId={id}
                      value={row[name]}
                      editable={editable}
                      classes={classes}
                    />
                  );
                }
              )}
            </tr>
          ))}
          <tr className='contents'>
            {Array.from({ length: childrenWithProps.length }).map(
              (_, index) => {
                const isFirstCell = index === 0;
                return (
                  <td
                    key={index}
                    className={`flex items-center bg-[#EFEFEF] border-b-[1px] border-[#D5D5D5] h-10 ${isFirstCell &&
                      'sticky left-0 z-20 cursor-pointer hover:bg-[#E8E8E8]'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isFirstCell) {
                        mutation.mutate();
                      }
                    }}
                  >
                    {isFirstCell && (
                      <span className='pl-2 flex items-center gap-1 color-[#2C2C2C]'>
                        <MdAddCircle className='text-xl' />
                        추가하기
                      </span>
                    )}
                  </td>
                );
              }
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { Head };
export default Table;
