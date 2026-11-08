export type CrowdLevel = 'Low' | 'Medium' | 'High';
export type PandalStatus = 'pending' | 'approved' | 'rejected';

export interface PandalPhoto {
  id: string;
  pandalId: string;
  storagePath: string;
  thumbPath: string;
  url: string;
  thumbUrl: string;
  captionEn?: string;
  captionHi?: string;
  captionMr?: string;
  altText?: string;
  credit?: string;
  sortOrder: number;
  isCover: boolean;
  createdAt?: string;
}

export interface Pandal {
  id: string;
  name: string;
  area: string;
  lat: number; // TODO: verify
  lng: number; // TODO: verify
  address: string;
  description: string;
  photoUrl: string;
  coverThumbUrl?: string;
  gallery?: string[];
  photos?: PandalPhoto[];
  history?: string;
  darshanTimings: string;
  aartiTimings: string;
  ecoFriendly: boolean;
  crowdLevel: CrowdLevel;
  nearestStation: string;
  visarjanDate: string;
  is24Hours?: boolean;
  status?: PandalStatus;
  createdAt?: string;
  isVerified?: boolean;
  lastUpdated?: string;
  nameMr?: string;
  nameHi?: string;
  areaMr?: string;
  areaHi?: string;
  stationDistance?: string;
  roadClosureNotice?: string;
}

export interface PandalReport {
  id?: string;
  pandalId: string;
  pandalName: string;
  pandalArea?: string;
  issueType: 'wrong_location' | 'wrong_timings' | 'crowd_inaccurate' | 'closed' | 'other';
  description?: string;
  reporterName?: string;
  reporterContact?: string;
  status?: 'pending' | 'resolved' | 'dismissed';
  createdAt?: string;
}

export interface PandalSubmission {
  name: string;
  area: string;
  lat: number;
  lng: number;
  address: string;
  description: string;
  photoUrl: string;
  coverThumbUrl?: string;
  gallery?: string[];
  photos?: PandalPhoto[];
  history?: string;
  darshanTimings: string;
  aartiTimings: string;
  ecoFriendly: boolean;
  crowdLevel: CrowdLevel;
  nearestStation: string;
  visarjanDate: string;
  is24Hours: boolean;
}

export interface PandalFilterState {
  searchQuery: string;
  crowdLevel: 'All' | CrowdLevel;
  ecoFriendlyOnly: boolean;
  is24HoursOnly: boolean;
  selectedArea: string;
  sortByDistance: boolean;
}
