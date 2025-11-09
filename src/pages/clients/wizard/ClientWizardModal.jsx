/**
 * ClientWizardModal - Modal wizard para criar/editar clientes
 */

import { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useWizardState } from './hooks/useWizardState';
import { useFormValidation } from './hooks/useFormValidation';
import { useCepLookup } from './hooks/useCepLookup';
import WizardProgress from './components/WizardProgress';
import WizardNavigation from './components/WizardNavigation';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import { Step2Contact, Step3Additional, Step4Vehicles, Step5Review } from './components/steps/AllSteps';

const ClientWizardModal = ({ isOpen, onClose, onSave, client, isLoading }) => {
  const { isDarkMode } = useThemeStore();
  const {
    currentStep,
    totalSteps,
    formData,
    updateFormData,
    updateAddress,
    addVehicle,
    removeVehicle,
    markTouched,
    goToStep,
    nextStep,
    prevStep,
    resetWizard
  } = useWizardState(5, client);

  const { errors, isValid } = useFormValidation(formData, currentStep);
  const { lookupCep, isLoading: isLoadingCep } = useCepLookup();

  useEffect(() => {
    if (isOpen && !client) {
      resetWizard();
    }
  }, [isOpen, client, resetWizard]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNext = () => {
    if (isValid) {
      nextStep();
    }
  };

  const handleSave = () => {
    if (isValid) {
      onSave(formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFormData={updateFormData} errors={errors} markTouched={markTouched} />;
      case 2:
        return <Step2Contact formData={formData} updateFormData={updateFormData} updateAddress={updateAddress} 
          errors={errors} markTouched={markTouched} lookupCep={lookupCep} isLoadingCep={isLoadingCep} />;
      case 3:
        return <Step3Additional formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step4Vehicles formData={formData} addVehicle={addVehicle} removeVehicle={removeVehicle} />;
      case 5:
        return <Step5Review formData={formData} goToStep={goToStep} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  mass: 0.8
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 20,
                transition: {
                  duration: 0.2,
                  ease: [0.4, 0, 1, 1]
                }
              }}
              className={`
                w-full max-w-4xl max-h-[90vh] overflow-hidden
                rounded-2xl backdrop-blur-xl border flex flex-col
                ${isDarkMode 
                  ? 'bg-gray-900/95 border-[2px] border-gray-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]' 
                  : 'bg-white/95 border-[3px] border-gray-900/80 shadow-[0_20px_60px_rgba(0,0,0,0.3),0_8px_20px_rgba(0,0,0,0.15)]'
                }
              `}
            >
              {/* Header */}
              <div className={`
                px-6 py-5 border-b flex items-center justify-between
                ${isDarkMode ? 'border-gray-700/60' : 'border-gray-300/80'}
              `}>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {client ? 'Editar Cliente' : 'Novo Cliente'}
                  </h2>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Passo {currentStep} de {totalSteps}
                  </p>
                </div>

                <Motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`
                    p-2 rounded-xl transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  <X className="w-5 h-5" />
                </Motion.button>
              </div>

              {/* Progress */}
              <WizardProgress currentStep={currentStep} onStepClick={goToStep} />

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30, scale: 0.98 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      scale: 1,
                      transition: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -30, 
                      scale: 0.98,
                      transition: {
                        duration: 0.3,
                        ease: [0.4, 0, 1, 1]
                      }
                    }}
                  >
                    {renderStep()}
                  </Motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                canGoNext={isValid}
                isLoading={isLoading}
                onNext={handleNext}
                onBack={prevStep}
                onSave={handleSave}
                onCancel={onClose}
              />
            </Motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientWizardModal;
