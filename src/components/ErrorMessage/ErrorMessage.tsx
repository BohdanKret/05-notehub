import css from './ErrorMessage.module.css'

export default function ErrorMessage() {
  return <div className={css.error}>Error loading notes.</div>;
}
