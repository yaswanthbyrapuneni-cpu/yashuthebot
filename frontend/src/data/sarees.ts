export interface SareeOption {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
}

export const SAREE_CATALOG: SareeOption[] = [
  {
    id: 'saree-1',
    name: 'Silk Saree',
    color: 'Red & Gold',
    imageUrl: '/sarees/saree1.jpg',
  },
  {
    id: 'saree-2',
    name: 'Banarasi Saree',
    color: 'Blue & Silver',
    imageUrl: '/sarees/saree2.png',
  },
  {
    id: 'saree-3',
    name: 'Kanjivaram Saree',
    color: 'Green & Gold',
    imageUrl: '/sarees/saree3.jpeg',
  },
  {
    id: 'saree-4',
    name: 'Banarasi Silk Saree',
    color: 'Pink & Gold',
    imageUrl: '/sarees/saree4.webp',
  },
  {
    id: 'saree-5',
    name: 'Banarasi Silk Saree',
    color: 'Wine & Gold',
    imageUrl: '/sarees/saree5.avif',
  },
];
