export interface VisarjanSite {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  description: string;
  photoUrl: string;
  majorPandals: string[];
  nearestStations: string[];
  processionRoute: string;
  peakDays: string[];
  bmcFacilities: string[];
  trafficAdvisory: string;
  tideSafetyTip: string;
}
