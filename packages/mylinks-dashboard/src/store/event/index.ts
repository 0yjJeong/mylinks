import { create } from 'zustand';

export type InitialState = {
  selected: {
    id: string;
    name: string;
  } | null;
  focused: boolean;
  detectMouseEvent(e: MouseEvent): void;
  select({ id, name }: { id: string; name: string }): void;
  unselect(): void;
};

export const initialState: InitialState = {
  selected: null,
  focused: false,
  detectMouseEvent: null,
  select: null,
  unselect: null,
};

export const useEventStore = create<InitialState>((set, get) => ({
  ...initialState,
  detectMouseEvent(e) {
    e.stopPropagation();
    const { selected, detectMouseEvent } = get();
    const { id, name } = (e.target as any).dataset;
    if (selected) {
      if (id !== selected.id && name !== selected.name) {
        window.removeEventListener('mousedown', detectMouseEvent);
        set((state) => ({ ...state, focused: false }));
      }
    }
  },
  select({ id, name }: { id: string; name: string }) {
    const { detectMouseEvent } = get();
    window.addEventListener('mousedown', detectMouseEvent);
    set((state) => ({ ...state, selected: { id, name }, focused: true }));
  },
  unselect() {
    set((state) => ({ ...state, selected: null }));
  },
}));
