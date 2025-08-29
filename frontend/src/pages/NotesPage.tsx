import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Note { _id: string; title: string; content: string; createdAt: string }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const res = await api.get('/notes');
      setNotes(res.data.notes);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to load');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    load();
  }, []);

  const createNote = async () => {
    setError(null);
    try {
      const res = await api.post('/notes', { title, content });
      setNotes([res.data.note, ...notes]);
      setTitle('');
      setContent('');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to create');
    }
  };

  const deleteNote = async (id: string) => {
    setError(null);
    try {
      await api.delete(`/notes/${id}`);
  setNotes(notes.filter((n: Note) => n._id !== id));
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to delete');
    }
  };

  const user = localStorage.getItem('user');
  const parsed = user ? JSON.parse(user) : null;
  const name = parsed?.name || parsed?.email || '';
  const emailMasked = parsed?.email ? parsed.email.replace(/(.{2}).+(@.+)/, '$1xxxxxx$2') : '';

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"/>
          <div className="text-2xl font-semibold">Dashboard</div>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = '/signin'; }} className="text-blue-600 underline">Sign Out</button>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <div className="text-xl font-semibold">Welcome{ name ? `, ${name} !` : '!'}</div>
        {parsed?.email && <div className="text-sm text-gray-600 mt-1">Email: {emailMasked}</div>}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={createNote} className="bg-blue-600 text-white px-4 py-3 rounded-xl">Create Note</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {notes.map((n) => (
          <div key={n._id} className="border rounded-2xl p-3 flex items-start justify-between shadow-sm">
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap flex-1 ml-3">{n.content}</div>
            <button onClick={() => deleteNote(n._id)} className="text-red-600" title="delete">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
