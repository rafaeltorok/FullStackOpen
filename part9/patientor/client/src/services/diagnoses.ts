import axios from "axios";
import { Diagnosis } from "../../../shared/types";

const baseUrl = "/api/diagnoses";

const getAll = async (): Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>(`${baseUrl}`);

  return data;
};

const getById = async (id: string): Promise<Diagnosis> => {
  const { data } = await axios.get<Diagnosis>(`${baseUrl}/${id}`);

  return data;
};

export default {
  getAll,
  getById,
};
