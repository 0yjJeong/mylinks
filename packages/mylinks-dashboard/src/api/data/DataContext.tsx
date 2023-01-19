import React, { useContext } from 'react';
import DataManager from './DataManager';

const DataContext = React.createContext<DataManager>(null);

export const useData = () => {
  const data = useContext(DataContext);
  if (!data) {
    throw new Error('No data context available');
  }
  return data;
};

type DataContextProviderProps = {
  dataManager: DataManager;
  children?: React.ReactNode;
};

export const DataContextProvider: React.FC<DataContextProviderProps> = ({
  dataManager,
  children,
}) => {
  return (
    <DataContext.Provider value={dataManager}>{children}</DataContext.Provider>
  );
};
