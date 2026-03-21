// Dependencies
import { useState } from 'react';

// Material UI
import { TextField, InputLabel, MenuItem, Select, Grid, Button } from '@mui/material';

// TypeScript types
import type { EntryFormValues, HealthCheckFormValues } from "../../../../../shared/types";

interface HealthCheckEntryProps {
  handleNewEntry: (entry: EntryFormValues) => void;
  notifyError: (message: string) => void;
}

export default function HealthCheckEntry(props: HealthCheckEntryProps) {
  // Health Check related states
  const [entryDetails, setEntryDetails] = useState<HealthCheckFormValues>({
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    healthCheckRating: 0
  });
  const ratingValues = { 
    "Healthy": 0,
    "LowRisk": 1,
    "HighRisk": 2,
    "CriticalRisk": 3
  };

  // Diagnoses codes states
  const [codesList, setCodesList] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");

  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      entryDetails.description.trim() === "" ||
      entryDetails.date.trim() === "" ||
      entryDetails.specialist.trim() === ""
    ) {
      props.notifyError("Missing required field(s): Description, Date or Specialist");
      return;
    }

    let newEntry: HealthCheckFormValues = { ...entryDetails };
          
    // Appends the list of diagnoses
    if (codesList.length > 0) {
      newEntry = ({ ...newEntry, diagnosisCodes: codesList });
    }

    props.handleNewEntry(newEntry);

    setEntryDetails({
      type: "HealthCheck",
      description: "",
      date: "",
      specialist: "",
      healthCheckRating: 0
    });
    setCodesList([]);
  }

  function handleCode() {
    if (codeInput.trim() !== "") {
      setCodesList([ ...codesList, codeInput ]);
      setCodeInput("");
    }
  }

  return (
    <div>
      <form 
        onSubmit={handleInput}
        className='add-entry-form'
      >
        <TextField
          label="Description"
          fullWidth 
          value={entryDetails.description}
          onChange={({ target }) => setEntryDetails({ ...entryDetails, description: target.value })}
        />
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          value={entryDetails.date}
          onChange={({ target }) => setEntryDetails({ ...entryDetails, date: target.value })}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={entryDetails.specialist}
          onChange={({ target }) => setEntryDetails({ ...entryDetails, specialist: target.value })}
        />

        <TextField
          label="Diagnosis code"
          value={codeInput}
          className='diagnoses-field'
          onChange={({ target }) => setCodeInput(target.value.toUpperCase())}
        />
        <Button 
          onClick={handleCode}
          type='button'
          style={{
            float: "right"
          }}
          variant="contained"
        >
          Add Diagnose
        </Button>

        <p>{codesList.join(", ")}</p>

        <InputLabel style={{ marginTop: 20 }}>Health Rating</InputLabel>
        <Select
          label="Health Rating"
          fullWidth
          value={entryDetails.healthCheckRating}
          onChange={({ target }) => setEntryDetails({ ...entryDetails, healthCheckRating: Number(target.value) })}
        >
        {Object.entries(ratingValues).map(([key, value]) => 
          <MenuItem
            key={key}
            value={value}
          >
            {key}
          </MenuItem>
        )}
        </Select>

        <Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}