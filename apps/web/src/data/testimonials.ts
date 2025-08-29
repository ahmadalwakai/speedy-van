export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  rating: number;
  avatar: string;
  service: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    city: 'Manchester',
    quote: 'Speedy Van moved my entire flat in under 3 hours! The team was incredibly professional and careful with my antique furniture.',
    rating: 5,
    avatar: '/avatars/sarah.jpg',
    service: 'Flat Removal'
  },
  {
    name: 'James Thompson',
    city: 'Birmingham',
    quote: 'Best moving experience ever. They handled my electronics with such care, and the price was exactly what they quoted.',
    rating: 5,
    avatar: '/avatars/james.jpg',
    service: 'Electronics Move'
  },
  {
    name: 'Emma Davies',
    city: 'Liverpool',
    quote: 'As a student, I was worried about costs, but Speedy Van offered great rates and flexible timing for my university move.',
    rating: 5,
    avatar: '/avatars/emma.jpg',
    service: 'Student Relocation'
  },
  {
    name: 'Michael Chen',
    city: 'Leeds',
    quote: 'Corporate move completed over the weekend with zero business disruption. Highly recommend for any business needs.',
    rating: 5,
    avatar: '/avatars/michael.jpg',
    service: 'Business Relocation'
  },
  {
    name: 'Lisa Anderson',
    city: 'Sheffield',
    quote: 'They moved my grandmother\'s fragile antiques with incredible care. The team was respectful and professional throughout.',
    rating: 5,
    avatar: '/avatars/lisa.jpg',
    service: 'Antique Moving'
  }
];

export default testimonials;
