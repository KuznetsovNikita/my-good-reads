import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/BookSearch";

const App = () => {
  return (
    <div>
      <header className="header">
        <div className="header--content">
          <h1>My Good Reads</h1>
        </div>
      </header>
      <main>
        <BookSearch />
      </main>
    </div>
  );
};

export default App;
