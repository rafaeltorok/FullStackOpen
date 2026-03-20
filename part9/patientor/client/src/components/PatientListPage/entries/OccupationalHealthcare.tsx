import WorkIcon from "@mui/icons-material/Work";
import type { OccupationalHealthcareEntry } from "../../../../../shared/types";
import DiagnosesCode from "./DiagnosesCode";

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
}

export default function OccupationalHealthcare(props: OccupationalHealthcareProps) {
  return (
    <div className="patient-entry">
      <p>{props.entry.date} <WorkIcon /> {props.entry.employerName}</p>
      <p>{props.entry.description}</p>
      {props.entry.diagnosisCodes &&
        <div>
          <h3>Diagnosis codes:</h3>
          <ul>
            {props.entry.diagnosisCodes.map(code => (
              <DiagnosesCode key={code} code={code} />
            ))}
          </ul>
        </div>
      }
      {props.entry.sickLeave && 
        <div>
          <h3>Sick leave:</h3>
          <ul>
            <li>Start date: {props.entry.sickLeave.startDate}</li>
            <li>End date: {props.entry.sickLeave.endDate}</li>
          </ul>
        </div>
      }
      <em>diagnose by {props.entry.specialist}</em>
    </div>
  );
}