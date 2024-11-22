
 export interface TripTypesState {
    tripTypes: TripType[];
    loadingTriptype: boolean;
    errorTriptype: string | null;
    creating: boolean;
  }
  interface TripType {
    id: string;
    name: string;
  }
  