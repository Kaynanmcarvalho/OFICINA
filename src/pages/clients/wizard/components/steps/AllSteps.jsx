/**
 * All Wizard Steps - Consolidated file
 */

import { Mail, Phone, MapPin, Calendar, User, Car, Plus, Trash2, Loader2 } from 'lucide-react';
import FormField from '../shared/FormField';
import FormSection from '../shared/FormSection';
import { formatPhone, formatCEP, formatPlate } from '../../utils/validators';
import { useThemeStore } from '../../../../../store/themeStore';
import { useState } from 'react';

// Step 2: Contact and Location
export const Step2Contact = ({ formData, updateFormData, updateAddress, errors, markTouched, lookupCep, isLoadingCep }) => {
  const handleCepChange = async (value) => {
    const formatted = formatCEP(value);
    updateFormData('address.cep', formatted);
    
    // Busca imediata quando CEP estiver completo
    const cleanCep = formatted.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      const result = await lookupCep(formatted);
      if (result.success) {
        updateAddress(result.data);
      }
    }
  };

  return (
    <FormSection title="Contato e Localização" subtitle="Informações para contato e endereço">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Telefone Principal" icon={Phone} value={formData.phone} 
            onChange={(v) => updateFormData('phone', formatPhone(v))} onBlur={() => markTouched('phone')}
            placeholder="(00) 00000-0000" error={errors.phone} required />
          <FormField label="Telefone Secundário" icon={Phone} value={formData.phoneSecondary}
            onChange={(v) => updateFormData('phoneSecondary', formatPhone(v))}
            placeholder="(00) 00000-0000" error={errors.phoneSecondary} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="E-mail" icon={Mail} type="email" value={formData.email}
            onChange={(v) => updateFormData('email', v)} onBlur={() => markTouched('email')}
            placeholder="email@exemplo.com" error={errors.email} />
          <FormField label="WhatsApp" icon={Phone} value={formData.whatsapp}
            onChange={(v) => updateFormData('whatsapp', formatPhone(v))}
            placeholder="(00) 00000-0000" error={errors.whatsapp} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="CEP" icon={MapPin} value={formData.address.cep}
            onChange={handleCepChange} placeholder="00000-000" disabled={isLoadingCep} />
          <div className="md:col-span-2">
            <FormField label="Rua" value={formData.address.street}
              onChange={(v) => updateFormData('address.street', v)} placeholder="Nome da rua" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Número" value={formData.address.number}
            onChange={(v) => updateFormData('address.number', v)} placeholder="123" />
          <FormField label="Complemento" value={formData.address.complement}
            onChange={(v) => updateFormData('address.complement', v)} placeholder="Apto, Bloco..." />
          <FormField label="Bairro" value={formData.address.neighborhood}
            onChange={(v) => updateFormData('address.neighborhood', v)} placeholder="Bairro" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cidade" value={formData.address.city}
            onChange={(v) => updateFormData('address.city', v)} placeholder="Cidade" />
          <FormField label="Estado" value={formData.address.state}
            onChange={(v) => updateFormData('address.state', v.toUpperCase())} placeholder="UF" maxLength={2} />
        </div>
      </div>
    </FormSection>
  );
};

