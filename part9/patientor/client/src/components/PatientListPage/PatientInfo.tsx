// Base dependencies
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import entryService from "../../services/entries";
import useNotification from "../../hooks/useNotification";

// Material UI elements
import { Button } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// Components
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

// TypeScript types
import type { Patient, EntryFormValues } from "../../../../shared/types";

export default function PatientInfo() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { notification, notifySuccess, notifyError } = useNotification();

  // Add entry form states
  const [showAddEntryForm, setShowAddEntryForm] = useState<boolean>(false);
  const [addEntryText, setAddEntryText] = useState<string>("Add new entry");

  useEffect(() => {
    async function fetchPatient() {
      try {
        if (!id) return;
        const patientFound = await patientService.getById(id);
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

  function toggleAddForm() {
    setShowAddEntryForm((prev) => {
      setAddEntryText(prev ? "Add new entry" : "Cancel");
      return !prev;
    });
  }

  async function createNewEntry(newEntry: EntryFormValues): Promise<void> {
    try {
      if (patient) {
        const response = await entryService.create(newEntry, patient.id);
        if (response)
          setPatient({ ...patient, entries: patient.entries.concat(response) });
        toggleAddForm();
      }
      notifySuccess("Entry was added successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) notifyError(err.message);
      else notifyError(String(err));
    }
  }

  if (loading) return <h3>Loading patient information...</h3>;

  if (!patient) return <h3>Patient not found</h3>;

  return (
    <div>
      <h2>
        {patient.name} {getGenderIcon()}
      </h2>
      <p>
        ssn: <strong>{patient.ssn}</strong>
      </p>
      <p>
        occupation: <strong>{patient.occupation}</strong>
      </p>
      <h3>
        Entries
        {patient.entries.length > 0 && (
          <span> ({patient.entries.length} total)</span>
        )}
        :
      </h3>

      <Button variant="contained" color="primary" onClick={toggleAddForm}>
        {addEntryText}
      </Button>

      {notification.type && notification.message && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity={notification.type}>{notification.message}</Alert>
        </Stack>
      )}

      {showAddEntryForm && (
        <AddEntryForm
          notifyError={notifyError}
          createNewEntry={createNewEntry}
        />
      )}

      {patient.entries.length > 0 ? (
        patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))
      ) : (
        <p>No entries available</p>
      )}
    </div>
  );
}
