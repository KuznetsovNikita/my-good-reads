import React from "react";
import { getBooksByType } from "./bookSearch.service";
import "./bookSearch.scss";
import { Book } from "./model";
import { debounce } from "debounce";
import { Wishlist } from "../wishlist/Wishlist";
import { BookList } from "../bookList/BookList";

const useBooks = (bookTypeToSearch: string) => {
  const [allAvailableBooks, setAllAvailableBooks] = React.useState<Book[]>([]);
  const [message, setMessage] = React.useState<string>("");

  React.useEffect(() => {
    if (bookTypeToSearch) {
      setMessage("Loading...");
      getBooksByType<Book>(bookTypeToSearch).then((allBooks) => {
        if (allBooks.items) {
          setMessage("");
          setAllAvailableBooks(allBooks.items);
        } else {
          setMessage("No results find...");
        }
      });
    } else {
      setMessage("");
      setAllAvailableBooks([]);
    }
  }, [bookTypeToSearch]);

  return [allAvailableBooks, message] as const;
};

const BookSearch = () => {
  const [bookType, updateBookType] = React.useState("");
  const [bookTypeToSearch, updateBookTypeToSearch] = React.useState("");
  const [myBooks, setMyBooks] = React.useState<Book[]>([]);

  const [books, message] = useBooks(bookTypeToSearch);

  const onChange = React.useMemo(() => {
    const debouncedUpdateBookTypeToSearch = debounce(
      updateBookTypeToSearch,
      500
    );
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      updateBookType(e.currentTarget.value);
      debouncedUpdateBookTypeToSearch(e.currentTarget.value);
    };
  }, [updateBookType, updateBookTypeToSearch]);

  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateBookTypeToSearch(bookType);
    },
    [bookType, updateBookTypeToSearch]
  );

  const setDefault = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      updateBookType("Javascript");
      updateBookTypeToSearch("Javascript");
    },
    [updateBookType, updateBookTypeToSearch]
  );

  const selectBook = React.useCallback(
    (book: Book) => {
      setMyBooks((myBooks) => {
        if (myBooks.find((old) => old.id === book.id)) {
          return myBooks;
        }
        return [...myBooks, book];
      });
    },
    [setMyBooks]
  );

  const removeBook = React.useCallback(
    (book: Book) => {
      setMyBooks((myBooks) => {
        if (myBooks.find((old) => old.id === book.id)) {
          return myBooks.filter((old) => old.id !== book.id);
        }
        return myBooks;
      });
    },
    [setMyBooks]
  );

  return (
    <>
      <div className="book--container">
        <div className="search-params">
          <div>
            <form onSubmit={onSubmit}>
              <input
                data-testid="search-input"
                className="full-width"
                autoFocus
                name="gsearch"
                type="search"
                value={bookType}
                placeholder="Search for books to add to your reading list and press Enter"
                onChange={onChange}
              />
            </form>
            <SearchBody
              books={books}
              myBooks={myBooks}
              message={message}
              selectBook={selectBook}
              setDefault={setDefault}
            />
          </div>
        </div>
        <div className="sidebar">
          <Wishlist myBooks={myBooks} removeBook={removeBook} />
        </div>
      </div>
    </>
  );
};

interface SearchBodyProps {
  message: string;
  books: Book[];
  myBooks: Book[];
  selectBook: (book: Book) => void;
  setDefault: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
const SearchBody: React.FC<SearchBodyProps> = ({
  message,
  books,
  myBooks,
  selectBook,
  setDefault,
}) => {
  if (message) {
    return (
      <div className="empty">
        <p>{message}</p>
      </div>
    );
  }
  if (books.length) {
    return <BookList books={books} myBooks={myBooks} selectBook={selectBook} />;
  }

  return (
    <div className="empty">
      <p>
        Try searching for a topic, for example
        <a href="#/" onClick={setDefault}>
          "Javascript"
        </a>
      </p>
    </div>
  );
};

export default BookSearch;
