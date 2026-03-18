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
      <ul>
        {props.entry.diagnosisCodes && (
          props.entry.diagnosisCodes.map(code => (
            <DiagnosesCode key={code} code={code} />
          ))
        )}
      </ul>
      <p>diagnose by {props.entry.specialist}</p>
    </div>
  );
}