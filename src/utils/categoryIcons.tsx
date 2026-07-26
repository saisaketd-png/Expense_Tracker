import React from 'react';
import { 
  Coffee, 
  ShoppingCart, 
  Bus, 
  GraduationCap, 
  FileText, 
  Film, 
  HeartPulse, 
  MoreHorizontal 
} from 'lucide-react';

export type Category = 'Food' | 'Shopping' | 'Transport' | 'Education' | 'Bills' | 'Entertainment' | 'Healthcare' | 'Other';

interface CategoryStyle {
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const getCategoryStyles = (category: string): CategoryStyle => {
  switch (category) {
    case 'Food':
      // Orange
      return { icon: <Coffee size={20} />, color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' };
    case 'Shopping':
      // Purple
      return { icon: <ShoppingCart size={20} />, color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' };
    case 'Transport':
      // Blue
      return { icon: <Bus size={20} />, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
    case 'Education':
      // Emerald
      return { icon: <GraduationCap size={20} />, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
    case 'Bills':
      // Red
      return { icon: <FileText size={20} />, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
    case 'Healthcare':
      // Teal
      return { icon: <HeartPulse size={20} />, color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.1)' };
    case 'Entertainment':
      // Pink
      return { icon: <Film size={20} />, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)' };
    case 'Other':
    default:
      // Slate
      return { icon: <MoreHorizontal size={20} />, color: '#64748B', bg: 'rgba(100, 116, 139, 0.1)' };
  }
};
