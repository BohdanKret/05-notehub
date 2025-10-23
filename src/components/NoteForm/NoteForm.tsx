import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import type { Note } from "../../types/note";
import * as Yup from "yup";

interface NoteFormProps {
  onSuccess: () => void;
}

const initialFormValues: Omit<Note, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  content: "",
  tag: "Todo",
};

const ValidationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      // console.log("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
    onError() {
      console.log("Error creating note");
    },
  });

  const handleSubmit = (
    values: Omit<Note, "id" | "createdAt" | "updatedAt">,
    formikHelpers: FormikHelpers<Omit<Note, "id" | "createdAt" | "updatedAt">>
  ) => {
    // formikHelpers.setSubmitting(true);
    mutate({
      title: values.title,
      content: values.content,
      tag: values.tag,
    });
    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onSuccess}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
