import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { deleteNote } from '../../services/noteService';

export default function NoteList({ notes }: { notes: Note[] }) {
  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes']});
    },
    onError() {
      console.log('Error deleting note');
    }
  });

  return (
    <ul className={css.list}>
      {/* Набір елементів списку нотаток */}
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
