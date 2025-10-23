import css from './SearchBox.module.css'

export default function SearchBox({ searchTopic, handleSearchChange }: { searchTopic: string; handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return <input className={css.input} type="text" placeholder="Search notes" value={searchTopic} onChange={handleSearchChange} />;
}
