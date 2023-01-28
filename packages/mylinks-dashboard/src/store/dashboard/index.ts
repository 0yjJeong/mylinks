import { create } from 'zustand';

export type InitialState = {
  total: number;
  initTotal(total: number): void;
};

export const initialState: InitialState = {
  total: 0,
  initTotal: null,
};

export const useDashboardStore = create<InitialState>((set) => ({
  ...initialState,
  initTotal(total) {
    set({ total });
  },
}));
