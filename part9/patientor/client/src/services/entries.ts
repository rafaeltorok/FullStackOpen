import axios from "axios";
import { Entry, EntryFormValues } from "../../../shared/types";

const baseUrl = "/api/patients/";

const create = async (object: EntryFormValues, id: string): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${baseUrl}/${id}/entries`,
    object
  );

  return data;
};

export default {
  create
};
