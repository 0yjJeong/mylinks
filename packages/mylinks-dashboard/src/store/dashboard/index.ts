import { create } from 'zustand';

export type InitialState = {
  total: number;
  initTotal(total: number): void;
  selectedRows: string[];
  setSelectedRows: (ids: string[]) => void;
  toggleRow(id: string): void;
};

export const initialState: InitialState = {
  total: 0,
  selectedRows: [],
  setSelectedRows: null,
  initTotal: null,
  toggleRow: null,
};

export const useDashboardStore = create<InitialState>((set, get) => ({
  ...initialState,
  initTotal(total) {
    set({ total });
  },
  setSelectedRows(ids) {
    const { total, selectedRows } = get();
    if (total === selectedRows.length) {
      set({ selectedRows: [] });
    } else {
      set({ selectedRows: ids });
    }
  },
  toggleRow(id) {
    const { selectedRows } = get();
    if (selectedRows.includes(id)) {
      set({ selectedRows: selectedRows.filter((row) => row !== id) });
    } else {
      set({ selectedRows: [...selectedRows, id] });
    }
  },
}));
