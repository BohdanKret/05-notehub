import axios from "axios";
import { type Note } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${myKey}`;

export const fetchNotes = async (
  page: number = 1,
  search: string = ""
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(`/notes`, {
    params: {
      search: search || undefined,
      page,
      perPage: 12,
    },
  });
  return response.data;
};

export const createNote = async (
  noteUpdate: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const response = await axios.post<Note>(`/notes`, noteUpdate);
  return response.data;
};

export const deleteNote = async (noteId: string) => {
  const response = await axios.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
