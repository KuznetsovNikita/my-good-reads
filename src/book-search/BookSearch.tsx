import React, { useEffect, useState } from "react";
import { getBooksByType } from "./book-search.service";
import { Book } from "./model";
import { debounce } from "debounce";
import { WishList } from "./wishlist/Wishlist";
import { BookList } from "./book-list/BookList";

const useBooks = (bookTypeToSearch: string) => {
  const [allAvailableBooks, setAllAvailableBooks] = useState<Book[]>([]);

  useEffect(() => {
    getBooksByType<Book>(bookTypeToSearch).then((allBooks) => {
      setAllAvailableBooks(allBooks.items);
    });
  }, [bookTypeToSearch]);

  return allAvailableBooks;
};

const BookSearch = () => {
  const [bookType, updateBookType] = useState("");
  const [bookTypeToSearch, updateBookTypeToSearch] = useState("");
  const [myBooks, setMyBooks] = useState<Book[]>([]);

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
  return (
    <>
      <div className="book--container">
        <div className="search-params">
          <div>
            <form onSubmit={onSubmit}>
              <input
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
          <WishList myBooks={myBooks} />
        </div>
      </div>
    </>
  );
};

export default BookSearch;
