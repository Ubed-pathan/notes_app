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

  useEffect(() => { load(); }, []);

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
      setNotes(notes.filter((n) => n._id !== id));
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to delete');
    }
  };

  const user = localStorage.getItem('user');
  const name = user ? JSON.parse(user).name || JSON.parse(user).email : '';

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Welcome{ name ? `, ${name}` : ''}</div>
          <div className="text-sm text-gray-500">Create and manage your notes</div>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="text-sm text-gray-600">Logout</button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={createNote} className="bg-black text-white px-4 py-2 rounded">Add Note</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {notes.map((n) => (
          <div key={n._id} className="border rounded p-3">
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">{n.content}</div>
            <button onClick={() => deleteNote(n._id)} className="text-xs text-red-600 mt-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
