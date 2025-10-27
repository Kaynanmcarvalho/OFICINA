import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Car, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import CheckInForm from '../components/forms/CheckInForm';
import CheckOutForm from '../components/forms/CheckOutForm';
import { useCheckinStore } from '../store';

const CheckInPage = () => {
  const navigate = useNavigate();
  const { checkins, fetchCheckins, createCheckin, isLoading, error } = useCheckinStore();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('ID copiado!');
  };

  const handleCheckinClick = (checkin) => {
    navigate(`/checkin/${checkin.firestoreId}`);
  };

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const handleCheckInSubmit = async (checkInData) => {
    try {
      await createCheckin(checkInData);
      setIsCheckInModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar check-in:', error);
    }
  };

  const handleCheckOutSubmit = async (checkOutData) => {
    try {
      const { completeCheckout } = useCheckinStore.getState();
      const result = await completeCheckout(checkOutData.checkInId, {
        servicesPerformed: checkOutData.servicesPerformed,
        totalCost: parseFloat(checkOutData.totalCost) || 0,
        paymentMethod: checkOutData.paymentMethod,
        observations: checkOutData.observations,
        checkoutPhotos: checkOutData.photos
      });
      
      if (result.success) {
        toast.success('Check-out realizado com sucesso!');
        setIsCheckOutModalOpen(false);
        fetchCheckins(); // Recarregar lista
      } else {
        toast.error(result.error || 'Erro ao realizar check-out');
      }
    } catch (error) {
      console.error('Erro ao realizar check-out:', error);
      toast.error('Erro ao realizar check-out');
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Check-in / Check-out
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Check-in
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Registre a entrada de funcionários, clientes ou visitantes.
          </p>
          <button 
            onClick={() => setIsCheckInModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Fazer Check-in
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Check-out
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Registre a saída de funcionários, clientes ou visitantes.
          </p>
          <button 
            onClick={() => setIsCheckOutModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Fazer Check-out
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Registros Recentes
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Carregando registros...</p>
          </div>
        ) : checkins.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checkins.slice(0, 10).map((checkin) => (
              <div 
                key={checkin.firestoreId} 
                onClick={() => handleCheckinClick(checkin)}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {checkin.clientName}
                      </h4>
                      <button
                        onClick={(e) => copyToClipboard(checkin.id, e)}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Copiar ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {checkin.vehicleModel} - {checkin.vehiclePlate}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        ID: {checkin.id}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(checkin.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    checkin.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {checkin.status === 'completed' ? 'Concluído' : 'Em andamento'}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Modal
         isOpen={isCheckInModalOpen}
         onClose={() => setIsCheckInModalOpen(false)}
         title="Novo Check-in"
         size="lg"
       >
         <CheckInForm
           onSubmit={handleCheckInSubmit}
           onClose={() => setIsCheckInModalOpen(false)}
         />
       </Modal>
       
       <Modal
         isOpen={isCheckOutModalOpen}
         onClose={() => setIsCheckOutModalOpen(false)}
         title="Fazer Check-out"
         size="lg"
       >
         <CheckOutForm
           onSubmit={handleCheckOutSubmit}
           onClose={() => setIsCheckOutModalOpen(false)}
         />
       </Modal>
    </div>
  );
};

export default CheckInPage;