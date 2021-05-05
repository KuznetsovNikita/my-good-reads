import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { Book } from "./model";
import BookSearch from "./BookSearch";
import delay from "delay";

describe("BookSearch component", () => {
  const mockBook: Book = {
    id: "wvrGBwAAQBAJ1",
    volumeInfo: {
      title: "JavaScript title",
      description: "JavaScript description",
    },
  };

  const mockBook2: Book = {
    id: "wvrGBwAAQBAJ2",
    volumeInfo: {
      title: "TypeScript",
      description: "TypeScript description",
    },
  };

  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ items: [mockBook, mockBook2] }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Initial render should contain link with default value", async () => {
    const { getByText } = render(<BookSearch />);
    const linkElement = getByText(/"Javascript"/i);
    expect(linkElement).toBeInTheDocument();

    await act(() => Promise.resolve());
  });

  it("Click by default list should update input", async () => {
    const { getByText, getByTestId } = render(<BookSearch />);

    const linkElement = getByText(/"Javascript"/i);

    fireEvent.click(linkElement);
    await act(() => Promise.resolve());

    const inputElement = getByTestId("search-input") as HTMLInputElement;

    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe("Javascript");
  });

  it("Click by default list should start searching and display result", async () => {
    const { getByText, getAllByTestId } = render(<BookSearch />);

    const linkElement = getByText(/"Javascript"/i);
    fireEvent.click(linkElement);

    await act(() => Promise.resolve());

    expect(window.fetch).toHaveBeenCalledWith(
      "https://www.googleapis.com/books/v1/volumes?q=Javascript",
      expect.objectContaining({
        method: "GET",
      })
    );
    const books = await getAllByTestId("book-result");
    expect(books.length).toBe(2);
  });

  it("Quick changing input value should request data only one time", async () => {
    const { getByTestId, getAllByTestId } = render(<BookSearch />);

    const inputElement = getByTestId("search-input") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "Java" } });

    await act(() => delay(200));

    fireEvent.change(inputElement, { target: { value: "JavaScript" } });

    await waitFor(() => expect(getAllByTestId("book-result").length).toBe(2));

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith(
      "https://www.googleapis.com/books/v1/volumes?q=JavaScript",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("Lazy changing input should request data two times", async () => {
    const { getByTestId } = render(<BookSearch />);

    const inputElement = getByTestId("search-input") as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "Java" } });
    await act(() => delay(600));

    fireEvent.change(inputElement, { target: { value: "JavaScript" } });
    await act(() => delay(600));

    expect(window.fetch).toHaveBeenCalledTimes(2);
  });
});
