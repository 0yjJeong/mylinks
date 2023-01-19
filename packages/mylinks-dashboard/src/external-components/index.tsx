import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DataContextProvider, DataManager } from '../api';

interface Props {
  dataManager: DataManager;
  children?: React.ReactNode;
}

export default ({ dataManager, children }: Props) => {
  const queryClient = new QueryClient();
  return (
    <DataContextProvider dataManager={dataManager}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DataContextProvider>
  );
};
