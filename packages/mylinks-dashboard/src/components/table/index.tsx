import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MdAddCircle } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../api';
import { useDashboardStore } from '../../store/dashboard';
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

  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState<number>(null);
  const ref = useRef<HTMLTableElement>(null);
  const refs = useRef<React.MutableRefObject<HTMLElement>[]>([]);

  const { selected, focused } = useEventStore();
  const { initTotal, setSelectedRows } = useDashboardStore();

  const { data, refetch } = useQuery(
    `dashboard/table/${id}/rows`,
    () => {
      return dashboard.rows(id);
    },
    {
      enabled: !!id,
      retry: false,
      initialData: { data: [], count: 0 },
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation(() => dashboard.addRow(id), {
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, location.search]);

  useEffect(() => {
    initTotal(data.count);
  }, [data.count, initTotal]);

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
        selectAll:
          index === 0 &&
          (() => {
            setSelectedRows(data.data.map((r) => r.id));
          }),
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
      style={{ height: 'calc(100% - 100px)' }}
      className='w-full h-[calc(100%_-_91px)] md:h-[calc(100%_-_99px)] relative overflow-auto bg-[#F6F6F6]'
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
          {data?.data.map((...row) => (
            <tr key={row[0].id} className='contents'>
              {(childrenWithProps as React.ReactElement[]).map(
                (child, index) => {
                  const name = child.props.name;
                  const editable = !!child.props.editable;
                  const nameInRow = name in row[0];
                  const rowSelected = !!selected && selected.id === row[0].id;
                  const isSelected = rowSelected && selected.name === name;
                  const classes = index === 0 && 'sticky left-0 z-40';

                  if (!nameInRow) return null;
                  return (
                    <Column
                      key={name}
                      index={index}
                      isSelected={isSelected}
                      focused={focused}
                      rowId={row[0].id}
                      name={name}
                      tableId={id}
                      value={row[0][name]}
                      editable={editable}
                      nextRowId={data?.data[row[1] + 1]?.id}
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
                    onClick={async (e) => {
                      e.preventDefault();

                      // If this table is not created, we should create table at first
                      if (!id) {
                        const table = await dashboard.addTable({ title: '' });
                        await dashboard.addRow(table.data.id);
                        navigate(`/table/${table.data.id}`);
                      } else if (isFirstCell) {
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
