"use client"
import React, { useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Image compression utility
const compressImage = async (file, maxSizeMB = 0.5, maxWidthOrHeight = 1920) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height *= maxWidthOrHeight / width
            width = maxWidthOrHeight
          }
        } else {
          if (height > maxWidthOrHeight) {
            width *= maxWidthOrHeight / height
            height = maxWidthOrHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Compress by reducing quality
        canvas.toBlob(
          (blob) => {
            if (blob.size > maxSizeMB * 1024 * 1024) {
              // If still too large, reduce quality further
              canvas.toBlob(
                (smallerBlob) => {
                  const compressedFile = new File([smallerBlob], file.name, { type: 'image/jpeg' })
                  resolve(compressedFile)
                },
                'image/jpeg',
                0.6
              )
            } else {
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })
              resolve(compressedFile)
            }
          },
          'image/jpeg',
          0.8
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = event.target.result
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function AddProjectsPage() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    category: '',
    location: '',
    budget: '',
    startDate: '',
    expectedEndDate: '',
    projectStatus: 'planning',
    clientName: '',
    clientWebsiteLink: '',
    teamLead: '',
    teamMembers: '', // comma separated string, will convert to array
    featuredImage: null,
    featuredImagePreview: '',
    galleryImages: [],
    galleryImagePreviews: [],
    technologies: '', // comma separated string, will convert to array
    materialsUsed: '', // comma separated string, will convert to array
    completion: 0,
    projectHighlights: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleImageChange(e) {
    const { name, files } = e.target
    if (name === 'featuredImage') {
      const file = files?.[0]
      if (file) {
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > 5) {
          setMessage({ type: 'error', text: `Featured image is too large (${fileSizeMB.toFixed(1)}MB). Please use an image under 5MB.` })
          return
        }

        try {
          // Compress image
          const compressedFile = await compressImage(file, 0.5, 1920)
          setFormData(prev => ({ ...prev, featuredImage: compressedFile }))
          const reader = new FileReader()
          reader.onload = (event) => {
            setFormData(prev => ({
              ...prev,
              featuredImagePreview: event.target?.result || ''
            }))
          }
          reader.readAsDataURL(compressedFile)
        } catch (err) {
          setMessage({ type: 'error', text: `Error compressing image: ${err.message}` })
        }
      }
    } else if (name === 'galleryImages') {
      const fileList = Array.from(files || [])
      
      try {
        // Check total size
        const totalSize = fileList.reduce((sum, f) => sum + f.size, 0)
        const totalSizeMB = totalSize / (1024 * 1024)
        if (totalSizeMB > 10) {
          setMessage({ type: 'error', text: `Gallery images are too large (${totalSizeMB.toFixed(1)}MB). Please use images under 10MB total.` })
          return
        }

        // Compress all gallery images in parallel
        const compressedFiles = await Promise.all(
          fileList.map(file => compressImage(file, 0.4, 1200))
        )
        setFormData(prev => ({ ...prev, galleryImages: compressedFiles }))
        
        // Generate previews
        const previews = []
        let loadedCount = 0
        
        compressedFiles.forEach((file) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            previews.push(event.target?.result || '')
            loadedCount++
            if (loadedCount === compressedFiles.length) {
              setFormData(prev => ({
                ...prev,
                galleryImagePreviews: previews
              }))
            }
          }
          reader.readAsDataURL(file)
        })
      } catch (err) {
        setMessage({ type: 'error', text: `Error compressing images: ${err.message}` })
      }
    }
  }

  function removeGalleryImage(index) {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      galleryImagePreviews: prev.galleryImagePreviews.filter((_, i) => i !== index)
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Prepare FormData for file uploads
      const data = new FormData()
      // Prepare fields for backend (convert comma separated to arrays)
      const fields = {
        ...formData,
        teamMembers: formData.teamMembers
          ? formData.teamMembers.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        technologies: formData.technologies
          ? formData.technologies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        materialsUsed: formData.materialsUsed
          ? formData.materialsUsed.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        budget: formData.budget ? Number(formData.budget) : 0,
        completion: formData.completion ? Number(formData.completion) : 0,
      };
      // Remove file fields from fields object
      delete fields.featuredImage;
      delete fields.galleryImages;
      // Send all fields as JSON string
      data.append('fields', JSON.stringify(fields));
      // Attach images
      if (formData.featuredImage) {
        data.append('featuredImage', formData.featuredImage);
      }
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        formData.galleryImages.forEach((file) => data.append('galleryImages', file));
      }

      const response = await fetch('/api/project', { 
        method: 'POST', 
        body: data
      })
      
      if (!response.ok) {
        const result = await response.json()
        if (response.status === 413) {
          setMessage({ type: 'error', text: 'Request too large. Images may be too large or too many. Try uploading fewer or smaller images.' })
        } else {
          setMessage({ type: 'error', text: result.message || 'Failed to add project' })
        }
      } else {
        const result = await response.json()
        setMessage({ type: 'success', text: 'Project added successfully!' })
        setFormData({
          projectName: '', projectDescription: '', category: '', location: '', budget: '', startDate: '', expectedEndDate: '',
          projectStatus: 'planning', clientName: '', clientWebsiteLink: '', teamLead: '', teamMembers: '', featuredImage: null,
          featuredImagePreview: '', galleryImages: [], galleryImagePreviews: [], technologies: '', materialsUsed: '', completion: 0, projectHighlights: ''
        })
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Error: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
    <div className="min-h-screen bg-gray-50 py-6 px-0 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Project</h1>
          <p className="mt-2 text-gray-600">Create a new construction project and manage its details.</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm space-y-6 p-6 md:p-8">
          {/* Project Basics */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">Project Basics</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">Project Name <span className='text-red-500 font-bold'>*</span></label>
                <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g., Commercial Complex" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category <span className='text-red-500 font-bold'>*</span></label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option value="">Select category</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Backend / API Projects">Backend / API Projects</option>
                  <option value="Full Stack Applications">Full Stack Applications</option>
                  <option value="AI Integration Projects">AI Integration Projects</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="API Integration Projects">API Integration Projects</option>
                  <option value="Authentication & Security Projects">Authentication & Security Projects</option>
                  <option value="Data-Driven Applications">Data-Driven Applications</option>
                </select>
              </div>
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Client name" />
              </div>
              <div>
                <label htmlFor="clientWebsiteLink" className="block text-sm font-medium text-gray-700 mb-2">Client Website</label>
                <input type="url" id="clientWebsiteLink" name="clientWebsiteLink" value={formData.clientWebsiteLink} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g., https://example.com" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="e.g., Lagos, Nigeria" />
              </div>
            </div>
          </fieldset>

          {/* Description */}
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
            <textarea id="projectDescription" name="projectDescription" value={formData.projectDescription} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" placeholder="Describe the project in detail..." />
          </div>

          {/* Timeline & Budget */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">Timeline & Budget</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label htmlFor="expectedEndDate" className="block text-sm font-medium text-gray-700 mb-2">Expected End Date</label>
                <input type="date" id="expectedEndDate" name="expectedEndDate" value={formData.expectedEndDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Budget (₦)</label>
                <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleInputChange} step="1000" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="0" />
              </div>
              <div>
                <label htmlFor="completion" className="block text-sm font-medium text-gray-700 mb-2">Completion % (0-100)</label>
                <input type="number" id="completion" name="completion" value={formData.completion} onChange={handleInputChange} min="0" max="100" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
            </div>
          </fieldset>

          {/* Status */}
          <div>
            <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 mb-2">Project Status <span className='text-red-500 font-bold'>*</span></label>
            <select id="projectStatus" name="projectStatus" value={formData.projectStatus} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>

          {/* Team */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">Team</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="teamLead" className="block text-sm font-medium text-gray-700 mb-2">Team Lead</label>
                <input type="text" id="teamLead" name="teamLead" value={formData.teamLead} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Lead name" />
              </div>
              <div>
                <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                <input type="text" id="teamMembers" name="teamMembers" value={formData.teamMembers} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="Separate by comma" />
              </div>
            </div>
          </fieldset>

          {/* Technologies & Materials */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-2">Technologies & Methods</label>
                <textarea id="technologies" name="technologies" value={formData.technologies} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" placeholder="e.g., BIM, sustainable materials, etc." />
              </div>
              <div>
                <label htmlFor="materialsUsed" className="block text-sm font-medium text-gray-700 mb-2">Infrastructure & Services</label>
                <textarea id="materialsUsed" name="materialsUsed" value={formData.materialsUsed} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" placeholder="e.g., concrete, steel, etc." />
              </div>
            </div>
          </fieldset>

          {/* Highlights */}
          <div>
            <label htmlFor="projectHighlights" className="block text-sm font-medium text-gray-700 mb-2">Project Highlights</label>
            <textarea id="projectHighlights" name="projectHighlights" value={formData.projectHighlights} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" placeholder="Key achievements, awards, special features..." />
          </div>

          {/* Images */}
          <fieldset>
            <legend className="text-lg font-semibold text-gray-900 mb-4">Media</legend>
            <div className="space-y-4">
              <div>
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                {formData.featuredImagePreview && (
                  <div className="mb-4 relative max-w-xs">
                    <img src={formData.featuredImagePreview} alt="Featured image preview" className="max-h-48 rounded-lg border border-gray-300" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, featuredImage: null, featuredImagePreview: '' }))}
                      className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input type="file" id="featuredImage" name="featuredImage" onChange={handleImageChange} accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                {formData.featuredImage && !formData.featuredImagePreview && <p className="text-sm text-green-600 mt-2">✓ {formData.featuredImage.name}</p>}
              </div>
              <div>
                <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (multiple)</label>
                <input type="file" id="galleryImages" name="galleryImages" onChange={handleImageChange} accept="image/*" multiple className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                {formData.galleryImagePreviews && formData.galleryImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Gallery Images ({formData.galleryImagePreviews.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.galleryImagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img src={preview} alt={`Gallery image ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-gray-300" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg"
                          >
                            <span className="text-white text-sm font-medium">Remove</span>
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{formData.galleryImages[idx]?.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-[14px] md:text-[16px] text-white font-medium py-2 px-0 md:px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {loading ? 'Adding...' : 'Add Project'}
            </button>
            <button type="reset" className="flex-1 border border-gray-300 text-gray-700 text-[14px] md:text-[16px] font-medium py-2 px-0 md:px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
    </ProtectedRoute>
  )
}
