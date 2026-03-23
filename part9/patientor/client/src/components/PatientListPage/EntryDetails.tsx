// Components
import OccupationalHealthcare from "./entries/OccupationalHealthcare";
import HealthCheck from "./entries/HealthCheck";
import Hospital from "./entries/Hospital";

// TypeScript types
import type { Entry } from "../../../../shared/types";

interface EntryDetailsProps {
  entry: Entry;
}

function assertNever(value: never, message?: string): never {
  throw new Error(message ? message : `Unexpected value: ${value}`);
}

export default function EntryDetails(props: EntryDetailsProps) {
  switch (props.entry.type) {
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={props.entry} />;
    case "HealthCheck":
      return <HealthCheck entry={props.entry} />;
    case "Hospital":
      return <Hospital entry={props.entry} />;
    default:
      return assertNever(props.entry);
  }
}
