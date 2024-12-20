import { useState, useEffect } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Patient, Entry, Diagnosis, NewEntry } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import Button from "@mui/material/Button/Button";
import EntryForm from "./EntryForm";
import axios from "axios";
import Alert from "@mui/material/Alert/Alert";

interface PatientInfoProps {
  id: string;
  diagnoses: Diagnosis[];
}

const PatientInfo = ({ id, diagnoses }: PatientInfoProps) => {
  const [patient, setPatient] = useState<Patient | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();

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

  const hideForm = () => {
    setShowForm(false);
    setError(undefined);
  };

  const addNewEntry = async (values: NewEntry) => {
    try {
      const addedEntry = await patientService.addEntry(id, values);
      const updatedPatient = {
        ...patient,
        entries: patient.entries.concat(addedEntry),
      };
      setPatient(updatedPatient);
      setShowForm(false);
    } catch (e: unknown) {
      console.log("ERROR");

      console.log(e);

      if (axios.isAxiosError(e)) {
        const errors: { message: string }[] = e.response?.data?.error;
        if (errors) {
          console.log(errors);
          const message = errors.map((error) => error.message).join(". ");
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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

      {error && <Alert severity="error">{error}</Alert>}
      {showForm && (
        <EntryForm
          onSubmit={addNewEntry}
          onCancel={hideForm}
          allCodes={diagnoses.map((d) => d.code)}
        />
      )}

      <h3>entries</h3>
      {patient.entries.map((entry: Entry) => (
        <div className="entry" key={entry.id}>
          <EntryDetails entry={entry} />
          <div>diagnose by {entry.specialist}</div>
        </div>
      ))}
      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
        >
          Add New Entry
        </Button>
      )}
    </>
  );
};

export default PatientInfo;
