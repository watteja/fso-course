import { v1 as uuid } from "uuid";
import patientsData from "../../data/patients";
import { NonSensitivePatient, Patient, NewPatient } from "../types";

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

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: [],
  };

  patientsData.push(newPatient); // keeping data in working memory only (toy example)
  return newPatient;
};

export default {
  getNonSensitivePatients,
  getPatient,
  addPatient,
};
