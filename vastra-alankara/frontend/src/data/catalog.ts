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
    imageUrl: '/garments/saree2.png',
  },
  {
    id: 'saree-3',
    name: 'Kanjivaram Saree',
    color: 'Green & Gold',
    category: 'saree',
    imageUrl: '/garments/saree3.jpeg',
  },
  {
    id: 'saree-4',
    name: 'Banarasi Silk Saree',
    color: 'Pink & Gold',
    category: 'saree',
    imageUrl: '/garments/saree4.webp',
  },
  {
    id: 'saree-5',
    name: 'Banarasi Silk Saree',
    color: 'Wine & Gold',
    category: 'saree',
    imageUrl: '/garments/saree5.avif',
  },
  // Add more garments here following the same structure
];
