import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import type { HospitalEntry } from "../../../../../shared/types";
import DiagnosesCode from "./DiagnosesCode";

interface HospitalProps {
  entry: HospitalEntry;
}

export default function Hospital(props: HospitalProps) {
  return (
    <div className="patient-entry">
      <p>{props.entry.date} <LocalHospitalIcon /></p>
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
      {props.entry.discharge && 
        <div>
          <h3>Discharge:</h3>
          <ul>
            <li>Date: {props.entry.discharge.date}</li>
            <li>Criteria: {props.entry.discharge.criteria}</li>
          </ul>
        </div>
      }
      <em>diagnose by {props.entry.specialist}</em>
    </div>
  );
}