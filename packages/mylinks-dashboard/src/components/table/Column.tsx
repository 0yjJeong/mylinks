import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { BsCheck } from 'react-icons/bs';
import { useData } from '../../api';
import { useEventStore } from '../../store/event';
import { RowRaw } from '../../types';
import { useDashboardStore } from '../../store/dashboard';
import { useCell } from '../../context/cell/CellContext';
import AnimatedColumn from './AnimatedColumn';

interface ColumnProps {
  rowId: string;
  index: number;
  name: string;
  value: string;
  tableId: string;
  isSelected: boolean;
  focused: boolean;
  editable: boolean;
  nextRowId?: string;
  classes?: string;
}

const Column: React.FC<ColumnProps> = ({
  rowId,
  index,
  name,
  value,
  tableId,
  isSelected,
  focused,
  editable,
  nextRowId,
  classes = '',
}) => {
  const ref = useRef<HTMLElement>();
  const queryClient = useQueryClient();
  const dashboard = useData();
  const { select, unselect } = useEventStore();
  const { selectedRows, toggleRow } = useDashboardStore();
  const { isFetching, fetch } = useCell();

  const mutation = useMutation(
    (row: Partial<RowRaw>) => dashboard.editRow(rowId, row),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${tableId}/rows`);
      },
    }
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('paste', onPaste);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('paste', onPaste);
      }
    };
  }, []);

  useEffect(() => {
    if (isSelected) {
      if (!focused) {
        removeEventListener(name);
      }
    }
  }, [isSelected, focused]);

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (clipboardData) {
      const getText = clipboardData.getData('text/plain');
      document.execCommand('insertText', false, getText.trim());
    }
  };

  const removeEventListener = useCallback(
    async (name: string) => {
      unselect();

      const { innerText } = ref.current;
      if (innerText !== value) {
        if (name === 'url') {
          await fetch(innerText);
        } else {
          mutation.mutate({ [name]: innerText });
        }
      }
    },
    [unselect]
  );

  const onClick = useCallback(() => {
    if (editable) {
      select({ id: rowId, name });
    }
  }, [rowId, name, select]);

  const rowSelected = useMemo(() => selectedRows.includes(rowId), [
    rowId,
    selectedRows,
  ]);

  if (isFetching) return <AnimatedColumn />;

  return (
    <td
      className={`flex items-center bg-white border-b-[1px] border-[#D5D5D5] mr-[1px] ${classes} ${isSelected &&
        'w-fit z-30'} ${rowSelected &&
        'border-[#2bba51] bg-[#e8faed]'} ${selectedRows.includes(nextRowId) &&
        'border-[#2bba51]'}`}
      onClick={onClick}
    >
      {index === 0 && (
        <span
          className={`ml-2 w-4 flex items-center justify-center cursor-pointer relative bg-white rounded border-[1px] border-[#D5D5D5] after:content-[""] after:block after:pb-[100%] ${rowSelected &&
            'bg-[#2bba51] text-white border-none'}`}
          onClick={() => toggleRow(rowId)}
        >
          {rowSelected && <BsCheck className='absolute text-sm' />}
        </span>
      )}
      <span
        ref={ref}
        contentEditable={editable ? ('plaintext-only' as any) : false}
        suppressContentEditableWarning={true}
        data-id={rowId}
        data-name={name}
        className={`py-[9px] pl-2 h-[37px] text-sm leading-[19px] outline-none w-full color-[#2C2C2C] block whitespace-nowrap text-ellipsis overflow-hidden ${isSelected &&
          'rounded-sm border-[1px] border-[#2057e3] text-clip pr-2'} ${index ===
          0 && 'w-[calc(100%_-_24px)]'}`}
      >
        {value ?? ''}
      </span>
    </td>
  );
};

export default Column;
