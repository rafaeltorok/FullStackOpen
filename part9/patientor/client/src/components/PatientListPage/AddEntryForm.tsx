// Base dependencies
import { useState } from 'react';

// Material UI
import { InputLabel, MenuItem, Select } from '@mui/material';

// Components
import HealthCheckEntry from './addEntry/HealthCheckEntry';
import HospitalEntry from './addEntry/HospitalEntry';
import OccupationalHealthcareEntry from './addEntry/OccupationalEntry';

// TypeScript types
import type { EntryFormValues } from "../../../../shared/types";

interface AddEntryProps {
  createNewEntry: (entry: EntryFormValues) => void;
  notifyError: (message: string) => void;
}

export default function AddEntryForm(props: AddEntryProps) {
  const [entryType, setEntryType] = useState<string>("Hospital");
  const types = ["OccupationalHealthcare", "Hospital", "HealthCheck"];

  function handleSelection(selection: string) {
    setEntryType(selection);
  }

  function handleNewEntry(entry: EntryFormValues): void {
    props.createNewEntry(entry);
  }

  return (
    <div>
      <form className='add-entry-form'>
        <InputLabel style={{ marginTop: 20 }}>Entry type</InputLabel>
        <Select
          label="Type"
          fullWidth
          value={entryType}
          onChange={(e) => handleSelection(e.target.value)}
        >
        {types.map(option =>
          <MenuItem
            key={option}
            value={option}
          >
            {option}
          </MenuItem>
        )}
        </Select>
      </form>
      {entryType === "Hospital" && <HospitalEntry handleNewEntry={handleNewEntry} notifyError={props.notifyError} />}
      {entryType === "HealthCheck" && <HealthCheckEntry handleNewEntry={handleNewEntry} notifyError={props.notifyError} />}
      {entryType === "OccupationalHealthcare" && <OccupationalHealthcareEntry handleNewEntry={handleNewEntry} notifyError={props.notifyError} />}
    </div>
  );
}