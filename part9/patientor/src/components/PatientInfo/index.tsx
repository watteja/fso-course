import { useState, useEffect } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Patient, Entry, Diagnosis } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";

interface PatientInfoProps {
  id: string;
  diagnoses: Diagnosis[];
}

const PatientInfo = ({ id, diagnoses }: PatientInfoProps) => {
  const [patient, setPatient] = useState<Patient | undefined>();

  useEffect(() => {
    patientService.getOne(id).then((patient) => setPatient(patient));
  }, [id]);

  useEffect(() => {
    // add diagnoses to their codes in the entries
    if (patient && diagnoses) {
      patient.entries.forEach((entry) => {
        if (entry.diagnosisCodes) {
          entry.diagnosisCodes.forEach((code) => {
            const diagnosis = diagnoses.find((d) => d.code === code);
            if (diagnosis) {
              code = `${code} ${diagnosis.name}`;
            }
          });
        }
      });
    }
  }, [patient, diagnoses]);

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
        <div className="entry" key={entry.id}>
          <EntryDetails entry={entry} />
          <div>diagnose by {entry.specialist}</div>
        </div>
      ))}
    </>
  );
};

export default PatientInfo;
