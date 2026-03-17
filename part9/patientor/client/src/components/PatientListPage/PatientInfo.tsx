import { Link, useParams } from "react-router-dom";
import type { Patient } from "../../types";

interface PatientInfoProps {
  getPatient: (searchId: string | undefined) => Patient | undefined;
}

export default function PatientInfo(props: PatientInfoProps) {
  const { id } = useParams();
  const patient = props.getPatient(id);

  if (!patient) return <p>Patient not found</p>;

  return (
    <div>
      <h1>Patientor</h1>
      <Link to={'/'}>
        <button>Home</button>
      </Link>
      <p>{patient.name}</p>
      <p>ssh: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
    </div>
  );
}