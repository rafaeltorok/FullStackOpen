// Base dependencies
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import services from "../../services/patients";

// Material UI icons
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

// Components
import EntryDetails from "./EntryDetails";

// TypeScript types
import type { Patient } from "../../../../shared/types";

export default function PatientInfo() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPatient() {
      try {
        if (!id) return;
        const patientFound = await services.getById(id);
        setPatient(patientFound);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        } else {
          console.error(String(err));
        }
        setLoading(false);
      }
    }
    fetchPatient();
  }, [id]);

  function getGenderIcon() {
    if (patient?.gender === "male") {
      return <MaleIcon />;
    } else if (patient?.gender === "female") {
      return <FemaleIcon />;
    }
    return <TransgenderIcon />;
  }

  if (loading) return <h3>Loading patient information...</h3>;

  if (!patient) return <h3>Patient not found</h3>;

  return (
    <div>
      <h2>{patient.name} {getGenderIcon()}</h2>
      <p>ssn: <strong>{patient.ssn}</strong></p>
      <p>occupation: <strong>{patient.occupation}</strong></p>
      <h3>Entries:</h3>
      {patient.entries.length > 0 ? 
        (patient.entries.map(entry => (
          <EntryDetails key={entry.id} entry={entry} />
        ))) :
        (<p>No entries available</p>)
      }
    </div>
  );
}