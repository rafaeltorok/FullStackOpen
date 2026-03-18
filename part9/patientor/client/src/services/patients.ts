import axios from "axios";
import { Patient, PatientFormValues } from "../../../shared/types";

const baseUrl = "/api/patients";

const getAll = async (): Promise<Patient[]> => {
  const { data } = await axios.get<Patient[]>(
    `${baseUrl}`
  );

  return data;
};

const getById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(
    `${baseUrl}/${id}`
  );

  return data;
};

const create = async (object: PatientFormValues): Promise<Patient> => {
  const { data } = await axios.post<Patient>(
    `${baseUrl}`,
    object
  );

  return data;
};

export default {
  getAll, getById, create
};

