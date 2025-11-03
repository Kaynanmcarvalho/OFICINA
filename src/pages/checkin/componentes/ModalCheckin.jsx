import { useState, useEffect } from 'react';
import { X, Upload, User, Phone, Car, FileText, UserCircle } from '@/utils/icons';
import toast from 'react-hot-toast';
import CampoBuscaCliente from './CampoBuscaCliente';
import UploaderFotos from './UploaderFotos';
import ModalNovoCliente from './ModalNovoCliente';
import VehicleThumbnail from '../../../components/VehicleThumbnail';
import { useCheckinStore } from '../../../store';

const ModalCheckin = ({ isOpen, onClose, onSuccess }) => {
    const { createCheckin, uploadPhotos } = useCheckinStore();
    const [formData, setFormData] = useState({ cliente: null, telefone: '', placa: '', modelo: '', observacoes: '', responsavel: '', fotos: [] });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
    const [novoClienteNome, setNovoClienteNome] = useState('');
    
    useEffect(() => { if (!isOpen) { setFormData({ cliente: null, telefone: '', placa: '', modelo: '', observacoes: '', responsavel: '', fotos: [] }); setErrors({}); } }, [isOpen]);
    
    const handleClienteSelect = (cliente) => { 
        if (cliente?.isNew) {
            setNovoClienteNome(cliente.name);
            setShowNovoClienteModal(true);
            return;
        }
        
        // Pegar o primeiro veículo do cliente, se existir
        const primeiroVeiculo = cliente?.vehicles?.[0];
        
        setFormData(prev => ({ 
            ...prev, 
            cliente, 
            telefone: cliente?.phone || '', 
            placa: primeiroVeiculo?.plate || cliente?.lastCheckin?.plate || '', 
            modelo: primeiroVeiculo?.model || cliente?.lastCheckin?.motorcycle || '' 
        })); 
        setErrors(prev => ({ ...prev, cliente: null })); 
    };

    const handleNovoClienteSuccess = (newClient) => {
        // Pegar o primeiro veículo do cliente recém-cadastrado
        const primeiroVeiculo = newClient?.vehicles?.[0];
        
        setFormData(prev => ({ 
            ...prev, 
            cliente: newClient, 
            telefone: newClient.phone || '',
            placa: primeiroVeiculo?.plate || '',
            modelo: primeiroVeiculo?.model || ''
        }));
        setErrors(prev => ({ ...prev, cliente: null }));
        setShowNovoClienteModal(false);
        toast.success('Cliente cadastrado! Continue o check-in.');
    };
    
    const validateForm = () => { const newErrors = {}; if (!formData.cliente) newErrors.cliente = 'Selecione um cliente'; if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'; if (!formData.placa.trim()) { newErrors.placa = 'Placa é obrigatória'; } else if (!/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i.test(formData.placa)) { newErrors.placa = 'Placa inválida'; } if (!formData.modelo.trim()) newErrors.modelo = 'Modelo é obrigatório'; if (!formData.responsavel.trim()) newErrors.responsavel = 'Responsável é obrigatório'; setErrors(newErrors); return Object.keys(newErrors).length === 0; };
    
    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        
        if (!validateForm()) { 
            toast.error('Preencha todos os campos obrigatórios'); 
            return; 
        } 
        
        setIsSubmitting(true); 
        
        try { 
            const checkinData = { 
                clientId: formData.cliente.firestoreId || formData.cliente.id || formData.cliente.clientId,
                clientName: formData.cliente.name,
                clientPhone: formData.telefone,
                vehicleModel: formData.modelo, 
                vehiclePlate: formData.placa.toUpperCase(), 
                observations: formData.observacoes, 
                responsible: formData.responsavel
            }; 
            
            const result = await createCheckin(checkinData);
            
            if (!result.success) {
                throw new Error(result.error || 'Erro ao criar check-in');
            }
            
            // Upload photos if any
            if (formData.fotos.length > 0) {
                const photoFiles = formData.fotos.map(f => f.file);
                await uploadPhotos(result.data.firestoreId, photoFiles, 'before');
            }
            
            toast.success('Check-in realizado com sucesso!'); 
            onSuccess(result.data); 
            onClose(); 
        } catch (error) { 
            console.error('Erro ao realizar check-in:', error); 
            toast.error(error.message || 'Erro ao realizar check-in'); 
        } finally { 
            setIsSubmitting(false); 
        } 
    };
    
    if (!isOpen) return null;
    
    return (<><div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"><div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-neutral-950/50 border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden"><div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0"><div><h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Novo Check-in</h2><p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Registre a entrada do veículo</p></div><button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-out text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100" aria-label="Fechar"><X className="w-5 h-5" /></button></div><div className="flex-1 overflow-y-auto px-6 py-6"><form onSubmit={handleSubmit} className="space-y-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="space-y-5"><div className="flex items-center gap-2 mb-4"><User className="w-5 h-5 text-neutral-400" /><h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 tracking-tight">Dados do Cliente</h3></div><CampoBuscaCliente value={formData.cliente} onSelect={handleClienteSelect} error={errors.cliente} /><div><label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Telefone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" /><input type="tel" value={formData.telefone} onChange={(e) => { setFormData({ ...formData, telefone: e.target.value }); setErrors({ ...errors, telefone: null }); }} placeholder="(11) 98765-4321" className={'w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.telefone ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'} /></div>{errors.telefone && <p className="mt-1 text-xs text-red-500">{errors.telefone}</p>}</div></div><div className="space-y-5"><div className="flex items-center gap-2 mb-4"><Car className="w-5 h-5 text-neutral-400" /><h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 tracking-tight">Dados do Veículo</h3></div><div><label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Placa</label><input type="text" value={formData.placa} onChange={(e) => { setFormData({ ...formData, placa: e.target.value.toUpperCase() }); setErrors({ ...errors, placa: null }); }} placeholder="ABC-1234" maxLength={8} className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.placa ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'} />{errors.placa && <p className="mt-1 text-xs text-red-500">{errors.placa}</p>}</div><div>
  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
    Modelo
  </label>
  <div className="relative">
    <input 
      type="text" 
      value={formData.modelo} 
      onChange={(e) => { 
        setFormData({ ...formData, modelo: e.target.value }); 
        setErrors({ ...errors, modelo: null }); 
      }} 
      placeholder="Honda CB 600F" 
      className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.modelo ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'} 
    />
    {formData.modelo && formData.placa && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <VehicleThumbnail 
          vehicle={{
            brand: formData.modelo.split(' ')[0] || '',
            model: formData.modelo,
            plate: formData.placa,
            type: 'moto'
          }}
          size="sm"
          showOnHover={true}
          showLabel={false}
        />
      </div>
    )}
  </div>
  {errors.modelo && <p className="mt-1 text-xs text-red-500">{errors.modelo}</p>}
</div></div></div><div><div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-neutral-400" /><label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Observações</label></div><textarea value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} placeholder="Descreva o motivo do atendimento..." rows={3} className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out resize-none" /></div><div><div className="flex items-center gap-2 mb-2"><UserCircle className="w-4 h-4 text-neutral-400" /><label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Responsável pelo Atendimento</label></div><input type="text" value={formData.responsavel} onChange={(e) => { setFormData({ ...formData, responsavel: e.target.value }); setErrors({ ...errors, responsavel: null }); }} placeholder="Nome do responsável" className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.responsavel ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'} />{errors.responsavel && <p className="mt-1 text-xs text-red-500">{errors.responsavel}</p>}</div><div><div className="flex items-center gap-2 mb-3"><Upload className="w-4 h-4 text-neutral-400" /><label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Fotos do Veículo</label></div><UploaderFotos fotos={formData.fotos} onChange={(fotos) => setFormData({ ...formData, fotos })} maxFotos={10} /></div></form></div><div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex-shrink-0"><button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-300 ease-out disabled:opacity-50">Cancelar</button><button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Processando...' : 'Confirmar Check-in'}</button></div></div></div><ModalNovoCliente isOpen={showNovoClienteModal} onClose={() => setShowNovoClienteModal(false)} onSuccess={handleNovoClienteSuccess} initialName={novoClienteNome} /></>);
};

export default ModalCheckin;
