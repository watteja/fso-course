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

const addPatient = (newPatientData: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...newPatientData,
  };

  patientsData.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitivePatients,
  getPatient,
  addPatient,
};
