import ClientForm from '../../../components/forms/ClientForm';
import Modal from '../../../components/ui/Modal';

/**
 * Wrapper para o ClientForm no contexto de check-in
 * Mantém compatibilidade com o código existente
 */
const ModalNovoClienteWrapper = ({ isOpen, onClose, onSuccess, initialName = '' }) => {
  const handleSubmit = async (clientData) => {
    // O ClientForm já chama createClient internamente
    // Aqui apenas chamamos onSuccess com os dados do cliente criado
    if (onSuccess) {
      onSuccess(clientData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ClientForm
        onSubmit={handleSubmit}
        onClose={onClose}
        client={initialName ? { name: initialName } : null}
      />
    </Modal>
  );
};

export default ModalNovoClienteWrapper;
