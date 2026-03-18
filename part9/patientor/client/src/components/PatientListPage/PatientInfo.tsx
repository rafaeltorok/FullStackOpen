// Base dependencies
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../../constants";
import axios from "axios";

// Material UI icons
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

// TypeScript types
import type { Patient } from "../../types";

export default function PatientInfo() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        } else {
          console.error(String(err));
        }
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

  if (!patient) return <p>Patient not found</p>;

  return (
    <div>
      <h2>{patient.name} {getGenderIcon()}</h2>
      <p>ssn: <strong>{patient.ssn}</strong></p>
      <p>occupation: <strong>{patient.occupation}</strong></p>
    </div>
  );
}