// Components
import Diagnoses from "./Diagnoses";

// Material UI
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";

// TypeScript types
import type { HealthCheckEntry } from "../../../../../shared/types";

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

export default function HealthCheck(props: HealthCheckProps) {
  function HealthRating() {
    switch (props.entry.healthCheckRating) {
      case 0:
        return <FavoriteIcon style={{ color: "rgb(0, 255, 0)" }} />;
      case 1:
        return <FavoriteIcon style={{ color: "rgb(255, 255, 0)" }} />;
      case 2:
        return <FavoriteIcon style={{ color: "rgb(255, 125, 0)" }} />;
      case 3:
        return <FavoriteIcon style={{ color: "rgb(255, 0, 0)" }} />;
    }
  }

  return (
    <div className="patient-entry">
      <p>
        {props.entry.date} <LocalHospitalIcon />
      </p>
      <p>{props.entry.description}</p>
      <p>{HealthRating()}</p>
      {props.entry.diagnosisCodes && (
        <Diagnoses codes={props.entry.diagnosisCodes} />
      )}
      <em>diagnose by {props.entry.specialist}</em>
    </div>
  );
}
