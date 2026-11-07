export type CrowdLevel = 'Low' | 'Medium' | 'High';

export interface Pandal {
  id: string;
  name: string;
  area: string;
  lat: number; // TODO: verify
  lng: number; // TODO: verify
  address: string;
  description: string;
  photoUrl: string;
  gallery?: string[];
  history?: string;
  darshanTimings: string;
  aartiTimings: string;
  ecoFriendly: boolean;
  crowdLevel: CrowdLevel;
  nearestStation: string;
  visarjanDate: string;
  is24Hours?: boolean;
}

export interface PandalFilterState {
  searchQuery: string;
  crowdLevel: 'All' | CrowdLevel;
  ecoFriendlyOnly: boolean;
  is24HoursOnly: boolean;
  selectedArea: string;
  sortByDistance: boolean;
}
