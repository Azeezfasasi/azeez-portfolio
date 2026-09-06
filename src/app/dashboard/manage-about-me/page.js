'use client';

import { useEffect, useState } from 'react';
import { Loader, Plus, Save, Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const emptyContent = { eyebrow: '', title: '', paragraphs: [''], expertise: [{ label: '', items: [''] }], availability: '', email: '' };

export default function ManageAboutMe() {
  const [formData, setFormData] = useState(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token, logout } = useAuth();

  useEffect(() => {
    fetch('/api/about-me').then((response) => response.json()).then((data) => {
      if (data.success) setFormData({ ...emptyContent, ...data.data });
    }).catch(() => toast.error('Failed to load About Me content')).finally(() => setLoading(false));
  }, []);

  const updateField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));
  const updateParagraph = (index, value) => updateField('paragraphs', formData.paragraphs.map((item, itemIndex) => itemIndex === index ? value : item));
  const updateGroup = (groupIndex, field, value) => updateField('expertise', formData.expertise.map((group, index) => index === groupIndex ? { ...group, [field]: value } : group));
  const updateItem = (groupIndex, itemIndex, value) => updateGroup(groupIndex, 'items', formData.expertise[groupIndex].items.map((item, index) => index === itemIndex ? value : item));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/about-me', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (response.status === 401) {
        logout();
        throw new Error('Your session has expired. Please log in again.');
      }
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to save content');
      setFormData(data.data);
      toast.success('About Me section updated');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProtectedRoute allowedRoles={['admin', 'staff-member']}><div className="flex min-h-[50vh] items-center justify-center"><Loader className="h-8 w-8 animate-spin text-blue-600" /></div></ProtectedRoute>;

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff-member']}>
      <div className="mx-auto max-w-5xl py-4">
        <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Homepage content</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Manage About Me</h1><p className="mt-2 text-slate-600">Keep your personal story, skills, and availability current.</p></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="mb-5 text-lg font-semibold text-slate-900">Introduction</h2><div className="grid gap-5"><Field label="Eyebrow" value={formData.eyebrow} onChange={(event) => updateField('eyebrow', event.target.value)} /><Field label="Title" value={formData.title} onChange={(event) => updateField('title', event.target.value)} /><div><label className="mb-2 block text-sm font-medium text-slate-700">Paragraphs</label>{formData.paragraphs.map((paragraph, index) => <div key={index} className="mb-3 flex gap-2"><textarea required rows="4" value={paragraph} onChange={(event) => updateParagraph(index, event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />{formData.paragraphs.length > 1 && <button type="button" aria-label="Remove paragraph" onClick={() => updateField('paragraphs', formData.paragraphs.filter((_, itemIndex) => itemIndex !== index))} className="self-start rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>}</div>)}<button type="button" onClick={() => updateField('paragraphs', [...formData.paragraphs, ''])} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><Plus className="h-4 w-4" /> Add paragraph</button></div></div></section>
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Technical expertise</h2><button type="button" onClick={() => updateField('expertise', [...formData.expertise, { label: '', items: [''] }])} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><Plus className="h-4 w-4" /> Add group</button></div><div className="space-y-5">{formData.expertise.map((group, groupIndex) => <div key={groupIndex} className="rounded-lg border border-slate-200 p-4"><div className="flex gap-3"><Field label="Group name" value={group.label} onChange={(event) => updateGroup(groupIndex, 'label', event.target.value)} />{formData.expertise.length > 1 && <button type="button" aria-label="Remove expertise group" onClick={() => updateField('expertise', formData.expertise.filter((_, index) => index !== groupIndex))} className="self-end rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>}</div><label className="mb-2 mt-4 block text-sm font-medium text-slate-700">Skills</label>{group.items.map((item, itemIndex) => <div key={itemIndex} className="mb-2 flex gap-2"><input required value={item} onChange={(event) => updateItem(groupIndex, itemIndex, event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />{group.items.length > 1 && <button type="button" aria-label="Remove skill" onClick={() => updateGroup(groupIndex, 'items', group.items.filter((_, index) => index !== itemIndex))} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>}</div>)}<button type="button" onClick={() => updateGroup(groupIndex, 'items', [...group.items, ''])} className="mt-2 text-sm font-semibold text-blue-600">+ Add skill</button></div>)}</div></section>
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="mb-5 text-lg font-semibold text-slate-900">Availability and contact</h2><div className="grid gap-5"><Field label="Availability" value={formData.availability} onChange={(event) => updateField('availability', event.target.value)} textarea /><Field label="Contact email" type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} /></div></section>
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-5 w-5" />{saving ? 'Saving...' : 'Save About Me'}</button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

function Field({ label, textarea = false, ...props }) {
  const Component = textarea ? 'textarea' : 'input';
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><Component required className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" {...props} /></label>;
}
