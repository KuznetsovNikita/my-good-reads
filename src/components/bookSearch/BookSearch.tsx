import React from "react";
import { getBooksByType } from "./bookSearch.service";
import "./bookSearch.scss";
import { Book } from "./model";
import { debounce } from "debounce";
import { Wishlist } from "../wishlist/Wishlist";
import { BookList } from "../bookList/BookList";

const useBooks = (bookTypeToSearch: string) => {
  const [allAvailableBooks, setAllAvailableBooks] = React.useState<Book[]>([]);

  React.useEffect(() => {
    if (bookTypeToSearch) {
      getBooksByType<Book>(bookTypeToSearch).then((allBooks) => {
        setAllAvailableBooks(allBooks.items);
      });
    } else {
      setAllAvailableBooks([]);
    }
  }, [bookTypeToSearch]);

  return allAvailableBooks;
};

const BookSearch = () => {
  const [bookType, updateBookType] = React.useState("");
  const [bookTypeToSearch, updateBookTypeToSearch] = React.useState("");
  const [myBooks, setMyBooks] = React.useState<Book[]>([]);

  const books = useBooks(bookTypeToSearch);

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
            {(books.length && (
              <BookList books={books} selectBook={selectBook} />
            )) ||
              (!bookType && (
                <div className="empty">
                  <p>
                    Try searching for a topic, for example
                    <a href="#/" onClick={setDefault}>
                      "Javascript"
                    </a>
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="sidebar">
          <Wishlist myBooks={myBooks} removeBook={removeBook} />
        </div>
      </div>
    </>
  );
};

export default BookSearch;
