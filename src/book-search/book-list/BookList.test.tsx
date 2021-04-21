import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BookList } from "./BookList";
import { Book } from "../model";

describe("Book list component", () => {
  const description = "JavaScript description";

  const mockMajorBook: Book = {
    id: "wvrGBwAAQBAJ1",
    volumeInfo: {
      title: "JavaScript 1",
      authors: ["Author 1", "Author 2"],
      publisher: "Gökhan GÜRLEYEN",
      description,
      imageLinks: {
        smallThumbnail:
          "http://books.google.com/books/content?id=wvrGBwAAQBAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        thumbnail: "",
      },
    },
  };

  const mockMinorBook: Book = {
    id: "wvrGBwAAQBAJ2",
    volumeInfo: {
      title: "JavaScript 2",
      description,
    },
  };

  it("Book list should render all major data", () => {
    const { getByText } = render(
      <BookList books={[mockMajorBook]} selectBook={() => null} />
    );
    const titleElement = getByText(/JavaScript 1/i);
    expect(titleElement).toBeInTheDocument();
    const descriptionElement = getByText(new RegExp(description, "i"));
    expect(descriptionElement).toBeInTheDocument();
    const author1Element = getByText(/Author 1/i);
    expect(author1Element).toBeInTheDocument();
    const author2Element = getByText(/Author 2/i);
    expect(author2Element).toBeInTheDocument();
  });

  it("Book list should render with minor data", () => {
    const { getByText } = render(
      <BookList books={[mockMinorBook]} selectBook={() => null} />
    );
    const titleElement = getByText(/JavaScript 2/i);
    expect(titleElement).toBeInTheDocument();
    const descriptionElement = getByText(new RegExp(description, "i"));
    expect(descriptionElement).toBeInTheDocument();
  });

  it("Book list should fire callback on click add button", () => {
    var callback = jest.fn();
    render(<BookList books={[mockMinorBook]} selectBook={callback} />);

    fireEvent.click(screen.getByText(/Add to wishlist/i));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(mockMinorBook);
  });
});
