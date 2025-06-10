import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import CheckInForm from '../components/forms/CheckInForm';
import CheckOutForm from '../components/forms/CheckOutForm';

const CheckInPage = () => {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  const handleCheckInSubmit = (checkInData) => {
    console.log('Check-in data:', checkInData);
    // Aqui você salvaria os dados no banco/store
  };

  const handleCheckOutSubmit = (checkOutData) => {
    console.log('Check-out data:', checkOutData);
    // Aqui você salvaria os dados no banco/store
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
        <p className="text-gray-600 dark:text-gray-400">
          Nenhum registro encontrado.
        </p>
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