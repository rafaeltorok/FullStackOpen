// Base dependencies
import { useEffect, useState } from "react";
import diagnoseService from "../../services/diagnoses";

// Material UI
import { InputLabel, MenuItem, Select } from "@mui/material";

// Components
import HealthCheckEntry from "./addEntry/HealthCheckEntry";
import HospitalEntry from "./addEntry/HospitalEntry";
import OccupationalHealthcareEntry from "./addEntry/OccupationalEntry";

// TypeScript types
import type { NewEntry, Diagnosis } from "../../../../shared/types";

interface AddEntryProps {
  createNewEntry: (entry: NewEntry) => void;
  notifyError: (message: string) => void;
}

type EntryType = "Hospital" | "HealthCheck" | "OccupationalHealthcare";

export default function AddEntryForm(props: AddEntryProps) {
  const [entryType, setEntryType] = useState<EntryType>("Hospital");
  const types: EntryType[] = [
    "OccupationalHealthcare",
    "Hospital",
    "HealthCheck",
  ];
  const [diagnosesList, setDiagnosesList] = useState<Diagnosis[]>([]);

  useEffect(() => {
    async function getDiagnoses() {
      try {
        const response = await diagnoseService.getAll();
        if (response) setDiagnosesList(response);
      } catch (err: unknown) {
        if (err instanceof Error)
          console.error("Failed to get list of diagnoses:", err.message);
        else console.error(String(err));
      }
    }
    getDiagnoses();
  }, []);

  function handleSelection(selection: EntryType) {
    setEntryType(selection);
  }

  return (
    <div>
      <form className="add-entry-form">
        <InputLabel 
          id="entry-type-label"
          style={{ marginTop: 20 }}
        >Entry type</InputLabel>
        <Select
          labelId="entry-type-label"
          label="Entry type"
          fullWidth
          value={entryType}
          onChange={(e) => handleSelection(e.target.value as EntryType)}
        >
          {types.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </form>
      {entryType === "Hospital" && (
        <HospitalEntry
          key={entryType}
          handleNewEntry={props.createNewEntry}
          notifyError={props.notifyError}
          diagnosesList={diagnosesList}
        />
      )}
      {entryType === "HealthCheck" && (
        <HealthCheckEntry
          key={entryType}
          handleNewEntry={props.createNewEntry}
          notifyError={props.notifyError}
          diagnosesList={diagnosesList}
        />
      )}
      {entryType === "OccupationalHealthcare" && (
        <OccupationalHealthcareEntry
          key={entryType}
          handleNewEntry={props.createNewEntry}
          notifyError={props.notifyError}
          diagnosesList={diagnosesList}
        />
      )}
    </div>
  );
}
