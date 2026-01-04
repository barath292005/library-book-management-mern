import API from "../services/api";

function BookList({ books, refresh }) {
  const increaseCopies = async (id) => {
    try {
      await API.put(`/copies/${id}`, { change: 1 });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to increase copies");
    }
  };

  const decreaseCopies = async (id) => {
    try {
      await API.put(`/copies/${id}`, { change: -1 });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to decrease copies");
    }
  };

  const deleteBook = async (id) => {
    try {
      await API.delete(`/${id}`);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete book");
    }
  };

return (
  <div>
    <h2>Books</h2>

    {books.length === 0 && <p>No books available</p>}

    <div className="book-grid">
      {books.map((book) => (
        <div key={book._id} className="book-card">
          <h3>{book.title}</h3>

          <p><b>Author:</b> {book.author}</p>
          <p><b>Category:</b> {book.category}</p>
          <p><b>Year:</b> {book.publishedYear}</p>
          <p><b>Copies:</b> {book.availableCopies}</p>

          <div className="book-actions">
            <button className="primary" onClick={() => increaseCopies(book._id)}>+</button>
            <button className="secondary" onClick={() => decreaseCopies(book._id)}>-</button>
            <button className="danger" onClick={() => deleteBook(book._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default BookList;
