import React from "react";
import { render } from "@testing-library/react";
import { Book } from "../bookSearch/model";
import { Wishlist } from "./Wishlist";

describe("Wishlist component", () => {
  const mockBook: Book = {
    id: "wvrGBwAAQBAJ1",
    volumeInfo: {
      title: "JavaScript",
      description: "JavaScript description",
    },
  };
  const mockBook2: Book = {
    id: "wvrGBwAAQBAJ2",
    volumeInfo: {
      title: "JavaScript",
      description: "JavaScript description",
    },
  };

  it("Render empty Wishlist", () => {
    const { getByText } = render(<Wishlist myBooks={[]} />);
    const titleElement = getByText(/My wishlist \(0\)/im);
    expect(titleElement).toBeInTheDocument();
  });

  it("Wishlist should render one book", () => {
    const { getByText } = render(<Wishlist myBooks={[mockBook]} />);
    const titleElement = getByText(/My wishlist \(1\)/im);
    expect(titleElement).toBeInTheDocument();

    const bookTitleElement = getByText(/JavaScript/i);
    expect(bookTitleElement).toBeInTheDocument();
  });

  it("Wishlist should render two books", () => {
    const { getByText, getAllByText } = render(
      <Wishlist myBooks={[mockBook, mockBook2]} />
    );
    const titleElement = getByText(/My wishlist \(2\)/im);
    expect(titleElement).toBeInTheDocument();

    const bookTitleElements = getAllByText(/JavaScript/i);
    expect(bookTitleElements.length).toBe(2);
  });
});
