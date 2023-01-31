import React, { useCallback } from 'react';
import { BsCheck } from 'react-icons/bs';
import { useDashboardStore } from '../../store/dashboard';

export interface HeadProps {
  name: string;
  index?: number;
  type?: string;
  classes?: string;
  rowLength?: number;
  editable?: boolean;
  children?: React.ReactNode;
  mouseDown?: (index: number) => void;
  selectAll?: () => void;
}

const Head = React.forwardRef<HTMLTableCellElement, HeadProps>((props, ref) => {
  const { index, rowLength = 0, children, mouseDown, selectAll } = props;

  const { total, selectedRows } = useDashboardStore();

  const onMouseDown = useCallback(() => {
    mouseDown(index);
  }, [index, mouseDown]);

  return (
    <th
      ref={ref}
      className={`flex items-center relative select-none text-left h-10 border-b-[1px] border-[#D5D5D5] bg-[#F6F6F6] ${index ===
        0 && 'sticky left-0 z-30'}`}
    >
      {index === 0 && (
        <span
          className={`ml-2 w-4 flex items-center justify-center cursor-pointer relative bg-white rounded border-[1px] border-[#D5D5D5] after:content-[""] after:block after:pb-[100%] ${total ===
            selectedRows.length && 'bg-[#2bba51] text-white border-none'}`}
          onClick={selectAll}
        >
          {total === selectedRows.length && (
            <BsCheck className='absolute text-sm' />
          )}
        </span>
      )}
      <span className='flex items-center gap-2 pl-2 text-sm color-[#2C2C2C]'>
        {children}
      </span>
      <div
        style={{ height: `${(rowLength + 2) * 40}px` }}
        className={`bg-[#D5D5D5] w-[1px] cursor-col-resize absolute top-0 bottom-0 right-0`}
        onMouseDown={onMouseDown}
      />
    </th>
  );
});

export default Head;
