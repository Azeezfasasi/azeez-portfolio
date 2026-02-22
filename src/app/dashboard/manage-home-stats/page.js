'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

const ICON_OPTIONS = ['CheckCircle2', 'Briefcase', 'Users', 'Target', 'Zap', 'Award'];
const GRADIENT_OPTIONS = [
  { label: 'Blue', value: 'from-blue-400 to-blue-500' },
  { label: 'Blue-Purple', value: 'from-blue-400 to-purple-500' },
  { label: 'Cyan-Blue', value: 'from-cyan-400 to-blue-500' },
  { label: 'Purple-Blue', value: 'from-purple-400 to-blue-500' },
  { label: 'Indigo-Blue', value: 'from-indigo-400 to-blue-500' },
];

export default function ManageHomeStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('from-blue-400 to-blue-500');

  const [formData, setFormData] = useState({
    value: '',
    description: '',
    label: '',
    icon: 'CheckCircle2',
    active: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/home-stats');
      const data = await response.json();

      if (data.success && data.data) {
        setStats(data.data.stats || []);
        setBackgroundColor(data.data.backgroundColor || 'from-blue-400 to-blue-500');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.value || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const url = editingId ? `/api/home-stats` : '/api/home-stats';
      const method = editingId ? 'PUT' : 'POST';

      const payload = editingId
        ? { statId: editingId, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingId ? 'Stat updated successfully' : 'Stat created successfully');
        setFormData({
          value: '',
          description: '',
          label: '',
          icon: 'CheckCircle2',
          active: true,
        });
        setEditingId(null);
        setIsFormOpen(false);
        await fetchStats();
      } else {
        toast.error(data.error || 'Failed to save stat');
      }
    } catch (error) {
      toast.error('Failed to save stat');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (stat) => {
    setFormData({
      value: stat.value,
      description: stat.description,
      label: stat.label || '',
      icon: stat.icon || 'CheckCircle2',
      active: stat.active ?? true,
    });
    setEditingId(stat._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (statId) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const response = await fetch(`/api/home-stats?id=${statId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Stat deleted successfully');
        await fetchStats();
      } else {
        toast.error(data.error || 'Failed to delete stat');
      }
    } catch (error) {
      toast.error('Failed to delete stat');
      console.error(error);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      value: '',
      description: '',
      label: '',
      icon: 'CheckCircle2',
      active: true,
    });
  };

  const moveStatUp = async (index) => {
    if (index === 0) return;
    const newOrder = stats.map((s, i) => s._id);
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];

    try {
      const response = await fetch('/api/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: true, statIds: newOrder }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchStats();
        toast.success('Stat moved up');
      }
    } catch (error) {
      toast.error('Failed to move stat');
    }
  };

  const moveStatDown = async (index) => {
    if (index === stats.length - 1) return;
    const newOrder = stats.map((s, i) => s._id);
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

    try {
      const response = await fetch('/api/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: true, statIds: newOrder }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchStats();
        toast.success('Stat moved down');
      }
    } catch (error) {
      toast.error('Failed to move stat');
    }
  };

  const updateBackgroundColor = async (newColor) => {
    try {
      const response = await fetch('/api/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'backgroundColor', backgroundColor: newColor }),
      });

      const data = await response.json();
      if (data.success) {
        setBackgroundColor(newColor);
        toast.success('Background color updated');
      }
    } catch (error) {
      toast.error('Failed to update background color');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Home Stats Manager</h1>
              <p className="text-gray-600 mt-2">Manage your statistics section</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus className="w-5 h-5" />
              Add New Stat
            </button>
          </div>

          {/* Background Color Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Background Gradient</h2>
            <div className="flex flex-wrap gap-3">
              {GRADIENT_OPTIONS.map((gradient) => (
                <button
                  key={gradient.value}
                  onClick={() => updateBackgroundColor(gradient.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    backgroundColor === gradient.value
                      ? 'ring-2 ring-blue-600'
                      : 'hover:shadow-md'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    color: 'white',
                  }}
                >
                  {gradient.label}
                </button>
              ))}
            </div>
            <div className={`mt-6 p-8 rounded-lg bg-gradient-to-r ${backgroundColor} text-white text-center`}>
              <p className="text-sm opacity-75">Preview of selected gradient</p>
            </div>
          </div>

          {/* Stats List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 mb-4">No stats created yet</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Create First Stat
                </button>
              </div>
            ) : (
              stats.map((stat, index) => (
                <div key={stat._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-blue-600">{stat.value}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>

                    <div className="space-y-2 text-xs text-gray-500">
                      <p>Icon: {stat.icon}</p>
                      <p>Status: {stat.active ? '✓ Active' : '✗ Inactive'}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(stat)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stat._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>

                      {/* Move buttons */}
                      {stats.length > 1 && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveStatUp(index)}
                            disabled={index === 0}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            <ArrowUp className="w-4 h-4" />
                            Up
                          </button>
                          <button
                            onClick={() => moveStatDown(index)}
                            disabled={index === stats.length - 1}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            <ArrowDown className="w-4 h-4" />
                            Down
                          </button>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 text-center py-1">
                        Position {index + 1} of {stats.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Stat' : 'Add New Stat'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                  {/* Value */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Value * (e.g., 40+, 5+, 30+)
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      placeholder="e.g., 40+"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description * (e.g., PROJECTS COMPLETED)
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., PROJECTS COMPLETED"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Label (Optional)
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      placeholder="e.g., Projects"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      {ICON_OPTIONS.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                      <Save className="w-4 h-4" />
                      {editingId ? 'Update Stat' : 'Create Stat'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
