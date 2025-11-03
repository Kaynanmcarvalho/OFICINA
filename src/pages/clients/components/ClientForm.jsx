/**
 * ClientForm - Formulário de cliente redesenhado
 * Campos sem bordas visíveis, labels uppercase, underline animado
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, FileText, MapPin, Building } from 'lucide-react';
import AppleInput from './base/AppleInput';
import AppleButton from './base/AppleButton';

const ClientForm = ({
  client = null,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnpj: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Preencher form se editando
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        address: client.address || '',
        notes: client.notes || '',
      });
    }
  }, [client]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AppleInput
          label="Nome Completo"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Digite o nome do cliente"
          icon={User}
          error={errors.name}
          required
        />
      </motion.div>

      {/* Email e Telefone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AppleInput
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@exemplo.com"
            icon={Mail}
            error={errors.email}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <AppleInput
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(11) 98765-4321"
            icon={Phone}
            error={errors.phone}
            required
          />
        </motion.div>
      </div>

      {/* CPF e CNPJ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AppleInput
            label="CPF"
            value={formData.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            icon={FileText}
            error={errors.cpf}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <AppleInput
            label="CNPJ"
            value={formData.cnpj}
            onChange={(e) => handleChange('cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
            icon={Building}
            error={errors.cnpj}
          />
        </motion.div>
      </div>

      {/* Endereço */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AppleInput
          label="Endereço"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Rua, número, bairro, cidade"
          icon={MapPin}
          error={errors.address}
        />
      </motion.div>

      {/* Observações */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <label
          style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--apple-text-secondary)',
            marginBottom: '8px',
          }}
        >
          Observações
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informações adicionais sobre o cliente..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--apple-border-light)',
            background: 'var(--apple-bg-tertiary)',
            color: 'var(--apple-text-primary)',
            fontSize: '15px',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--apple-accent-blue)';
            e.target.style.boxShadow = '0 0 0 4px rgba(0, 122, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--apple-border-light)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </motion.div>

      {/* Botões */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 pt-4"
        style={{
          borderTop: '1px solid var(--apple-border-light)',
        }}
      >
        <AppleButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          fullWidth
        >
          Cancelar
        </AppleButton>
        
        <AppleButton
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {client ? 'Salvar Alterações' : 'Criar Cliente'}
        </AppleButton>
      </motion.div>
    </form>
  );
};

export default ClientForm;
