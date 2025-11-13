import { create } from 'zustand';
import type { Scene, SelectableObject } from '../types';
import { INITIAL_SCENE } from '../constants';

interface SceneState {
  scene: Scene;
  selectedObject: SelectableObject | null;
  setScene: (newScene: Scene) => void;
  toggleStructureLock: () => void;
  setSelectedObject: (object: SelectableObject | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: INITIAL_SCENE,
  selectedObject: null,
  setScene: (newScene) => set({ scene: newScene }),
  toggleStructureLock: () => set((state) => ({
    scene: { ...state.scene, structureLock: !state.scene.structureLock },
  })),
  setSelectedObject: (object) => set({ selectedObject: object }),
}));
