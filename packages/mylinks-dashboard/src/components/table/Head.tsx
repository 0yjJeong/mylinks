import React, { useCallback } from 'react';

export interface HeadProps {
  name: string;
  index?: number;
  type?: string;
  classes?: string;
  rowLength?: number;
  editable?: boolean;
  children?: React.ReactNode;
  mouseDown?: (index: number) => void;
}

const Head = React.forwardRef<HTMLTableCellElement, HeadProps>((props, ref) => {
  const { index, rowLength = 0, children, mouseDown } = props;

  const onMouseDown = useCallback(() => {
    mouseDown(index);
  }, [index, mouseDown]);

  return (
    <th
      ref={ref}
      className={`flex items-center relative select-none text-left h-10 border-b-[1px] border-[#D5D5D5]`}
    >
      <span className='flex items-center gap-2 pl-2 text-sm color-[#2C2C2C]'>
        {children}
      </span>
      <div
        style={{ height: `${(rowLength + 2) * 40}px` }}
        className={`bg-[#D5D5D5] w-[1px] z-10 cursor-col-resize absolute top-0 bottom-0 right-0`}
        onMouseDown={onMouseDown}
      />
    </th>
  );
});

export default Head;
