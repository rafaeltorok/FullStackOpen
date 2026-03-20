import {  TextField, InputLabel, Grid, Button } from '@mui/material';
import { useState } from 'react';

import type { EntryFormValues, HospitalFormValues } from "../../../../../shared/types";

interface HospitalEntryProps {
  handleNewEntry: (entry: EntryFormValues) => void;
}

export default function HospitalEntry(props: HospitalEntryProps) {
  const [entryDetails, setEntryDetails] = useState<HospitalFormValues>({
    type: "Hospital",
    description: "",
    date: "",
    specialist: ""
  });
  const [codesList, setCodesList] = useState<string[]>([]);
  const [codeInput, setCodeInput] = useState<string>("");
  const [dischargeInfo, setDischargeInfo] = useState({
    date: "",
    criteria: ""
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

    let newEntry: HospitalFormValues = { ...entryDetails };

    // Validates the discharge field
    if (dischargeInfo.date.trim() && dischargeInfo.criteria.trim()) {
      newEntry = ({ ...newEntry, discharge: dischargeInfo });
    } else if (
      ( !dischargeInfo.date.trim() && dischargeInfo.criteria.trim() ) ||
      ( dischargeInfo.date.trim() && !dischargeInfo.criteria.trim() )
    ) {
      alert("Missing one of the discharge fields");
      return;
    }
      
    // Appends the list of diagnoses
    if (codesList.length > 0) {
      newEntry = ({ ...newEntry, diagnosisCodes: codesList });
    }

    props.handleNewEntry(newEntry);

    setEntryDetails({
      type: "Hospital",
      description: "",
      date: "",
      specialist: ""
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

        <InputLabel style={{ marginTop: 20 }}>Discharge</InputLabel>
        <TextField
          label="Date"
          value={dischargeInfo.date}
          onChange={({ target }) => setDischargeInfo({
              ...dischargeInfo, date: target.value
            })}
        />
        <TextField
          label="Criteria"
          value={dischargeInfo.criteria}
          onChange={({ target }) => setDischargeInfo({
              ...dischargeInfo, criteria: target.value
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