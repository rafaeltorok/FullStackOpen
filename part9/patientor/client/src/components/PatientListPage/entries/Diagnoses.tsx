// Dependencies
import { useEffect, useState } from "react";
import diagnoses from "../../../services/diagnoses";

// TypeScript types
import type { Diagnosis } from "../../../../../shared/types";

interface DiagnosesCodeProps {
  codes: string[];
}

export default function Diagnoses(props: DiagnosesCodeProps) {
  const [diagnosesList, setDiagnosesList] = useState<Diagnosis[]>([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        const response = await diagnoses.getAll();
        setDiagnosesList(response);
      } catch (err: unknown) {
        if (err instanceof Error) console.error(err.message);
        else console.error(String(err));
      }
    }
    fetchAll();
  }, []);

  const filteredCodes = diagnosesList.filter((diagnosis) =>
    props.codes.includes(diagnosis.code),
  );

  if (filteredCodes.length === 0) return null;

  return (
    <div>
      <h3>Diagnoses codes:</h3>
      <ul>
        {filteredCodes.map((diagnosis) => (
          <li key={diagnosis.code}>
            {diagnosis.code} {diagnosis.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
