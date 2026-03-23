// Component dependencies
import { useState, SyntheticEvent } from "react";

// Material UI
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// TypeScript types
import { PatientFormValues, Gender } from "../../../../shared/types";
import { Dayjs } from "dayjs";

interface Props {
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

interface GenderOption {
  value: Gender;
  label: string;
}

const genderOptions: GenderOption[] = Object.values(Gender).map((v) => ({
  value: v,
  label: v.toString(),
}));

const AddPatientForm = ({ onCancel, onSubmit }: Props) => {
  const [patientData, setPatientData] = useState<PatientFormValues>({
    name: "",
    occupation: "",
    ssn: "",
    dateOfBirth: "",
    gender: Gender.Other
  });
  const [date, setDate] = useState<Dayjs | null>(null);

  const onGenderChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const gender = Object.values(Gender).find((g) => g.toString() === value);
      if (gender) {
        setPatientData({ ...patientData, gender: gender });
      }
    }
  };

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();
    
    // Formats the date of birth
    if (date) setPatientData({ ...patientData, dateOfBirth: date.format("YYYY-MM-DD") });

    onSubmit(patientData);
  };

  return (
    <div>
      <form onSubmit={addPatient}>
        <TextField
          label="Name"
          fullWidth
          value={patientData.name}
          onChange={({ target }) => setPatientData({ ...patientData, name: target.value })}
        />
        <TextField
          label="Social security number"
          fullWidth
          value={patientData.ssn}
          onChange={({ target }) => setPatientData({ ...patientData, ssn: target.value })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of birth"
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
        </LocalizationProvider>
        <TextField
          label="Occupation"
          fullWidth
          value={patientData.occupation}
          onChange={({ target }) => setPatientData({ ...patientData, occupation: target.value })}
        />

        <InputLabel style={{ marginTop: 20 }}>Gender</InputLabel>
        <Select
          label="Gender"
          fullWidth
          value={patientData.gender}
          onChange={onGenderChange}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
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
};

export default AddPatientForm;
