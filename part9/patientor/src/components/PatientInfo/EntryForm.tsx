import { useState } from "react";
import { TextField, Grid, Button, Box, Stack } from "@mui/material";
import { EntryType, NewEntry } from "../../types";

interface EntryFormProps {
  onCancel: () => void;
  onSubmit: (values: NewEntry) => void;
}

const EntryForm = ({ onSubmit, onCancel }: EntryFormProps) => {
  const [healthRating, setHealthRating] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState("");

  const addEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const entry: NewEntry = {
      type: EntryType.HealthCheck,
      description,
      date,
      specialist,
      diagnosisCodes: codes.split(","),
      healthCheckRating: parseInt(healthRating),
    };
    onSubmit(entry);
  };

  return (
    <Box
      sx={{ width: "100%" }}
      component={"form"}
      onSubmit={addEntry}
      className="form"
    >
      <Stack spacing={2}>
        <h3>New HealthCheck entry</h3>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Healthcheck rating"
          fullWidth
          value={healthRating}
          onChange={({ target }) => setHealthRating(target.value)}
        />
        <TextField
          label="Diagnosis codes"
          fullWidth
          value={codes}
          onChange={({ target }) => setCodes(target.value)}
        />

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
