// Dependencies
import { useState } from 'react';

// Material UI
import { TextField, InputLabel, MenuItem, Select, Grid, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// TypeScript types
import type { EntryFormValues, HealthCheckFormValues } from "../../../../../shared/types";
import type { Dayjs } from 'dayjs';

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

  const [date, setDate] = useState<Dayjs | null>(null);

  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      entryDetails.description.trim() === "" ||
      !date ||
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

    // Adds the properly formatted date field
    newEntry = ({ ...newEntry, date: date.format("YYYY-MM-DD") });

    props.handleNewEntry(newEntry);

    setEntryDetails({
      type: "HealthCheck",
      description: "",
      date: "",
      specialist: "",
      healthCheckRating: 0
    });
    setCodesList([]);
    setDate(null);
  }

  function handleCode() {
    if (codeInput.trim() !== "") {
      setCodesList(prev => [...prev, codeInput]);
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker 
            label="Date" 
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
        </LocalizationProvider>
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