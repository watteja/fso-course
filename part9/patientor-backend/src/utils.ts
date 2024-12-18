import { NewPatient } from "./types";

const toNewPatient = (object: unknown): NewPatient => {
  console.log(object);

  return object as NewPatient;
};

export default toNewPatient;
