import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../../../types/types";

const baseUrl = "/api/diaries";

export async function getAll(): Promise<DiaryEntry[]> {
  try {
    const response = await axios.get<DiaryEntry[]>(baseUrl);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(String(err));
    }
  }
}

export async function addNew(newEntry: NewDiaryEntry): Promise<DiaryEntry> {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, newEntry);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(String(err));
    }
  }
}