"use client"; // Enable client-side rendering
import { useState, useEffect } from "react";
import { FiEdit, FiTrash } from "react-icons/fi"; // Importing icons
import { getCategory, postCategory } from "@/app/apis/add-category/api";

interface Category {
  id: number;
  category_name: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [newCategory, setNewCategory] = useState({ category_name: "" });

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await getCategory(currentPage, pageSize);
      if (response) {
        setCategories(response || []);
        setFilteredCategories(response|| []);
        setTotalCategories(response.totalCount || 0); // Adjust based on API response
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter((category) =>
        category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const handleAddCategory = async () => {
    if (!newCategory.category_name.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
    try {
      await postCategory(newCategory);
      setNewCategory({ category_name: "" });
      fetchCategories();
    } catch (error: any) {
      console.error("Error adding category:", error.message);
    }
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory) {
      try {
        const response = await fetch(
          `/category/update/${selectedCategory.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category_name: selectedCategory.category_name,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update category.");
        }
        setSelectedCategory(null);
        fetchCategories();
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/category/remove/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category.");
      }
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Categories"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mr-2 w-full md:w-1/3"
        />
      </div>

      {/* Add New Category */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.category_name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, category_name: e.target.value })
          }
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Categories Table */}
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
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="border px-4 py-2">{category.id}</td>
                <td className="border px-4 py-2">
                  {selectedCategory?.id === category.id ? (
                    <input
                      type="text"
                      value={selectedCategory.category_name}
                      onChange={(e) =>
                        setSelectedCategory({
                          ...selectedCategory,
                          category_name: e.target.value,
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    category.category_name
                  )}
                </td>
                <td className="border px-4 py-2 flex items-center space-x-2">
                  {selectedCategory?.id === category.id ? (
                    <button
                      onClick={handleUpdateCategory}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <FiEdit
                      onClick={() => setSelectedCategory(category)}
                      className="text-yellow-500 cursor-pointer"
                    />
                  )}
                  <FiTrash
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center space-x-4 mt-4">
          <div className="flex space-x-2">
            <label className="font-medium">Page Size:</label>
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-3 py-2 bg-gray-300 rounded-lg ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="font-medium">Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  filteredCategories.length < pageSize ? prev : prev + 1
                )
              }
              className={`px-3 py-2 bg-gray-300 rounded-lg ${
                filteredCategories.length < pageSize
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={filteredCategories.length < pageSize}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
