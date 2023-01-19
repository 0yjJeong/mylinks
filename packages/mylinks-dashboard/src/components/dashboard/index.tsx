import React from 'react';
import Header from './Header';

interface Props {
  children?: React.ReactNode;
}

const Dashboard: React.FC<Props> = ({ children }) => {
  return (
    <div className='py-3 px-2'>
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default Dashboard;
