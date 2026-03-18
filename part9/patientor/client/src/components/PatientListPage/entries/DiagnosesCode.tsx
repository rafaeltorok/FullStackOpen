import { useState, useEffect } from "react";
import diagnosesService from "../../../services/diagnoses";

import type { Diagnosis } from "../../../../../shared/types";

interface DiagnosesCodeProps {
  code: string;
}

export default function DiagnosesCode(props: DiagnosesCodeProps) {
  const [diagnose, setDiagnose] = useState<Diagnosis | null>(null);

  useEffect(() => {
    async function fetchDiagnose() {
      try {
        if (!props.code) return;
        const response = await diagnosesService.getById(props.code);
        setDiagnose(response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        } else {
          console.error(String(err));
        }
      }
    }
    fetchDiagnose();
  }, [props.code]);

  if (!diagnose) return;

  return (
    <li>{diagnose.code} {diagnose.name}</li>
  );
}