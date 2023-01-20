import { create } from 'zustand';

export type InitialState = {
  total: number;
};

export const initialState: InitialState = {
  total: 0,
};

export const useDashboardStore = create<InitialState>(() => ({
  ...initialState,
}));
