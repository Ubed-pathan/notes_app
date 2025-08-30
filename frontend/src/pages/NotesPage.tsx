import { useEffect, useState } from 'react';
import api from '../lib/api';
import TrashIcon from '../components/TrashIcon';
import Modal from '../components/Modal';

interface Note { _id: string; title: string; content: string; createdAt: string }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openNote, setOpenNote] = useState<Note | null>(null);

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

  // Close modal with Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenNote(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when modal open to avoid background peeking
  useEffect(() => {
    if (openNote) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [openNote]);

  const user = localStorage.getItem('user');
  const parsed = user ? JSON.parse(user) : null;
  const name = parsed?.name || parsed?.email || '';
  const emailMasked = parsed?.email ? parsed.email.replace(/(.{2}).+(@.+)/, '$1xxxxxx$2') : '';

  return (
  <div className="min-h-screen p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Inline SVG provided by user for the dashboard logo */}
          <svg width="47" height="32" viewBox="0 0 47 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dashboard Logo">
            <path d="M27.6424 0.843087L24.4853 0L21.8248 9.89565L19.4228 0.961791L16.2656 1.80488L18.8608 11.4573L12.3967 5.01518L10.0855 7.31854L17.1758 14.3848L8.34596 12.0269L7.5 15.1733L17.1477 17.7496C17.0372 17.2748 16.9788 16.7801 16.9788 16.2717C16.9788 12.6737 19.9055 9.75685 23.5159 9.75685C27.1262 9.75685 30.0529 12.6737 30.0529 16.2717C30.0529 16.7768 29.9952 17.2685 29.8861 17.7405L38.6541 20.0818L39.5 16.9354L29.814 14.3489L38.6444 11.9908L37.7984 8.84437L28.1128 11.4308L34.5768 4.98873L32.2656 2.68538L25.2737 9.65357L27.6424 0.843087Z" fill="#367AFF"/>
            <path d="M29.8776 17.7771C29.6069 18.9176 29.0354 19.9421 28.2513 20.763L34.6033 27.0935L36.9145 24.7901L29.8776 17.7771Z" fill="#367AFF"/>
            <path d="M28.1872 20.8292C27.3936 21.637 26.3907 22.2398 25.2661 22.5504L27.5775 31.1472L30.7346 30.3041L28.1872 20.8292Z" fill="#367AFF"/>
            <path d="M25.1482 22.5818C24.6264 22.7155 24.0795 22.7866 23.5159 22.7866C22.9121 22.7866 22.3274 22.705 21.7723 22.5522L19.4589 31.1569L22.616 31.9999L25.1482 22.5818Z" fill="#367AFF"/>
            <path d="M21.6607 22.5206C20.5532 22.1945 19.5682 21.584 18.7908 20.7739L12.4232 27.1199L14.7344 29.4233L21.6607 22.5206Z" fill="#367AFF"/>
            <path d="M18.7377 20.7178C17.9737 19.9026 17.4172 18.8917 17.1523 17.7688L8.35571 20.1178L9.20167 23.2642L18.7377 20.7178Z" fill="#367AFF"/>
          </svg>
          <div className="text-2xl font-semibold">Dashboard</div>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = '/signin'; }} className="text-blue-600 underline">Sign Out</button>
      </div>

  <div className="rounded-2xl border p-5 shadow-sm">
        <div className="text-xl font-semibold">Welcome{ name ? `, ${name} !` : '!'}</div>
        {parsed?.email && <div className="text-sm text-gray-600 mt-1">Email: {emailMasked}</div>}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
  <button onClick={createNote} className="bg-blue-600 text-white px-4 py-3 rounded-2xl">Create Note</button>
      </div>

  <h2 className="text-lg font-semibold mt-6">Notes <span className="text-sm font-normal text-gray-500">(click a note for clear view)</span></h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {notes.map((n) => (
          <div
            key={n._id}
            onClick={() => setOpenNote(n)}
            className="group border rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md cursor-pointer transition"
            title="View details"
          >
            <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{n.title}</div>
            <button
              onClick={(e) => { e.stopPropagation(); deleteNote(n._id); }}
              className="text-red-600 hover:text-red-700"
              title="Delete"
              aria-label="Delete note"
            >
              <TrashIcon width={20} height={20} />
            </button>
          </div>
        ))}
      </div>

      <Modal open={!!openNote} onClose={() => setOpenNote(null)} title={openNote?.title || ''}>
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{openNote?.content || 'No description'}</div>
      </Modal>
    </div>
  );
}
