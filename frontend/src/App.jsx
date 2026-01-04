import { useEffect, useState } from "react";
import API from "./services/api";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

function App() {
  const [books, setBooks] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");

  const fetchBooks = async () => {
    const res = await API.get("");
    setBooks(res.data);
  };

  const applyFilter = async () => {
    try {
      if (category) {
        const res = await API.get(`/category/${category}`);
        setBooks(res.data);
      } else if (year) {
        const res = await API.get(`/after/${year}`);
        setBooks(res.data);
      } else {
        fetchBooks();
      }
    } catch (err) {
      alert("Filter failed");
    }
  };

  const resetFilter = () => {
    setCategory("");
    setYear("");
    setShowFilter(false);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

return (
  <div className="container">
    <div className="header">
      <h1>📚 Library Book Management</h1>
    </div>

    <div style={{ textAlign: "right", marginBottom: "10px" }}>
      <button
        className="primary"
        onClick={() => setShowFilter(!showFilter)}
      >
        Filter ⏷
      </button>
    </div>

    {showFilter && (
      <div className="filter-panel">
        <h3>Filter Options</h3>

        <input
          placeholder="Category (e.g. Programming)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Published after year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <div style={{ marginTop: "10px" }}>
          <button className="primary" onClick={applyFilter}>
            Apply
          </button>
          <button
            className="secondary"
            onClick={resetFilter}
            style={{ marginLeft: "8px" }}
          >
            Reset
          </button>
        </div>
      </div>
    )}

    <BookForm refresh={fetchBooks} />
    <BookList books={books} refresh={fetchBooks} />
  </div>
);
}
export default App;
