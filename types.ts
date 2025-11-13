// Based on the spec's JSON schema
export interface PlotMask { x: number; y: number; w: number; h: number; }
export interface Plot {
  shape: 'L' | 'Rect';
  bounds: { w: number; h: number; };
  mask?: PlotMask[];
}
export interface Office {
  id: string;
  x: number; y: number; w: number; h: number;
  material: 'concrete' | 'steel' | 'container';
  color: string;
}
export interface Courtyard {
  x: number; y: number; w: number; h: number;
  fountain: boolean;
}
export interface Warehouse {
  id: string;
  x: number; y: number; w: number; h: number;
  material: 'steel' | 'concrete';
  wallColor: string;
  roofColor: string;
  roof: { type: 'pitched' | 'flat'; skylights: number; };
}
export interface RoadPoint { x: number; y: number; }
export interface Roads {
  northEntrance: { x: number; y: number; parking: { slots: number; }; };
  east: RoadPoint[];
  west_turnaround_path: RoadPoint[];
  width: number;
}
export interface Landscape {
  perimeter: ('N' | 'W' | 'S' | 'E')[];
  treeSpacing: number;
}
export interface Overrides {
  warehouseMesh: string;
  officeMesh: string;
}
export interface Scene {
  units: 'm';
  plot: Plot;
  offices: Office[];
  courtyard: Courtyard;
  warehouse: Warehouse;
  roads: Roads;
  landscape: Landscape;
  structureLock: boolean;
  overrides: Overrides;
}

// FIX: Added missing Shape interface for unused components to resolve TypeScript errors.
export interface Shape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  structureType: 'Standard Wall' | 'Steel Structure' | 'Shipping Container';
  extrusionHeight: number;
}

export type SelectableObject = 
  | ({ type: 'office'; data: Office })
  | ({ type: 'warehouse'; data: Warehouse });

// FIX: Resolve TypeScript errors with global 'aistudio' declaration by defining a named interface 'AIStudio'
// and using it for window.aistudio. This aligns with the error message expecting a specific type name
// and resolves conflicts when merging global declarations.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}
