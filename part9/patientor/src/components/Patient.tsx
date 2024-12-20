import { useState, useEffect } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Patient, Entry } from "../types";
import patientService from "../services/patients";

const PatientInfo = ({ id }: { id: string }) => {
  const [patient, setPatient] = useState<Patient | undefined>();

  useEffect(() => {
    patientService.getOne(id).then((patient) => setPatient(patient));
  }, [id]);

  if (!patient) {
    return null;
  }

  return (
    <>
      <h2>
        {patient.name}{" "}
        {patient.gender === "female" ? (
          <FemaleIcon />
        ) : patient.gender === "male" ? (
          <MaleIcon />
        ) : (
          <TransgenderIcon />
        )}
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h3>entries</h3>
      {patient.entries.map((entry: Entry) => (
        <div key={entry.id}>
          <p>
            {entry.date} <i>{entry.description}</i>
          </p>
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default PatientInfo;
