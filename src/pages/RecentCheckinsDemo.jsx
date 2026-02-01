/**
 * Recent Check-ins Demo Page
 * Demonstração do componente RecentCheckinsSection
 */

import { useState } from 'react';
import { RecentCheckinsSection } from '../components/RecentCheckins';

const RecentCheckinsDemo = () => {
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  
  // Mock data para demonstração
  const mockCheckins = [
    {
      id: 'CHK-001',
      clientName: 'João Silva',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehiclePlate: 'ABC-1234',
      vehicleType: 'car',
      status: 'active',
      createdAt: new Date().toISOString(),
      services: ['Troca de óleo', 'Alinhamento']
    },
    {
      id: 'CHK-002',
      clientName: 'Maria Santos',
      vehicleBrand: 'Yamaha',
      vehicleModel: 'MT-03',
      vehiclePlate: 'XYZ-5678',
      vehicleType: 'motorcycle',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      services: ['Revisão completa']
    },
    {
      id: 'CHK-003',
      clientName: 'Pedro Oliveira',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Hilux',
      vehiclePlate: 'DEF-9012',
      vehicleType: 'pickup',
      status: 'pending',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      services: ['Troca de pneus']
    },
    {
      id: 'CHK-004',
      clientName: 'Ana Costa',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehiclePlate: 'GHI-3456',
      vehicleType: 'car',
      status: 'active',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      services: ['Balanceamento', 'Geometria']
    },
    {
      id: 'CHK-005',
      clientName: 'Carlos Mendes',
      vehicleBrand: 'Honda',
      vehicleModel: 'CG 160',
      vehiclePlate: 'JKL-7890',
      vehicleType: 'motorcycle',
      status: 'active',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      services: ['Troca de corrente']
    }
  ];
  
  const handleSelectCheckin = (checkin) => {
    setSelectedCheckin(checkin);
    };
  
  const handleViewDetails = (checkin) => {
    alert(`Detalhes do check-in:\n\nCliente: ${checkin.clientName}\nVeículo: ${checkin.vehicleModel}\nPlaca: ${checkin.vehiclePlate}\nStatus: ${checkin.status}`);
  };
  
  return (
    <div className="min-h-screen bg-[#0C0D11] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Recent Check-ins Demo
          </h1>
          <p className="text-gray-400">
            Demonstração do componente Apple Premium UI
          </p>
        </div>
        
        {/* Component Demo */}
        <RecentCheckinsSection
          checkins={mockCheckins}
          maxItems={10}
          onSelectCheckin={handleSelectCheckin}
          onViewDetails={handleViewDetails}
        />
        
        {/* Selected Info */}
        {selectedCheckin && (
          <div className="mt-8 p-6 rounded-2xl" style={{
            background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h3 className="text-white font-semibold mb-2">
              Check-in Selecionado
            </h3>
            <pre className="text-gray-400 text-sm overflow-auto">
              {JSON.stringify(selectedCheckin, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentCheckinsDemo;
