import React, { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useData } from '../../api';
import { useEventStore } from '../../store/event';
import { RowRaw } from '../../types';

interface ColumnProps {
  id: string;
  name: string;
  value: string;
  tableId: string;
  isSelected: boolean;
  focused: boolean;
  editable: boolean;
  classes?: string;
}

const Column: React.FC<ColumnProps> = ({
  id,
  name,
  value,
  tableId,
  isSelected,
  focused,
  editable,
  classes = '',
}) => {
  const ref = useRef<HTMLElement>();
  const queryClient = useQueryClient();
  const dashboard = useData();
  const { select, unselect } = useEventStore();

  const mutation = useMutation(
    (row: Partial<RowRaw>) => dashboard.editRow(id, row),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${tableId}/rows`);
      },
    }
  );

  /**
   * Initialize content editor
   */
  useEffect(() => {
    // we only want to paste text in type text/plain
    if (ref.current) {
      ref.current.addEventListener('paste', onPaste);
    }

    return () => {
      ref.current.removeEventListener('paste', onPaste);
    };
  }, []);

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (clipboardData) {
      const getText = clipboardData.getData('text/plain');
      document.execCommand('insertText', false, getText);
    }
  };

  useEffect(() => {
    if (isSelected) {
      if (!focused) {
        removeEventListener(name, value);
      }
    }
  }, [isSelected, focused]);

  const removeEventListener = useCallback(
    async (name: string, value: string) => {
      unselect();
      const innerText = ref.current.innerText;
      if (name === 'url' && !value) {
        const { data } = await dashboard.matadata(innerText);
        mutation.mutate({
          title: data.title,
          description: data.description,
          url: data.url,
        });
      } else {
        mutation.mutate({ [name]: value });
      }
    },
    [unselect]
  );

  const onClick = useCallback(() => {
    if (editable) {
      select({ id, name });
    }
  }, [id, name, select]);

  return (
    <td
      className={`flex items-center bg-white border-b-[1px] border-[#D5D5D5] mr-[1px] ${classes}`}
      onClick={onClick}
    >
      <span
        ref={ref}
        contentEditable={editable ? ('plaintext-only' as any) : false}
        suppressContentEditableWarning={true}
        data-id={id}
        data-name={name}
        className={`py-[9px] pl-2 h-[37px] text-sm leading-[19px] outline-none w-full color-[#2C2C2C] block whitespace-nowrap text-ellipsis overflow-hidden ${isSelected &&
          'rounded-sm border-[1px] border-[#2057e3] text-clip'}`}
      >
        {(value ?? '').trim()}
      </span>
    </td>
  );
};

export default Column;
