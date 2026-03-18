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