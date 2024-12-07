import { Question } from "./Question";

export interface Checkpoint {
  id_CheckPoint: string;
  checkpointName: string;
  latitude: string;
  longitude: string;
  operatingHours: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}
export interface AllCheckpointsResponse {
  id_CheckPoint: string;
  longitude: string;
  latitude: string;
  id_City: string;
  checkpointName: string;
  operatingHours: string;
  createdAt: string;
  updatedAt: string;
  address: string;
}
export interface CheckpointsDetailResponse {
  id_CheckPoint: string;
  longitude: string;
  latitude: string;
  id_City: string;
  checkpointName: string;
  operatingHours: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  cityName: string;
}
export interface ICheckPointCreate {
  latitude: string;
  longitude: string;
  id_City: string;
  checkpointName: string;
  operatingHours?: string;
  address: string;
}
export interface ICheckPointUpdate {
  latitude: string;
  longitude: string;
  id_City: string;
  checkpointName: string;
  address: string;
  operatingHours: string;
}
// types/Checkpoint.ts

export interface AllCheckpoint {
  id_CheckPoint: string;
  longitude: string;
  latitude: string;
  id_City: string;
  checkpointName: string;
  operatingHours: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  isDeleted: boolean;
  cityName: string;
}


