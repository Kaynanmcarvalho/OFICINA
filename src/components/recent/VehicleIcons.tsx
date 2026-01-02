import React from 'react';
import { IoCarSport } from 'react-icons/io5';
import { RiMotorbikeFill } from 'react-icons/ri';
import { FaTruckMoving, FaShuttleVan, FaUser } from 'react-icons/fa';

interface VehicleIconProps {
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const VehicleIcons: React.FC<VehicleIconProps> = ({ type, className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const iconSize = sizeMap[size];

  const icons: Record<string, React.ReactNode> = {
    car: <IoCarSport size={iconSize} className={className} />,
    motorcycle: <RiMotorbikeFill size={iconSize} className={className} />,
    truck: <FaTruckMoving size={iconSize} className={className} />,
    van: <FaShuttleVan size={iconSize} className={className} />,
    client: <FaUser size={iconSize} className={className} />
  };

  return <>{icons[type] || icons.car}</>;
};

export default VehicleIcons;
