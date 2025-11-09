/**
 * ConversationsTab - Anotações e conversas sobre o cliente
 */

import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { MessageSquare, Plus, Trash2, Loader2, User } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useAuthStore } from '../../../store/authStore';
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { formatDateTime } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const ConversationsTab = ({ client }) => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadNotes();
  }, [client]);

  const loadNotes = async () => {
    if (!client?.firestoreId) return;
    
    try {
      setIsLoading(true);
      const notesRef = collection(db, 'clients', client.firestoreId, 'notes');
      const q = query(notesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    
    try {
      await addDoc(collection(db, 'clients', client.firestoreId, 'notes'), {
        text: newNote,
        userId: user?.uid,
        userName: user?.displayName || user?.email,
        createdAt: new Date().toISOString()
      });
      
      setNewNote('');
      toast.success('Anotação adicionada!');
      loadNotes();
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error);
      toast.error('Erro ao adicionar anotação');
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Deseja excluir esta anotação?')) return;
    
    try {
      await deleteDoc(doc(db, 'clients', client.firestoreId, 'notes', noteId));
      toast.success('Anotação excluída!');
      loadNotes();
    } catch (error) {
      console.error('Erro ao excluir anotação:', error);
      toast.error('Erro ao excluir anotação');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={`w-8 h-8 animate-spin ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className={`text-lg font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Anotações ({notes.length})
      </h3>

      {/* Add Note */}
      <div className="space-y-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Adicionar anotação..."
          rows={3}
          className={`
            w-full px-4 py-3 rounded-xl border resize-none
            ${isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
            }
          `}
        />
        <button
          onClick={handleAdd}
          disabled={!newNote.trim()}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <Plus className="w-4 h-4" />
          Adicionar Anotação
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nenhuma anotação ainda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`
                p-4 rounded-xl border
                ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {note.userName}
                  </span>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {formatDateTime(note.createdAt)}
                  </span>
                </div>
                
                <button
                  onClick={() => handleDelete(note.id)}
                  className={`
                    p-1 rounded-lg
                    ${isDarkMode 
                      ? 'hover:bg-red-900/20 text-red-400' 
                      : 'hover:bg-red-50 text-red-600'
                    }
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </Motion.div>
  );
};

export default ConversationsTab;

