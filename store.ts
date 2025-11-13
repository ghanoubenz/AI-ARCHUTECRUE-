import { create } from 'zustand';
import type { Shape } from './types';

interface AppState {
  shapes: Shape[];
  selectedShapeId: string | null;
  backgroundImage: {
    src: string;
    width: number;
    height: number;
  } | null;
  addShape: () => void;
  updateShape: (id: string, newProps: Partial<Shape>) => void;
  setSelectedShapeId: (id: string | null) => void;
  setBackgroundImage: (image: AppState['backgroundImage']) => void;
}

export const useStore = create<AppState>((set) => ({
  shapes: [],
  selectedShapeId: null,
  backgroundImage: null,
  addShape: () => set((state) => ({
    shapes: [
      ...state.shapes,
      {
        id: `shape_${Date.now()}`,
        x: 100,
        y: 100,
        width: 150,
        height: 100,
        rotation: 0,
        color: '#ffffff',
        structureType: 'Standard Wall',
        extrusionHeight: 3,
      },
    ],
  })),
  updateShape: (id, newProps) => set((state) => ({
    shapes: state.shapes.map((shape) =>
      shape.id === id ? { ...shape, ...newProps } : shape
    ),
  })),
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
  setBackgroundImage: (image) => set({ backgroundImage: image }),
}));
