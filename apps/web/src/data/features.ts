import { FaTruck, FaClock, FaShieldAlt, FaStar } from 'react-icons/fa';

export interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

export const features: Feature[] = [
  {
    icon: FaTruck,
    title: 'Fast & Reliable',
    description: 'Professional moving service with guaranteed delivery times',
    color: 'blue',
    gradient: 'linear(to-r, blue.400, blue.600)'
  },
  {
    icon: FaClock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for peace of mind',
    color: 'green',
    gradient: 'linear(to-r, green.400, green.600)'
  },
  {
    icon: FaShieldAlt,
    title: 'Fully Insured',
    description: 'Complete coverage for your valuable belongings',
    color: 'purple',
    gradient: 'linear(to-r, purple.400, purple.600)'
  },
  {
    icon: FaStar,
    title: '5-Star Rated',
    description: 'Trusted by thousands of satisfied customers',
    color: 'yellow',
    gradient: 'linear(to-r, yellow.400, yellow.600)'
  }
];

export default features;
