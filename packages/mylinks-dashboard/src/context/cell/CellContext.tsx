import React, { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import replace from 'lodash.replace';
import { useData } from '../../api';
import { RowRaw } from '../../types';

interface Context {
  isFetching: boolean;
  fetch: (url: string) => Promise<void>;
}

const CellContext = React.createContext<Context>(null);

export const useCell = () => {
  const row = useContext(CellContext);
  if (!row) {
    throw new Error('No row context available');
  }
  return row;
};

type CellContextPropviderProps = {
  tableId: string;
  rowId: string;
  children?: React.ReactNode;
};

export const CellContextPropvider: React.FC<CellContextPropviderProps> = ({
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
    try {
      setIsFetching(true);
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
      setIsFetching(false);
    } catch (err) {
      mutation.mutate({
        url,
      });
    }
  };

  return (
    <CellContext.Provider value={{ isFetching, fetch }}>
      {children}
    </CellContext.Provider>
  );
};
