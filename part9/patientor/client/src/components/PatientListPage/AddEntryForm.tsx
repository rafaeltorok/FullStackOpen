// Base dependencies
import { useState } from 'react';
import { v4 as uuidv4 } from "uuid";

// Material UI
import { InputLabel, MenuItem, Select } from '@mui/material';

// Components
import HealthCheckEntry from './addEntry/healthCheckEntry';

// TypeScript types
import type { Entry, newEntry } from "../../../../shared/types";

interface AddEntryProps {
  createNewEntry: (entry: Entry) => void;
}

export default function AddEntryForm(props: AddEntryProps) {
  const [entryType, setEntryType] = useState<string>("Hospital");
  const types = ["OccupationalHealthcare", "Hospital", "HealthCheck"];

  function handleSelection(selection: string) {
    setEntryType(selection);
    switch (entryType) {
      case "HealthCheck":
        return <HealthCheckEntry handleNewEntry={handleNewEntry} />;
    }
  }

  function handleNewEntry(entry: newEntry): void {
    const newId = uuidv4();
    props.createNewEntry({ ...entry, id: newId });
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
      {entryType === "Hospital" && <></>}
      {entryType === "HealthCheck" && <HealthCheckEntry handleNewEntry={handleNewEntry} />}
      {entryType === "OccupationalHealthcare" && <></>}
    </div>
  );
}