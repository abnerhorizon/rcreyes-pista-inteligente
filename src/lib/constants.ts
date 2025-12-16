import type { TipoMembresia } from '@/types/database';

export const MEMBRESIA_CONFIG: Record<TipoMembresia, { 
  label: string; 
  descuento: number; 
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
}> = {
  ninguna: { label: 'Sin membresía', descuento: 0, variant: 'outline' },
  basica: { label: 'Básica (5%)', descuento: 5, variant: 'secondary' },
  premium: { label: 'Premium (10%)', descuento: 10, variant: 'default' },
  vip: { label: 'VIP (15%)', descuento: 15, variant: 'destructive' },
};

export const MEMBRESIA_LABELS: Record<TipoMembresia, string> = {
  ninguna: 'Sin membresía',
  basica: 'Básica (5%)',
  premium: 'Premium (10%)',
  vip: 'VIP (15%)',
};
