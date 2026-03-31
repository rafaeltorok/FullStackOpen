export type PatientInput = {
  name?: unknown;
  ssn?: unknown;
  dateOfBirth?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  occupation?: unknown;
  gender?: unknown;
};

export type HospitalEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  specialist?: unknown;
  diagnosisCodes?: unknown[];
  discharge?: {
    date?: {
      year?: unknown;
      month?: unknown;
      day?: unknown;
    };
    criteria?: unknown;
  };
};

export type HealthCheckEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  specialist?: unknown;
  diagnosisCodes?: unknown[];
  healthCheckRating?: unknown;
};

export type OccupationalEntryInput = {
  description?: unknown;
  date?: {
    year?: unknown;
    month?: unknown;
    day?: unknown;
  };
  specialist?: unknown;
  employerName?: unknown;
  diagnosisCodes?: unknown[];
  sickLeave?: {
    startDate?: {
      year?: unknown;
      month?: unknown;
      day?: unknown;
    };
    endDate?: {
      year?: unknown;
      month?: unknown;
      day?: unknown;
    };
  };
};
