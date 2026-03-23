// Components
import Diagnoses from "./Diagnoses";

// Material UI
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

// TypeScript types
import type { HospitalEntry } from "../../../../../shared/types";

interface HospitalProps {
  entry: HospitalEntry;
}

export default function Hospital(props: HospitalProps) {
  return (
    <div className="patient-entry">
      <p>
        {props.entry.date} <LocalHospitalIcon />
      </p>
      <p>{props.entry.description}</p>
      {props.entry.diagnosisCodes && (
        <Diagnoses codes={props.entry.diagnosisCodes} />
      )}
      {props.entry.discharge && (
        <div>
          <h3>Discharge:</h3>
          <ul>
            <li>Date: {props.entry.discharge.date}</li>
            <li>Criteria: {props.entry.discharge.criteria}</li>
          </ul>
        </div>
      )}
      <em>diagnose by {props.entry.specialist}</em>
    </div>
  );
}