// Step 3: Additional Info
export const Step3Additional = ({ formData, updateFormData }) => {
  return (
    <FormSection title="Informações Adicionais" subtitle="Dados complementares (opcional)">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Data de Nascimento" icon={Calendar} type="date" value={formData.birthDate}
            onChange={(v) => updateFormData('birthDate', v)} />
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Gênero</label>
            <select value={formData.gender} onChange={(e) => updateFormData('gender', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[2px] border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
              <option value="N">Prefiro não informar</option>
            </select>
          </div>
        </div>

        <FormField label="Profissão" icon={User} value={formData.profession}
          onChange={(v) => updateFormData('profession', v)} placeholder="Ex: Engenheiro" />

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-300">Como conheceu a oficina?</label>
          <select value={formData.referralSource} onChange={(e) => updateFormData('referralSource', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-[2px] border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
            <option value="">Selecione...</option>
            <option value="indication">Indicação</option>
            <option value="google">Google</option>
            <option value="social">Redes Sociais</option>
            <option value="other">Outros</option>
          </select>
        </div>

        <FormField label="Observações" type="textarea" value={formData.notes}
          onChange={(v) => updateFormData('notes', v)} placeholder="Observações sobre o cliente..."
          rows={4} maxLength={500} />
      </div>
    </FormSection>
  );
};

// Step 4: Vehicles
export const Step4Vehicles = ({ formData, addVehicle, removeVehicle }) => {
  const { isDarkMode } = useThemeStore();
  const [showForm, setShowForm] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ brand: '', model: '', year: '', plate: '', color: '', chassis: '' });

  const handleAdd = () => {
    if (vehicleForm.brand && vehicleForm.model) {
      addVehicle(vehicleForm);
      setVehicleForm({ brand: '', model: '', year: '', plate: '', color: '', chassis: '' });
      setShowForm(false);
    }
  };

  return (
    <FormSection title="Veículos" subtitle="Cadastre os veículos do cliente (opcional)">
      <div className="space-y-4">
        {formData.vehicles.map((vehicle) => (
          <div key={vehicle.id} className={`p-4 rounded-xl border flex items-center justify-between ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'
          }`}>
            <div>
              <div className="font-semibold">{vehicle.brand} {vehicle.model}</div>
              <div className="text-sm text-gray-500">{vehicle.year} • {vehicle.plate} • {vehicle.color}</div>
            </div>
            <button onClick={() => removeVehicle(vehicle.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {showForm ? (
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Marca *" value={vehicleForm.brand} onChange={(e) => setVehicleForm({...vehicleForm, brand: e.target.value})}
                className="px-3 py-2 rounded-lg border-[2px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input placeholder="Modelo *" value={vehicleForm.model} onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                className="px-3 py-2 rounded-lg border-[2px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input placeholder="Ano" value={vehicleForm.year} onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})}
                className="px-3 py-2 rounded-lg border-[2px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input placeholder="Placa" value={vehicleForm.plate} onChange={(e) => setVehicleForm({...vehicleForm, plate: formatPlate(e.target.value)})}
                className="px-3 py-2 rounded-lg border-[2px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input placeholder="Cor" value={vehicleForm.color} onChange={(e) => setVehicleForm({...vehicleForm, color: e.target.value})}
                className="px-3 py-2 rounded-lg border-[2px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input placeholder="Chassi" value={vehicleForm.chassis} onChange={(e) => setVehicleForm({...vehicleForm, chassis: e.target.value})}
                className="px-3 py-2 rounded-lg border-[2px] border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleAdd} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">Adicionar</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg">Cancelar</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all">
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar Veículo
          </button>
        )}
      </div>
    </FormSection>
  );
};

// Step 5: Review
export const Step5Review = ({ formData, goToStep }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <FormSection title="Revisão" subtitle="Confira todos os dados antes de salvar">
      <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold">Informações Básicas</h4>
            <button onClick={() => goToStep(1)} className="text-sm text-blue-500">Editar</button>
          </div>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-500">Nome:</span> {formData.name}</div>
            {formData.personType === 'PF' && formData.cpf && <div><span className="text-gray-500">CPF:</span> {formData.cpf}</div>}
            {formData.personType === 'PF' && formData.rg && <div><span className="text-gray-500">RG:</span> {formData.rg}</div>}
            {formData.personType === 'PJ' && formData.cnpj && <div><span className="text-gray-500">CNPJ:</span> {formData.cnpj}</div>}
            {formData.companyName && <div><span className="text-gray-500">Razão Social:</span> {formData.companyName}</div>}
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold">Contato</h4>
            <button onClick={() => goToStep(2)} className="text-sm text-blue-500">Editar</button>
          </div>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-500">Telefone:</span> {formData.phone}</div>
            {formData.email && <div><span className="text-gray-500">E-mail:</span> {formData.email}</div>}
            {formData.address.street && <div><span className="text-gray-500">Endereço:</span> {formData.address.street}, {formData.address.number} - {formData.address.city}/{formData.address.state}</div>}
          </div>
        </div>

        {formData.vehicles.length > 0 && (
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold">Veículos ({formData.vehicles.length})</h4>
              <button onClick={() => goToStep(4)} className="text-sm text-blue-500">Editar</button>
            </div>
            {formData.vehicles.map(v => (
              <div key={v.id} className="text-sm">{v.brand} {v.model} - {v.plate}</div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
};
