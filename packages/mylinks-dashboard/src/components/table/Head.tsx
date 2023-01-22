import React, { useCallback } from 'react';

export interface HeadProps {
  name: string;
  index?: number;
  type?: string;
  classes?: string;
  children?: React.ReactNode;
  mouseDown?: (index: number) => void;
}

const Head = React.forwardRef<HTMLTableCellElement, HeadProps>((props, ref) => {
  const { index, children, mouseDown } = props;

  const onMouseDown = useCallback(() => {
    mouseDown(index);
  }, [index, mouseDown]);

  return (
    <th ref={ref} className={`relative select-none text-left`}>
      <span>{children}</span>
      <div
        className='bg-gray-100 w-0.5 h-[100vh] cursor-col-resize absolute top-0 bottom-0 right-0'
        onMouseDown={onMouseDown}
      />
    </th>
  );
});

export default Head;
