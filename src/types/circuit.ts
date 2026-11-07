export interface Circuit {
  id: string;
  name: string;
  tagline: string;
  area: string;
  pandalIds: string[];
  totalDistanceKm: number;
  estimatedWalkingMins: number;
  entryStation: string;
  exitStation: string;
  travelTip: string;
  themeColor: string;
}

