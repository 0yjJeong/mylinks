import React from 'react';

interface AnimatedColumnProps {}

const AnimatedColumn: React.FC<AnimatedColumnProps> = () => {
  return (
    <td className='relative overflow-hidden w-full h-10 before:animate-stripe before:absolute before:content-[""] before:top-0 before:left-0 before:h-full before:w-[calc(100%_+_100px)] before:bg-[repeating-linear-gradient(45deg,_#F6F6F6_25%,_#F6F6F6_50%,_#D5D5D5_50%,_#D5D5D5_75%)] before:bg-[length:10px_10px]'></td>
  );
};

export default AnimatedColumn;
