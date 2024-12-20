import { v1 as uuid } from "uuid";
import patientsData from "../../data/patients";
import {
  NonSensitivePatient,
  Patient,
  NewPatient,
  NewEntry,
  Entry,
} from "../types";

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patientsData.find((patient) => patient.id === id);
};

const addPatient = (newPatientData: NewPatient): Patient => {
  // generate ids for patient's entries
  const entries = newPatientData.entries;
  entries.forEach((entry) => {
    entry.id = uuid();
  });

  const newPatient: Patient = {
    id: uuid(),
    ...newPatientData,
  };

  patientsData.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, newEntryData: NewEntry): Entry => {
  const patient = patientsData.find((p) => p.id === patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...newEntryData,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  getPatient,
  addPatient,
  addEntry,
};
