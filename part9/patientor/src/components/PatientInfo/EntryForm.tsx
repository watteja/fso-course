import { useState } from "react";
import {
  TextField,
  Grid,
  Button,
  Box,
  Stack,
  SelectChangeEvent,
  MenuItem,
  Input,
  InputLabel,
  Select,
} from "@mui/material";
import { EntryType, NewEntry } from "../../types";

interface EntryFormProps {
  onCancel: () => void;
  onSubmit: (values: NewEntry) => void;
  allCodes: string[];
}

const EntryForm = ({ onSubmit, onCancel, allCodes }: EntryFormProps) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [healthRating, setHealthRating] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState("");
  const [criteria, setCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const isEntryType = (param: string): param is EntryType => {
    return Object.values(EntryType)
      .map((et) => et.toString())
      .includes(param);
  };

  const handleChangeType = (event: SelectChangeEvent) => {
    if (!isEntryType(event.target.value)) {
      return;
    }
    setEntryType(event.target.value);
  };

  const handleCodesChange = (event: SelectChangeEvent<typeof codes>) => {
    const { value } = event.target;
    setCodes(typeof value === "string" ? value.split(",") : value);
  };

  const addEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEntry = {
      type: entryType,
      description,
      date,
      specialist,
      diagnosisCodes: codes,
    };

    switch (entryType) {
      case EntryType.HealthCheck:
        return onSubmit({
          ...newEntry,
          healthCheckRating: Number(healthRating),
        } as NewEntry);
      case EntryType.OccupationalHealthcare:
        return onSubmit({
          ...newEntry,
          employerName,
          sickLeave: {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          },
        } as NewEntry);
      case EntryType.Hospital:
        return onSubmit({
          ...newEntry,
          discharge: {
            date: dischargeDate,
            criteria,
          },
        } as NewEntry);
    }
  };

  return (
    <Box
      sx={{ width: "100%" }}
      component={"form"}
      onSubmit={addEntry}
      className="form"
    >
      <Stack spacing={2}>
        <InputLabel>Entry type</InputLabel>
        <Select
          label="Entry type"
          value={entryType}
          defaultValue={EntryType.HealthCheck}
          onChange={handleChangeType}
        >
          <MenuItem value={EntryType.HealthCheck}>Health check</MenuItem>
          <MenuItem value={EntryType.OccupationalHealthcare}>
            Occupational healthcare
          </MenuItem>
          <MenuItem value={EntryType.Hospital}>Hospital</MenuItem>
        </Select>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <InputLabel>Date</InputLabel>
        <Input
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        {entryType === EntryType.HealthCheck && (
          <TextField
            label="Healthcheck rating"
            fullWidth
            value={healthRating}
            onChange={({ target }) => setHealthRating(target.value)}
          />
        )}
        <Select
          multiple
          value={codes}
          onChange={handleCodesChange}
          label="Diagnosis codes"
        >
          {allCodes.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
        {entryType === EntryType.OccupationalHealthcare && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <InputLabel>Sick leave start date</InputLabel>
            <Input
              type="date"
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
            />
            <InputLabel>Sick leave end date</InputLabel>
            <Input
              type="date"
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
            />
          </>
        )}
        {entryType === EntryType.Hospital && (
          <>
            <InputLabel>Discharge date</InputLabel>
            <Input
              type="date"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Criteria"
              fullWidth
              value={criteria}
              onChange={({ target }) => setCriteria(target.value)}
            />
          </>
        )}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default EntryForm;
