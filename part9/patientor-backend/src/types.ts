import { z } from "zod";
import {
  PatientSchema,
  NewPatientSchema,
  NonSensitivePatientSchema,
  EntrySchema,
  NewEntrySchema,
  DiagnosisSchema,
} from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export type Entry = z.infer<typeof EntrySchema>;

export type NewEntry = z.infer<typeof NewEntrySchema>;

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export type Patient = z.infer<typeof PatientSchema>;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export type NonSensitivePatient = z.infer<typeof NonSensitivePatientSchema>;
