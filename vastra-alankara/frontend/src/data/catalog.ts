export interface GarmentOption {
  id: string;
  name: string;
  color: string;
  category: 'saree' | 'dress' | 'lehenga' | 'kurti';
  imageUrl: string;
}

export const GARMENT_CATALOG: GarmentOption[] = [
  {
    id: 'saree-1',
    name: 'Silk Saree',
    color: 'Red & Gold',
    category: 'saree',
    imageUrl: '/garments/saree1.jpg',
  },
  {
    id: 'saree-2',
    name: 'Banarasi Saree',
    color: 'Blue & Silver',
    category: 'saree',
    imageUrl: '/garments/saree2.jpg',
  },
  // Add more garments here following the same structure
];
