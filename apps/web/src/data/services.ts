import { FaCouch, FaLaptop, FaGraduationCap, FaBuilding, FaMagic } from 'react-icons/fa';

export interface Service {
  icon: any;
  title: string;
  description: string;
  emoji: string;
  color: string;
  features: string[];
}

export const services: Service[] = [
  {
    icon: FaCouch,
    title: 'Furniture Moves',
    description: 'Expert handling of sofas, tables & delicate pieces',
    emoji: '🪑',
    color: 'orange',
    features: ['Professional packing', 'Furniture protection', 'Assembly service']
  },
  {
    icon: FaLaptop,
    title: 'Appliances & Electronics',
    description: 'Safe transport of TVs, computers & kitchen gear',
    emoji: '💻',
    color: 'blue',
    features: ['Anti-static packaging', 'Climate control', 'Insurance coverage']
  },
  {
    icon: FaGraduationCap,
    title: 'Student Moves',
    description: 'Affordable campus-to-campus relocation',
    emoji: '🎓',
    color: 'green',
    features: ['Student discounts', 'Flexible scheduling', 'Storage options']
  },
  {
    icon: FaBuilding,
    title: 'Business & Office',
    description: 'Professional corporate relocation services',
    emoji: '🏢',
    color: 'purple',
    features: ['Minimal downtime', 'Document security', 'After-hours service']
  },
  {
    icon: FaMagic,
    title: 'Custom Requests',
    description: 'Tailored solutions for unique moving needs',
    emoji: '✨',
    color: 'pink',
    features: ['Personalized planning', 'Special handling', 'Custom packaging']
  }
];

export default services;
