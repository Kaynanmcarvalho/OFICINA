/**
 * Step1BasicInfo - Informações Básicas do Cliente
 */

import { User, FileText } from 'lucide-react';
import FormField from '../shared/FormField';
import FormSection from '../shared/FormSection';
import SegmentedControl from '../shared/SegmentedControl';
import { formatCPF, formatCNPJ } from '../../utils/validators';

const Step1BasicInfo = ({ formData, updateFormData, errors, markTouched }) => {
  const personTypeOptions = [
    { value: 'PF', label: 'Pessoa Física' },
    { value: 'PJ', label: 'Pessoa Jurídica' }
  ];

  return (
    <FormSection
      title="Informações Básicas"
      subtitle="Dados principais para identificação do cliente"
    >
      <div className="space-y-6">
        {/* Person Type Toggle */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Tipo de Pessoa
          </label>
          <SegmentedControl
            options={personTypeOptions}
            value={formData.personType}
            onChange={(value) => updateFormData('personType', value)}
          />
        </div>

        {/* Name */}
        <FormField
          label="Nome Completo"
          icon={User}
          value={formData.name}
          onChange={(value) => updateFormData('name', value)}
          onBlur={() => markTouched('name')}
          placeholder={formData.personType === 'PF' ? 'Digite o nome completo' : 'Digite o nome fantasia'}
          error={errors.name}
          required
        />

        {/* CPF/RG or CNPJ */}
        {formData.personType === 'PF' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="CPF"
              icon={FileText}
              value={formData.cpf}
              onChange={(value) => updateFormData('cpf', formatCPF(value))}
              onBlur={() => markTouched('cpf')}
              placeholder="000.000.000-00"
              error={errors.cpf}
              maxLength={14}
            />
            <FormField
              label="RG"
              icon={FileText}
              value={formData.rg}
              onChange={(value) => updateFormData('rg', value)}
              placeholder="00.000.000-0"
              maxLength={12}
            />
          </div>
        ) : (
          <>
            <FormField
              label="CNPJ"
              icon={FileText}
              value={formData.cnpj}
              onChange={(value) => updateFormData('cnpj', formatCNPJ(value))}
              onBlur={() => markTouched('cnpj')}
              placeholder="00.000.000/0000-00"
              error={errors.cnpj}
              maxLength={18}
            />
            <FormField
              label="Razão Social"
              icon={FileText}
              value={formData.companyName}
              onChange={(value) => updateFormData('companyName', value)}
              onBlur={() => markTouched('companyName')}
              placeholder="Digite a razão social"
              error={errors.companyName}
              required
            />
          </>
        )}
      </div>
    </FormSection>
  );
};

export default Step1BasicInfo;
