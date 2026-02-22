'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Loader, Save } from 'lucide-react';
import Image from 'next/image';
import { uploadImageToCloudinary } from '@/app/utils/galleryApi';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

const SOCIAL_ICONS = ['Linkedin', 'Github', 'Mail', 'Instagram', 'MessageCircle'];
const SOCIAL_COLORS = [
  'hover:text-blue-700',
  'hover:text-gray-800',
  'hover:text-red-500',
  'hover:text-pink-500',
  'hover:text-green-500',
];

export default function HeroContentManager() {
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [newSocialForm, setNewSocialForm] = useState({ name: '', icon: 'Linkedin', href: '', color: 'hover:text-blue-700' });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    profileImage: '',
    resumeUrl: '#',
    social: [],
  });

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await fetch('/api/hero?type=content');
      const data = await response.json();

      if (data.success && data.content) {
        setHeroContent(data.content);
        setFormData(data.content);
      }
    } catch (error) {
      console.error('Failed to fetch hero content:', error);
      toast.error('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      console.log('Uploading file:', file.name, file.size);
      const result = await uploadImageToCloudinary(file, 'azeez-portfolio/hero-profile');
      
      console.log('Upload result:', result);
      // Handle different response formats
      const imageUrl = result.url || result.secure_url || result;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from upload');
      }

      setFormData(prev => ({
        ...prev,
        profileImage: imageUrl,
      }));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: '' }));
  };

  const handleAddSocialLink = () => {
    if (!newSocialForm.name || !newSocialForm.href) {
      toast.error('Please fill in social link name and URL');
      return;
    }

    setFormData(prev => ({
      ...prev,
      social: [...(prev.social || []), { ...newSocialForm }],
    }));

    setNewSocialForm({ name: '', icon: 'Linkedin', href: '', color: 'hover:text-blue-700' });
    toast.success('Social link added');
  };

  const handleRemoveSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      social: prev.social.filter((_, i) => i !== index),
    }));
    toast.success('Social link removed');
  };

  const handleSocialChange = (index, field, value) => {
    const updatedSocial = [...formData.social];
    updatedSocial[index] = { ...updatedSocial[index], [field]: value };
    setFormData(prev => ({ ...prev, social: updatedSocial }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'content',
          data: formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hero content updated successfully');
        setIsEditing(false);
        await fetchHeroContent();
      } else {
        toast.error(data.error || 'Failed to update content');
      }
    } catch (error) {
      toast.error('Failed to update content');
      console.error(error);
    } finally {
      setIsSaving(false);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Hero Profile Manager</h1>
              <p className="text-gray-600 mt-2">Manage your profile hero section content</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <Edit2 className="w-5 h-5" />
                Edit Content
              </button>
            )}
          </div>

          {/* Current Content Preview */}
          {heroContent && !isEditing && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Profile Image */}
                <div className="md:w-1/3 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                  {heroContent.profileImage ? (
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-600">
                      <Image
                        src={heroContent.profileImage}
                        alt={heroContent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="md:w-2/3 p-8">
                  <h2 className="text-4xl font-bold text-blue-600 mb-2">{heroContent.name}</h2>
                  <h3 className="text-xl text-gray-600 mb-6 font-medium">{heroContent.title}</h3>
                  <p className="text-gray-700 mb-8 leading-relaxed">{heroContent.description}</p>

                  {/* Social Links */}
                  {heroContent.social && heroContent.social.length > 0 && (
                    <div className="flex gap-6">
                      {heroContent.social.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          title={link.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-gray-700 transition-all duration-200 hover:scale-125 ${link.color}`}
                        >
                          <span className="text-sm">{link.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Resume Button */}
                  <div className="mt-8">
                    {heroContent.resumeUrl && heroContent.resumeUrl !== '#' ? (
                      <a
                        href={heroContent.resumeUrl}
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors"
                      >
                        Download Resume
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">No resume URL set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Hero Content</h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(heroContent);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., AZEEZ FASASI"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., a Frontend Web Developer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write your professional description..."
                    rows="5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Resume URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="text"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    placeholder="e.g., /resume.pdf or https://..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Image * {imageUploading && <span className="text-blue-600 animate-pulse">(Uploading...)</span>}
                  </label>

                  {formData.profileImage ? (
                    <div className="mb-4">
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-green-400">
                        <Image
                          src={formData.profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-green-600 font-medium">✓ Image uploaded successfully</p>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={imageUploading}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">Click to upload profile image</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                        className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Social Media Links</h3>

                    {/* Existing Social Links */}
                    <div className="space-y-3 mb-6">
                      {formData.social && formData.social.map((link, idx) => (
                        <div key={idx} className="flex gap-3 items-end">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={link.name}
                              onChange={(e) => handleSocialChange(idx, 'name', e.target.value)}
                              placeholder="Name (e.g., LinkedIn)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                            />
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => handleSocialChange(idx, 'href', e.target.value)}
                              placeholder="URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(idx)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add New Social Link */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">Add Social Link</h4>
                      <input
                        type="text"
                        value={newSocialForm.name}
                        onChange={(e) => setNewSocialForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Name (e.g., GitHub)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={newSocialForm.href}
                        onChange={(e) => setNewSocialForm(prev => ({ ...prev, href: e.target.value }))}
                        placeholder="URL (e.g., https://github.com/username)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <select
                        value={newSocialForm.icon}
                        onChange={(e) => setNewSocialForm(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {SOCIAL_ICONS.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Social Link
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(heroContent);
                    }}
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
