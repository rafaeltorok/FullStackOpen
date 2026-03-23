// Components
import Diagnoses from "./Diagnoses";

// Material UI
import WorkIcon from "@mui/icons-material/Work";

// TypeScript types
import type { OccupationalHealthcareEntry } from "../../../../../shared/types";

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
}

export default function OccupationalHealthcare(
  props: OccupationalHealthcareProps,
) {
  return (
    <div className="patient-entry">
      <p>
        {props.entry.date} <WorkIcon /> {props.entry.employerName}
      </p>
      <p>{props.entry.description}</p>
      {props.entry.diagnosisCodes && (
        <Diagnoses codes={props.entry.diagnosisCodes} />
      )}
      {props.entry.sickLeave && (
        <div>
          <h3>Sick leave:</h3>
          <ul>
            <li>Start date: {props.entry.sickLeave.startDate}</li>
            <li>End date: {props.entry.sickLeave.endDate}</li>
          </ul>
        </div>
      )}
      <em>diagnose by {props.entry.specialist}</em>
    </div>
  );
}
