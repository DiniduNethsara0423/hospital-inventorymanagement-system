"use client"; // Enable client-side rendering
import { useState, useEffect } from "react";
import axios from "axios";
import { postCategory } from "@/app/apis/add-category/api";

interface Category {
  id: number;
  name: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [totalCategories, setTotalCategories] = useState<number>(0);

  // Fetch categories from API
  const fetchCategories = async (page: number, pageSize: number, search: string) => {
    try {
      const response = await axios.get(
        `/category/findAll?page=${page}&pageSize=${pageSize}&search=${search}`
      );
      setCategories(response.data.categories || []);
      setTotalCategories(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories(page, pageSize, searchQuery);
  }, [page, pageSize, searchQuery]);

  // Add a new category
  const handleAddCategory = async () => {
    try {
      await postCategory(newCategory); // Use the API function
      setNewCategory({ name: "" }); // Reset the input field
      fetchCategories(page, pageSize, searchQuery); // Refresh the category list
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  // Update a category
  const handleUpdateCategory = async () => {
    if (selectedCategory) {
      try {
        await axios.patch(`/category/update/${selectedCategory.id}`, {
          name: selectedCategory.name,
        });
        setSelectedCategory(null);
        fetchCategories(page, pageSize, searchQuery);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id: number) => {
    try {
      await axios.delete(`/category/remove/${id}`);
      fetchCategories(page, pageSize, searchQuery);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Categories"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 mr-2 w-full md:w-1/3"
        />
      </div>

      {/* Add Category */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add New Category</h2>
        <input
          type="text"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border px-4 py-2">{category.id}</td>
                <td className="border px-4 py-2">
                  {selectedCategory?.id === category.id ? (
                    <input
                      type="text"
                      value={selectedCategory.name}
                      onChange={(e) =>
                        setSelectedCategory({ ...selectedCategory, name: e.target.value })
                      }
                      className="border p-1"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {selectedCategory?.id === category.id ? (
                    <button
                      onClick={handleUpdateCategory}
                      className="bg-green-500 text-white p-1 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className="bg-yellow-500 text-white p-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-300 p-2 rounded"
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(totalCategories / pageSize)}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={categories.length < pageSize}
            className="bg-gray-300 p-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
