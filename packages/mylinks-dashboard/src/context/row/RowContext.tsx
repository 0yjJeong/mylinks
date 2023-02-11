import React, { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import replace from 'lodash.replace';
import { useData } from '../../api';
import { RowRaw } from '../../types';

interface Context {
  isFetching: boolean;
  fetch: (url: string) => Promise<void>;
}

const RowContext = React.createContext<Context>(null);

export const useRow = () => {
  const row = useContext(RowContext);
  if (!row) {
    throw new Error('No row context available');
  }
  return row;
};

type RowContextPropviderProps = {
  tableId: string;
  rowId: string;
  children?: React.ReactNode;
};

export const RowContextProvider: React.FC<RowContextPropviderProps> = ({
  tableId,
  rowId,
  children,
}) => {
  const queryClient = useQueryClient();
  const dashboard = useData();

  const [isFetching, setIsFetching] = useState(false);

  const mutation = useMutation(
    (row: Partial<RowRaw>) => dashboard.editRow(rowId, row),
    {
      onSuccess: () => {
        queryClient.refetchQueries(`dashboard/table/${tableId}/rows`);
      },
    }
  );

  const fetch = async (url: string) => {
    setIsFetching(true);
    try {
      const { data } = await dashboard.matadata(url);
      await mutation.mutate({
        title: replace(data.title, /[\\n]+/, ' ')
          .slice(0, 45)
          .trim(),
        description: replace(data.description, /[\\n]+/, ' ')
          .slice(0, 100)
          .trim(),
        url: data.url,
      });
    } catch (err) {
      await mutation.mutate({
        url,
      });
    }
    setIsFetching(false);
  };

  return (
    <RowContext.Provider value={{ isFetching, fetch }}>
      {children}
    </RowContext.Provider>
  );
};
