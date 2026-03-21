// Dependencies
import { useState } from "react";

// Material UI
import {
  TextField,
  InputLabel,
  Grid,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// TypeScript types
import type {
  EntryFormValues,
  HospitalFormValues,
  Diagnosis,
} from "../../../../../shared/types";
import { Dayjs } from "dayjs";

interface HospitalEntryProps {
  handleNewEntry: (entry: EntryFormValues) => void;
  notifyError: (message: string) => void;
  diagnosesList: Diagnosis[];
}

interface Discharge {
  date: Dayjs | null;
  criteria: string;
}

export default function HospitalEntry(props: HospitalEntryProps) {
  // Hospital related states
  const [entryDetails, setEntryDetails] = useState<HospitalFormValues>({
    type: "Hospital",
    description: "",
    date: "",
    specialist: "",
  });
  const [dischargeInfo, setDischargeInfo] = useState<Discharge>({
    date: null,
    criteria: "",
  });

  // Diagnoses codes states
  const [codesList, setCodesList] = useState<string[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");

  const [date, setDate] = useState<Dayjs | null>(null);

  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      entryDetails.description.trim() === "" ||
      !date ||
      entryDetails.specialist.trim() === ""
    ) {
      props.notifyError(
        "Missing required field(s): Description, Date or Specialist",
      );
      return;
    }

    let newEntry: HospitalFormValues = { ...entryDetails };

    // Validates the discharge field
    if (dischargeInfo.date && dischargeInfo.criteria.trim()) {
      newEntry = {
        ...newEntry,
        discharge: {
          date: dischargeInfo.date.format("YYYY-MM-DD"),
          criteria: dischargeInfo.criteria,
        },
      };
    } else if (
      (!dischargeInfo.date && dischargeInfo.criteria.trim()) ||
      (dischargeInfo.date && !dischargeInfo.criteria.trim())
    ) {
      props.notifyError("Missing one of the discharge fields");
      return;
    }

    // Appends the list of diagnoses
    if (codesList.length > 0) {
      newEntry = { ...newEntry, diagnosisCodes: codesList };
    }

    // Adds the properly formatted date field
    newEntry = { ...newEntry, date: date.format("YYYY-MM-DD") };

    props.handleNewEntry(newEntry);

    setEntryDetails({
      type: "Hospital",
      description: "",
      date: "",
      specialist: "",
    });
    setCodesList([]);
    setDischargeInfo({ date: null, criteria: "" });
    setDate(null);
  }

  function handleCode() {
    if (selectedCode && !codesList.includes(selectedCode)) {
      setCodesList((prev) => [...prev, selectedCode]);
    }
    setSelectedCode("");
  }

  return (
    <div>
      <form onSubmit={handleInput} className="add-entry-form">
        <TextField
          label="Description"
          fullWidth
          value={entryDetails.description}
          onChange={({ target }) =>
            setEntryDetails({ ...entryDetails, description: target.value })
          }
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
          onChange={({ target }) =>
            setEntryDetails({ ...entryDetails, specialist: target.value })
          }
        />

        <InputLabel style={{ marginTop: 20 }}>Diagnosis code</InputLabel>
        <Select
          fullWidth
          value={selectedCode}
          onChange={({ target }) => setSelectedCode(target.value)}
        >
          {props.diagnosesList.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code}: {diagnosis.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={handleCode}
          type="button"
          style={{
            float: "right",
          }}
          variant="contained"
        >
          Add Diagnose
        </Button>

        <p>{codesList.join(", ")}</p>

        <InputLabel style={{ marginTop: 20 }}>Discharge</InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            value={dischargeInfo.date}
            onChange={(newValue) =>
              setDischargeInfo({ ...dischargeInfo, date: newValue })
            }
          />
        </LocalizationProvider>
        <TextField
          label="Criteria"
          value={dischargeInfo.criteria}
          onChange={({ target }) =>
            setDischargeInfo({
              ...dischargeInfo,
              criteria: target.value,
            })
          }
        />

        <Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
