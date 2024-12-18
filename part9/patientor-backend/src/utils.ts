import { Gender } from "./types";
import { z } from "zod";

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
});
