import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  phoneNumber: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon: Icon, color, phoneNumber }) => {
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <button
      onClick={handleCall}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 w-full ${color}`}
    >
      <Icon size={40} className="mb-3 text-white" />
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-white/80 text-sm mt-1">{phoneNumber}</p>
    </button>
  );
};

export default ActionCard;
