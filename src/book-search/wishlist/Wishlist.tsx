import React from "react";
import { Book } from "../model";

export interface WishlistPops {
  myBooks: Book[];
}

export const Wishlist: React.FC<WishlistPops> = React.memo(({ myBooks }) => {
  return (
    <div>
      <h4>My wishlist ({myBooks.length})</h4>
      <div>
        {myBooks.map((item) => {
          return <p key={item.id}>{item.volumeInfo.title}</p>;
        })}
      </div>
    </div>
  );
});
