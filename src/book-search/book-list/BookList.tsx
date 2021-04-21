import React from "react";
import { Book } from "../model";

interface BookListProps {
  books: Book[];
  selectBook: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, selectBook }) => {
  return (
    <div className="book-list">
      {books.map((book) => {
        return (
          <div
            className="book-list-item"
            key={book.id}
            data-testid="book-result"
          >
            {book.volumeInfo.imageLinks && (
              <div className="book-thumbnail">
                <img
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                  alt={book.volumeInfo.title + " Thumbnail"}
                />
              </div>
            )}
            <div className="book-info">
              <h3 onClick={() => selectBook(book)}>{book.volumeInfo.title}</h3>
              <p>
                Authors:{" "}
                {(book.volumeInfo.authors &&
                  book.volumeInfo.authors.join(", ")) ||
                  "N/A"}
              </p>
              <p>Publisher: {book.volumeInfo.publisher || "N/A"}</p>
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    (book.searchInfo && book.searchInfo.textSnippet) ||
                    book.volumeInfo.description,
                }}
              ></p>
              <button onClick={() => selectBook(book)}>Add to wishlist</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
