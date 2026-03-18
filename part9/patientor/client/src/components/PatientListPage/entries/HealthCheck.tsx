import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { HealthCheckEntry } from "../../../../../shared/types";
import DiagnosesCode from "./DiagnosesCode";

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

export default function HealthCheck(props: HealthCheckProps) {
  function HealthRating() {
    switch (props.entry.healthCheckRating) {
      case 0:
        return <FavoriteIcon style={{ color: "green" }} />;
      case 1:
        return <FavoriteIcon style={{ color: "yellow" }} />;
      case 2:
        return <FavoriteIcon style={{ color: "orange" }} />;
      case 3:
        return <FavoriteIcon style={{ color: "red" }} />;
    }
  }

  return (
    <div className="patient-entry">
      <p>{props.entry.date} <LocalHospitalIcon /></p>
      <p>{props.entry.description}</p>
      <p>{HealthRating()}</p>
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