import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Car, 
  Clock, 
  DollarSign,
  Wrench,
  Package,
  FileText,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCheckinStore } from '../store/checkinStore';
import { useAuthStore } from '../store/authStore';

const CheckInDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCheckin, getCheckinById, updateCheckin, isLoading } = useCheckinStore();
  const { user } = useAuthStore();
  
  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newService, setNewService] = useState({ description: '', value: '' });
  const [newPart, setNewPart] = useState({ name: '', quantity: 1, value: '' });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (id) {
      loadCheckin();
    }
  }, [id]);

  useEffect(() => {
    if (currentCheckin) {
      setServices(currentCheckin.services || []);
      setParts(currentCheckin.parts || []);
      setNotes(currentCheckin.notes || []);
    }
  }, [currentCheckin]);

  const loadCheckin = async () => {
    const result = await getCheckinById(id);
    if (!result.success) {
      toast.error('Check-in não encontrado');
      navigate('/checkin');
    }
  };

  const handleAddService = () => {
    if (!newService.description || !newService.value) {
      toast.error('Preencha todos os campos do serviço');
      return;
    }

    const service = {
      id: Date.now().toString(),
      description: newService.description,
      value: parseFloat(newService.value),
      addedBy: user?.displayName || user?.email,
      addedAt: new Date().toISOString()
    };

    const updatedServices = [...services, service];
    setServices(updatedServices);
    setNewService({ description: '', value: '' });
    saveChanges({ services: updatedServices });
  };

  const handleRemoveService = (serviceId) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);
    saveChanges({ services: updatedServices });
  };

  const handleAddPart = () => {
    if (!newPart.name || !newPart.quantity || !newPart.value) {
      toast.error('Preencha todos os campos da peça');
      return;
    }

    const part = {
      id: Date.now().toString(),
      name: newPart.name,
      quantity: parseInt(newPart.quantity),
      value: parseFloat(newPart.value),
      addedBy: user?.displayName || user?.email,
      addedAt: new Date().toISOString()
    };

    const updatedParts = [...parts, part];
    setParts(updatedParts);
    setNewPart({ name: '', quantity: 1, value: '' });
    saveChanges({ parts: updatedParts });
  };

  const handleRemovePart = (partId) => {
    const updatedParts = parts.filter(p => p.id !== partId);
    setParts(updatedParts);
    saveChanges({ parts: updatedParts });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error('Digite uma observação');
      return;
    }

    const note = {
      id: Date.now().toString(),
      text: newNote,
      addedBy: user?.displayName || user?.email,
      addedAt: new Date().toISOString()
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    setNewNote('');
    saveChanges({ notes: updatedNotes });
  };

  const saveChanges = async (updates) => {
    const result = await updateCheckin(id, updates);
    if (result.success) {
      toast.success('Alterações salvas com sucesso!');
    } else {
      toast.error('Erro ao salvar alterações');
    }
  };

  const calculateTotal = () => {
    const servicesTotal = services.reduce((sum, s) => sum + s.value, 0);
    const partsTotal = parts.reduce((sum, p) => sum + (p.value * p.quantity), 0);
    return servicesTotal + partsTotal;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('ID copiado para a área de transferência!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentCheckin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Check-in não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/checkin')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Detalhes do Check-in
            </h1>
            <button
              onClick={() => copyToClipboard(currentCheckin.id)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mt-1"
            >
              ID: {currentCheckin.id} (clique para copiar)
            </button>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
          currentCheckin.status === 'completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {currentCheckin.status === 'completed' ? 'Concluído' : 'Em andamento'}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Cliente</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{currentCheckin.clientName}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-2">
            <Car className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Veículo</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {currentCheckin.vehicleModel} - {currentCheckin.vehiclePlate}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Data</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(currentCheckin.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Serviços</h2>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{service.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Adicionado por {service.addedBy} em {new Date(service.addedAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  R$ {service.value.toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemoveService(service.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Descrição do serviço"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Valor"
            value={newService.value}
            onChange={(e) => setNewService({ ...newService, value: e.target.value })}
            className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Parts */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Peças Utilizadas</h2>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {parts.map((part) => (
            <div key={part.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {part.name} (x{part.quantity})
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Adicionado por {part.addedBy} em {new Date(part.addedAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  R$ {(part.value * part.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemovePart(part.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Nome da peça"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Qtd"
            value={newPart.quantity}
            onChange={(e) => setNewPart({ ...newPart, quantity: e.target.value })}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Valor"
            value={newPart.value}
            onChange={(e) => setNewPart({ ...newPart, value: e.target.value })}
            className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleAddPart}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Observações</h2>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white">{note.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Por {note.addedBy} em {new Date(note.addedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <textarea
            placeholder="Adicionar observação..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg self-end"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Valor Total</p>
              <p className="text-3xl font-bold">R$ {calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInDetailsPage;
