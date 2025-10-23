import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { useState } from "react";
import Modal from "../Modal/Modal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useDebounce } from "use-debounce";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTopic, setSearchTopic] = useState<string>("");

  // Відкладений пошук - запит виконується тільки після 500мс затримки
  const [debouncedSearchTopic] = useDebounce(searchTopic, 500);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearchTopic, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearchTopic),
    placeholderData: keepPreviousData,
  });

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTopic(value);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTopic} onChange={handleSearchChange} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
          />
        )}

        <button className={css.createButton} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {data && !isLoading && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;
