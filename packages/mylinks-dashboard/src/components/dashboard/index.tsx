import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface Props {
  children?: React.ReactNode;
}

const Dashboard: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      <Navigation />
      <div>{children}</div>
    </div>
  );
};

export default Dashboard;
