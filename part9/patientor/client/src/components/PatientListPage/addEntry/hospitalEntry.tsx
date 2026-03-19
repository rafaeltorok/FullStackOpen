import {  TextField, InputLabel, MenuItem, Select, Grid, Button } from '@mui/material';
import { useState } from 'react';

import type { newEntry } from "../../../../../shared/types";

interface HospitalEntryProps {
  handleNewEntry: (entry: newEntry) => void;
}

export default function HospitalEntry(props: HospitalEntryProps) {
  const [entryDetails, setEntryDetails] = useState({
    type: "Hospital",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    discharge: {
      date: "",
      criteria: ""
    }
  });

  function handleInput() {
    if (
      !entryDetails.description ||
      !entryDetails.date ||
      !entryDetails.specialist
    ) {
      alert("Missing required fields: Description, Date or Specialist");
      return;
    }
    props.handleNewEntry(entryDetails);
  }

  return (
    <div>
      <form onSubmit={handleInput}>
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
      </form>
    </div>
  );
}