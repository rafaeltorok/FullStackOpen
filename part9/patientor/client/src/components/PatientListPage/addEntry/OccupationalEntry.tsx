import {  TextField, InputLabel, Grid, Button } from '@mui/material';
import { useState } from 'react';

import type { EntryFormValues, OccupationalHealthcareFormValues } from "../../../../../shared/types";

interface OccupationalHealthcareEntryProps {
  handleNewEntry: (entry: EntryFormValues) => void;
}

export default function OccupationalHealthcareEntry(props: OccupationalHealthcareEntryProps) {
  const [entryDetails, setEntryDetails] = useState<OccupationalHealthcareFormValues>({
    type: "OccupationalHealthcare",
    description: "",
    date: "",
    specialist: "",
    employerName: ""
  });
  const [codesList, setCodesList] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");
  const [sickLeaveInfo, setSickLeaveInfo] = useState({
    startDate: "",
    endDate: ""
  });

  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      entryDetails.description.trim() === "" ||
      entryDetails.date.trim() === "" ||
      entryDetails.specialist.trim() === ""
    ) {
      alert("Missing required field(s): Description, Date or Specialist");
      return;
    }

    let newEntry: OccupationalHealthcareFormValues = { ...entryDetails };

    // Validates the sickLeave field
    if (sickLeaveInfo.startDate.trim() && sickLeaveInfo.endDate.trim()) {
      newEntry = ({ ...newEntry, sickLeave: sickLeaveInfo });
    } else if (
      ( !sickLeaveInfo.startDate.trim() && sickLeaveInfo.endDate.trim() ) ||
      ( sickLeaveInfo.startDate.trim() && !sickLeaveInfo.endDate.trim() )
    ) {
      alert("Missing one of the sick leave dates");
      return;
    }
      
    // Appends the list of diagnoses
    if (codesList.length > 0) {
      newEntry = ({ ...newEntry, diagnosisCodes: codesList });
    }

    props.handleNewEntry(newEntry);

    setEntryDetails({
      type: "OccupationalHealthcare",
      description: "",
      date: "",
      specialist: "",
      employerName: ""
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
          label="Employer name"
          fullWidth
          value={entryDetails.employerName}
          onChange={({ target }) => setEntryDetails({ ...entryDetails, employerName: target.value })}
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

        <InputLabel style={{ marginTop: 20 }}>Sick leave</InputLabel>
        <TextField
          label="Start date"
          value={sickLeaveInfo.startDate}
          onChange={({ target }) => setSickLeaveInfo({
              ...sickLeaveInfo, startDate: target.value
            })}
        />
        <TextField
          label="End date"
          value={sickLeaveInfo.endDate}
          onChange={({ target }) => setSickLeaveInfo({
              ...sickLeaveInfo, endDate: target.value
            })}
        />

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