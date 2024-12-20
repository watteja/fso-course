import { Gender, EntryType, HealthCheckRating } from "./types";
import { z } from "zod";

export const DiagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(DiagnosisSchema.shape.code).optional(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const EntrySchema = z.discriminatedUnion("type", [
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema,
]);

// Omit 'id' from each member of EntrySchema discriminated union
export const NewEntrySchema = z.discriminatedUnion("type", [
  HospitalEntrySchema.omit({ id: true }),
  OccupationalHealthcareEntrySchema.omit({ id: true }),
  HealthCheckEntrySchema.omit({ id: true }),
]);

const isSsn = (ssn: string): boolean => {
  // Check if SSN is a string with exactly one dash
  return /^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(ssn);
};

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string().refine((ssn) => isSsn(ssn)),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});

export const PatientSchema = NewPatientSchema.extend({
  id: z.string(),
});

export const NonSensitivePatientSchema = PatientSchema.omit({
  ssn: true,
  entries: true,
});
