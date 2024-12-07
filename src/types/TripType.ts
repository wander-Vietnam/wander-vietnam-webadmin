
 export interface TripTypesState {
    tripTypes: TripType[];
    loadingTriptype: boolean;
    errorTriptype: string | null;
    creating: boolean;
  }
  export interface TripType {
    id_TripType: string;  
    tripTypeName: string;
    // other properties
  }
  