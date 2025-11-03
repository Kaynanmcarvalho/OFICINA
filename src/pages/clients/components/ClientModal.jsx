/**
 * ClientModal - Usando o mesmo modal da aba /checkin para consistência
 * Modal completo com wizard de 4 etapas e campos detalhados
 */

import ModalNovoCliente from '../../checkin/componentes/ModalNovoCliente';

const ClientModal = ({
  isOpen = false,
  onClose,
  onSave,
  client = null,
  isLoading = false,
}) => {
  
  // Adaptar o callback de sucesso para o formato esperado
  const handleSuccess = (newClient) => {
    if (onSave) {
      // Converter o formato do cliente do checkin para o formato esperado
      const adaptedClient = {
        name: newClient.name,
        email: newClient.email || '',
        phone: newClient.phone,
        cpf: newClient.cpf || '',
        cnpj: newClient.cnpj || '',
        address: newClient.address || '',
        notes: newClient.observations || '',
        // Campos adicionais do checkin
        razaoSocial: newClient.razaoSocial || '',
        nomeFantasia: newClient.nomeFantasia || '',
        inscricaoEstadual: newClient.inscricaoEstadual || '',
        indicadorIE: newClient.indicadorIE || '',
        birthDate: newClient.birthDate || '',
        number: newClient.number || '',
        complement: newClient.complement || '',
        neighborhood: newClient.neighborhood || '',
        city: newClient.city || '',
        state: newClient.state || '',
        zipCode: newClient.zipCode || '',
        vehicles: newClient.vehicles || [],
        personType: newClient.personType || 'fisica'
      };
      
      onSave(adaptedClient);
    }
  };

  // Adaptar o cliente para o formato do modal do checkin
  const adaptedClient = client ? {
    id: client.firestoreId || client.id,
    firestoreId: client.firestoreId || client.id,
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    cpf: client.cpf || '',
    cnpj: client.cnpj || '',
    razaoSocial: client.razaoSocial || '',
    nomeFantasia: client.nomeFantasia || client.name || '',
    inscricaoEstadual: client.inscricaoEstadual || '',
    indicadorIE: client.indicadorIE || '1',
    birthDate: client.birthDate || '',
    address: client.address || '',
    number: client.number || '',
    complement: client.complement || '',
    neighborhood: client.neighborhood || '',
    city: client.city || '',
    state: client.state || '',
    zipCode: client.zipCode || '',
    vehicles: client.vehicles || [],
    observations: client.notes || client.observations || '',
    personType: client.personType || (client.cnpj ? 'juridica' : 'fisica')
  } : null;

  return (
    <ModalNovoCliente
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handleSuccess}
      initialName={adaptedClient?.name || ''}
      // Passar o cliente adaptado como prop adicional se necessário
      existingClient={adaptedClient}
    />
  );
};

export default ClientModal;
