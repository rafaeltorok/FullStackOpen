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
  NewEntry,
  OccupationalHealthcareFormValues,
  Diagnosis,
} from "../../../../../shared/types";
import type { Dayjs } from "dayjs";

interface OccupationalHealthcareEntryProps {
  handleNewEntry: (entry: NewEntry) => void;
  notifyError: (message: string) => void;
  diagnosesList: Diagnosis[];
}

interface SickLeave {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export default function OccupationalHealthcareEntry(
  props: OccupationalHealthcareEntryProps,
) {
  // Occupational Healthcare related states
  const [entryDetails, setEntryDetails] =
    useState<OccupationalHealthcareFormValues>({
      type: "OccupationalHealthcare",
      description: "",
      date: "",
      specialist: "",
      employerName: "",
    });
  const [sickLeaveInfo, setSickLeaveInfo] = useState<SickLeave>({
    startDate: null,
    endDate: null,
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

    let newEntry: OccupationalHealthcareFormValues = { ...entryDetails };

    // Validates the sickLeave field
    if (sickLeaveInfo.startDate && sickLeaveInfo.endDate) {
      newEntry = {
        ...newEntry,
        sickLeave: {
          startDate: sickLeaveInfo.startDate.format("YYYY-MM-DD"),
          endDate: sickLeaveInfo.endDate.format("YYYY-MM-DD"),
        },
      };
    } else if (
      (!sickLeaveInfo.startDate && sickLeaveInfo.endDate) ||
      (sickLeaveInfo.startDate && !sickLeaveInfo.endDate)
    ) {
      props.notifyError("Missing one of the sick leave dates");
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
      type: "OccupationalHealthcare",
      description: "",
      date: "",
      specialist: "",
      employerName: "",
    });
    setCodesList([]);
    setSickLeaveInfo({ startDate: null, endDate: null });
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
        <TextField
          label="Employer name"
          fullWidth
          value={entryDetails.employerName}
          onChange={({ target }) =>
            setEntryDetails({ ...entryDetails, employerName: target.value })
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

        <InputLabel style={{ marginTop: 20 }}>Sick leave</InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start date"
            value={sickLeaveInfo.startDate}
            onChange={(newValue) =>
              setSickLeaveInfo({ ...sickLeaveInfo, startDate: newValue })
            }
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End date"
            value={sickLeaveInfo.endDate}
            onChange={(newValue) =>
              setSickLeaveInfo({ ...sickLeaveInfo, endDate: newValue })
            }
          />
        </LocalizationProvider>

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
