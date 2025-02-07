"use client";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { getCategory, postCategory, updateCategory, deleteCategory } from "@/app/apis/add-category/api";
import { Search, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"; // Lucide React icons
import { useRouter } from "next/navigation";
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [newCategory, setNewCategory] = useState({ category_name: "" });

  const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
      }
    }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await getCategory(currentPage, pageSize);
      if (response) {
        setCategories(response.data || []);
        setFilteredCategories(response.data || []);
        setTotalCategories(response.total || 0);
      } else {
        console.error(response.message);
      }
    } catch (error:any) {
      alert(error.message);
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
      alert(error.message);
    }
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory) {
      try {
        await updateCategory({
          id: selectedCategory.id,
          category_name: selectedCategory.category_name,
        });
        setSelectedCategory(null);
        fetchCategories();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      alert("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      alert(error.message);
    }
  };


  return (
    <div className="mt-12 px-5">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Category Management
      </h1>

      {/* Search and Add New Category */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="flex items-center w-full md:w-2/3 bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>

        {/* Add New Category */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.category_name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, category_name: e.target.value })
            }
            className="w-full md:w-auto border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-gray-800 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Page Size */}
      <div className="flex justify-end items-center mb-4">
        <label className="text-gray-600 mr-2 font-medium">Page Size:</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden bg-white rounded-lg">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-blue-200 text-left"> 
            <tr className="">
              <th className="px-4 py-3 rounded-tl-lg text-gray-800">ID</th>
              <th className="border px-4 py-3 text-gray-800">Name</th>
              <th className="px-4 py-3 rounded-tr-lg text-gray-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr
                key={category.id}
                className=" hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{category.id}</td>
                <td className="px-6 py-4">
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
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    category.category_name
                  )}
                </td>
                <td className="px-6 py-4 flex justify-center space-x-3">
                  {selectedCategory?.id === category.id ? (
                    <button
                      onClick={handleUpdateCategory}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                  ) : (
                    <Edit
                      onClick={() => setSelectedCategory(category)}
                      className="w-5 h-5 text-yellow-500 cursor-pointer hover:scale-110 transition"
                    />
                  )}
                  <Trash2
                    onClick={() => handleDeleteCategory(category.id)}
                    className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300"
            } transition`}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-gray-700 font-medium">Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              filteredCategories.length < pageSize ? prev : prev + 1
            )
          }
          className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${filteredCategories.length < pageSize
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300"
            } transition`}
          disabled={filteredCategories.length < pageSize}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default CategoriesPage;
