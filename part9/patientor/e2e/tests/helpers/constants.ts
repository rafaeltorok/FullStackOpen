export const newPatient = {
  name: "John Johns",
  ssn: "090786-122X",
  dateOfBirth: {
    year: 1980,
    month: 1,
    day: 1,
  },
  occupation: "Developer",
  gender: "male",
};

export const hospitalEntry = {
  type: "Hospital",
  description: "Stable condition.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  diagnosisCodes: ["J10.1"],
  discharge: {
    date: {
      year: "2026",
      month: "01",
      day: "03",
    },
    criteria: "Patient has healed.",
  },
};

export const healthCheckEntry = {
  type: "HealthCheck",
  description: "Routine check.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  diagnosisCodes: ["N30.0"],
  healthCheckRating: 0,
};

export const occupationalEntry = {
  type: "OccupationalHealthcare",
  description: "Patient with moderate respiratory issues.",
  date: {
    year: "2025",
    month: "12",
    day: "31",
  },
  specialist: "Doctor Tester",
  employerName: "Company",
  diagnosisCodes: ["J06.9"],
  sickLeave: {
    startDate: {
      year: "2026",
      month: "01",
      day: "01",
    },
    endDate: {
      year: "2026",
      month: "01",
      day: "15",
    },
  },
};
