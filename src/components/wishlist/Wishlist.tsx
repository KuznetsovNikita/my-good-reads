import React from "react";
import { Book } from "../bookSearch/model";
import "./wishlist.scss";

export interface WishlistPops {
  myBooks: Book[];
  removeBook: (book: Book) => void;
}

export const Wishlist: React.FC<WishlistPops> = React.memo(
  ({ myBooks, removeBook }) => {
    return (
      <div>
        <h4>My wishlist ({myBooks.length})</h4>
        <div>
          {myBooks.map((item) => {
            return (
              <p key={item.id}>
                {item.volumeInfo.title}{" "}
                <span
                  className="remove-button"
                  onClick={() => removeBook(item)}
                >
                  [x]
                </span>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
);
