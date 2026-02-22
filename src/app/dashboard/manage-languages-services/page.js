'use client';

import React, { useState, useEffect } from 'react';
import { uploadImageToCloudinary } from '@/app/utils/galleryApi';

export default function ManageLanguagesServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('language');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    type: 'language',
    name: '',
    icon: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/language-services?type=${activeTab}`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadedUrl = await uploadImageToCloudinary(
        file,
        'azeez-portfolio/language-icons'
      );

      setFormData((prev) => ({
        ...prev,
        icon: uploadedUrl,
      }));

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData, type: activeTab };

      const url = '/api/language-services';
      const method = editingItem ? 'PUT' : 'POST';

      const body = editingItem
        ? { ...submitData, id: editingItem._id }
        : submitData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save item');

      alert(`Item ${editingItem ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch('/api/language-services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete item');

      alert('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setPreviewUrl(item.icon?.startsWith('http') ? item.icon : null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setPreviewUrl(null);
    setFormData({
      type: activeTab,
      name: '',
      icon: '',
      description: '',
      image: '',
      order: 0,
      isActive: true,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Manage Languages & Services
          </h1>
          <p className="text-slate-600">Add, edit, and manage your technical skills and services</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          {['language', 'service'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 shadow hover:shadow-md'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}s
            </button>
          ))}
        </div>

        {/* Add New Button */}
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="mb-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          + Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>

        {/* Items Grid */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                No {activeTab}s found. Create your first one!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Icon
                    </th>
                    {activeTab === 'service' && (
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Description
                      </th>
                    )}
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Order
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Active
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">
                        {item.icon?.startsWith('http') ? (
                          <img
                            src={item.icon}
                            alt={item.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-2xl">{item.icon}</span>
                        )}
                      </td>
                      {activeTab === 'service' && (
                        <td className="py-3 px-4 text-sm text-slate-600 truncate max-w-xs">
                          {item.description}
                        </td>
                      )}
                      <td className="py-3 px-4">{item.order}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingItem ? 'Edit' : 'Add New'}{' '}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., React"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Icon/Emoji or Upload Image *
                  </label>

                  {/* Icon Preview */}
                  {(previewUrl || formData.icon) && (
                    <div className="mb-3 p-3 bg-slate-100 rounded-lg flex items-center justify-center">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-16 h-16 object-contain"
                        />
                      ) : formData.icon?.startsWith('http') ? (
                        <img
                          src={formData.icon}
                          alt="Icon"
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <span className="text-5xl">{formData.icon}</span>
                      )}
                    </div>
                  )}

                  {/* File Upload Input */}
                  <div className="mb-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Upload Image to Cloudinary
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 cursor-pointer"
                    />
                    {uploading && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <span className="inline-block animate-spin">⏳</span>
                        Uploading...
                      </p>
                    )}
                  </div>

                  {/* Or Text Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Or Enter Emoji/URL
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      placeholder="e.g., ⚛️ or https://example.com/icon.png"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {activeTab === 'service' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of your service"
                        rows="3"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 cursor-pointer"
                  />
                  <label className="ml-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={uploading}
                    className="flex-1 bg-slate-300 text-slate-800 py-2 rounded-lg hover:bg-slate-400 transition-colors font-semibold disabled:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
