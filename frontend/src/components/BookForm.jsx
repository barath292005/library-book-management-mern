import { useState } from "react";
import API from "../services/api";

function BookForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    publishedYear: "",
    availableCopies: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "publishedYear" || name === "availableCopies"
          ? value === "" ? "" : Number(value)
          : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("", {
        title: form.title,
        author: form.author,
        category: form.category,
        publishedYear: Number(form.publishedYear),
        availableCopies: Number(form.availableCopies)
      });

      alert("Book added successfully ✅");
      refresh();

      setForm({
        title: "",
        author: "",
        category: "",
        publishedYear: "",
        availableCopies: ""
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding book");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Add Book</h2>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="publishedYear"
        placeholder="Published Year"
        value={form.publishedYear}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="availableCopies"
        placeholder="Available Copies"
        value={form.availableCopies}
        onChange={handleChange}
        required
      />

      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
