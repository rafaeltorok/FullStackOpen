// Base dependencies
import { useEffect, useState } from 'react';
import diagnoseService from "../../services/diagnoses";

// Material UI
import { InputLabel, MenuItem, Select } from '@mui/material';

// Components
import HealthCheckEntry from './addEntry/HealthCheckEntry';
import HospitalEntry from './addEntry/HospitalEntry';
import OccupationalHealthcareEntry from './addEntry/OccupationalEntry';

// TypeScript types
import type { EntryFormValues, Diagnosis } from "../../../../shared/types";

interface AddEntryProps {
  createNewEntry: (entry: EntryFormValues) => void;
  notifyError: (message: string) => void;
}

export default function AddEntryForm(props: AddEntryProps) {
  const [entryType, setEntryType] = useState<string>("Hospital");
  const types = ["OccupationalHealthcare", "Hospital", "HealthCheck"];
  const [diagnosesList, setDiagnosesList] = useState<Diagnosis[]>([]);

  useEffect(() => {
    async function getDiagnoses() {
      try {
        const response = await diagnoseService.getAll();
        if (response) setDiagnosesList(response);
      } catch(err: unknown) {
        if (err instanceof Error) console.error("Failed to get list of diagnoses:", err.message);
        else console.error(String(err));
      }
    }
    getDiagnoses();
  });

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
      {entryType === "Hospital" && 
        <HospitalEntry 
          handleNewEntry={handleNewEntry} 
          notifyError={props.notifyError} 
          diagnosesList={diagnosesList}
        />
      }
      {entryType === "HealthCheck" && 
        <HealthCheckEntry 
          handleNewEntry={handleNewEntry} 
          notifyError={props.notifyError} 
          diagnosesList={diagnosesList}
        />
      }
      {entryType === "OccupationalHealthcare" && 
        <OccupationalHealthcareEntry 
          handleNewEntry={handleNewEntry} 
          notifyError={props.notifyError} 
          diagnosesList={diagnosesList}
        />
      }
    </div>
  );
}