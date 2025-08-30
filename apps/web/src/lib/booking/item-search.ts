import { BookingItem } from './schemas';

// Search configuration
const SEARCH_CONFIG = {
  fuzzyThreshold: 0.6,
  maxResults: 50,
  boostPopular: 1.5,
  boostRecent: 1.2,
  synonymWeight: 0.8,
} as const;

// Item categories with synonyms and keywords
const ITEM_CATEGORIES = {
  furniture: {
    name: 'Furniture',
    keywords: ['furniture', 'chair', 'table', 'sofa', 'bed', 'wardrobe', 'desk', 'cabinet'],
    synonyms: ['furnishing', 'seating', 'storage', 'bedroom', 'living room'],
    icon: '🪑',
    color: 'blue',
  },
  appliances: {
    name: 'Appliances',
    keywords: ['appliance', 'washing', 'fridge', 'oven', 'microwave', 'dishwasher', 'dryer'],
    synonyms: ['white goods', 'kitchen', 'laundry', 'electrical'],
    icon: '🔌',
    color: 'green',
  },
  electronics: {
    name: 'Electronics',
    keywords: ['tv', 'computer', 'laptop', 'monitor', 'speaker', 'gaming', 'console'],
    synonyms: ['tech', 'gadget', 'device', 'entertainment'],
    icon: '📺',
    color: 'purple',
  },
  boxes: {
    name: 'Boxes & Storage',
    keywords: ['box', 'container', 'storage', 'bin', 'crate', 'trunk'],
    synonyms: ['packaging', 'moving box', 'cardboard'],
    icon: '📦',
    color: 'orange',
  },
  outdoor: {
    name: 'Outdoor & Garden',
    keywords: ['garden', 'outdoor', 'plant', 'bbq', 'furniture', 'shed', 'bike'],
    synonyms: ['patio', 'yard', 'bicycle', 'barbecue'],
    icon: '🌿',
    color: 'teal',
  },
  miscellaneous: {
    name: 'Miscellaneous',
    keywords: ['other', 'misc', 'various', 'item', 'thing'],
    synonyms: ['stuff', 'belongings', 'personal'],
    icon: '📋',
    color: 'gray',
  },
} as const;

// Mock item database with comprehensive data
export const MOCK_ITEMS: BookingItem[] = [
  // Furniture
  {
    id: '1',
    name: 'Sofa (2-seater)',
    category: 'furniture',
    volume: 2.5,
    weight: 45,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Standard 2-seater sofa, fabric or leather',
    imageUrl: '/items/sofa-2-seater.jpg',
  },
  {
    id: '2',
    name: 'Sofa (3-seater)',
    category: 'furniture',
    volume: 3.2,
    weight: 60,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Large 3-seater sofa, fabric or leather',
    imageUrl: '/items/sofa-3-seater.jpg',
  },
  {
    id: '3',
    name: 'Dining Table',
    category: 'furniture',
    volume: 1.8,
    weight: 35,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Standard dining table for 4-6 people',
    imageUrl: '/items/dining-table.jpg',
  },
  {
    id: '4',
    name: 'Dining Chair',
    category: 'furniture',
    volume: 0.3,
    weight: 8,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Standard dining chair',
    imageUrl: '/items/dining-chair.jpg',
  },
  {
    id: '5',
    name: 'Wardrobe (Large)',
    category: 'furniture',
    volume: 4.2,
    weight: 80,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Large wardrobe with multiple doors',
    imageUrl: '/items/wardrobe-large.jpg',
  },
  {
    id: '6',
    name: 'Wardrobe (Small)',
    category: 'furniture',
    volume: 2.1,
    weight: 40,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Small single-door wardrobe',
    imageUrl: '/items/wardrobe-small.jpg',
  },
  {
    id: '7',
    name: 'Bed (Double)',
    category: 'furniture',
    volume: 2.8,
    weight: 50,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Double bed frame with mattress',
    imageUrl: '/items/bed-double.jpg',
  },
  {
    id: '8',
    name: 'Bed (Single)',
    category: 'furniture',
    volume: 1.9,
    weight: 30,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Single bed frame with mattress',
    imageUrl: '/items/bed-single.jpg',
  },
  {
    id: '9',
    name: 'Mattress (Double)',
    category: 'furniture',
    volume: 1.5,
    weight: 30,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Double mattress only',
    imageUrl: '/items/mattress-double.jpg',
  },
  {
    id: '10',
    name: 'Desk',
    category: 'furniture',
    volume: 1.2,
    weight: 25,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Office or study desk',
    imageUrl: '/items/desk.jpg',
  },
  {
    id: '11',
    name: 'Office Chair',
    category: 'furniture',
    volume: 0.5,
    weight: 15,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Ergonomic office chair',
    imageUrl: '/items/office-chair.jpg',
  },
  {
    id: '12',
    name: 'Bookshelf',
    category: 'furniture',
    volume: 1.8,
    weight: 35,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Tall bookshelf or storage unit',
    imageUrl: '/items/bookshelf.jpg',
  },

  // Appliances
  {
    id: '13',
    name: 'Washing Machine',
    category: 'appliances',
    volume: 0.8,
    weight: 70,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Standard washing machine',
    imageUrl: '/items/washing-machine.jpg',
  },
  {
    id: '14',
    name: 'Tumble Dryer',
    category: 'appliances',
    volume: 0.8,
    weight: 65,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Standard tumble dryer',
    imageUrl: '/items/tumble-dryer.jpg',
  },
  {
    id: '15',
    name: 'Refrigerator',
    category: 'appliances',
    volume: 1.2,
    weight: 85,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Standard refrigerator',
    imageUrl: '/items/refrigerator.jpg',
  },
  {
    id: '16',
    name: 'Freezer',
    category: 'appliances',
    volume: 0.9,
    weight: 75,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Upright or chest freezer',
    imageUrl: '/items/freezer.jpg',
  },
  {
    id: '17',
    name: 'Dishwasher',
    category: 'appliances',
    volume: 0.7,
    weight: 55,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Built-in or freestanding dishwasher',
    imageUrl: '/items/dishwasher.jpg',
  },
  {
    id: '18',
    name: 'Oven',
    category: 'appliances',
    volume: 0.6,
    weight: 45,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Electric or gas oven',
    imageUrl: '/items/oven.jpg',
  },
  {
    id: '19',
    name: 'Microwave',
    category: 'appliances',
    volume: 0.2,
    weight: 15,
    quantity: 1,
    fragile: true,
    valuable: false,
    description: 'Standard microwave oven',
    imageUrl: '/items/microwave.jpg',
  },

  // Electronics
  {
    id: '20',
    name: 'TV (32")',
    category: 'electronics',
    volume: 0.2,
    weight: 15,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: '32-inch LED TV',
    imageUrl: '/items/tv-32.jpg',
  },
  {
    id: '21',
    name: 'TV (55")',
    category: 'electronics',
    volume: 0.3,
    weight: 25,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: '55-inch LED TV',
    imageUrl: '/items/tv-55.jpg',
  },
  {
    id: '22',
    name: 'TV (65")',
    category: 'electronics',
    volume: 0.4,
    weight: 35,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: '65-inch LED TV',
    imageUrl: '/items/tv-65.jpg',
  },
  {
    id: '23',
    name: 'Desktop Computer',
    category: 'electronics',
    volume: 0.3,
    weight: 20,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Desktop PC with monitor',
    imageUrl: '/items/desktop-computer.jpg',
  },
  {
    id: '24',
    name: 'Gaming Console',
    category: 'electronics',
    volume: 0.1,
    weight: 5,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'PlayStation, Xbox, or Nintendo console',
    imageUrl: '/items/gaming-console.jpg',
  },
  {
    id: '25',
    name: 'Sound System',
    category: 'electronics',
    volume: 0.4,
    weight: 20,
    quantity: 1,
    fragile: true,
    valuable: true,
    description: 'Hi-fi system with speakers',
    imageUrl: '/items/sound-system.jpg',
  },

  // Boxes & Storage
  {
    id: '26',
    name: 'Small Box',
    category: 'boxes',
    volume: 0.05,
    weight: 10,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Small moving box (books, documents)',
    imageUrl: '/items/box-small.jpg',
  },
  {
    id: '27',
    name: 'Medium Box',
    category: 'boxes',
    volume: 0.1,
    weight: 15,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Medium moving box (clothes, kitchenware)',
    imageUrl: '/items/box-medium.jpg',
  },
  {
    id: '28',
    name: 'Large Box',
    category: 'boxes',
    volume: 0.2,
    weight: 20,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Large moving box (bedding, pillows)',
    imageUrl: '/items/box-large.jpg',
  },
  {
    id: '29',
    name: 'Wardrobe Box',
    category: 'boxes',
    volume: 0.3,
    weight: 25,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Tall wardrobe box for hanging clothes',
    imageUrl: '/items/box-wardrobe.jpg',
  },
  {
    id: '30',
    name: 'Storage Container',
    category: 'boxes',
    volume: 0.4,
    weight: 30,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Plastic storage container with lid',
    imageUrl: '/items/storage-container.jpg',
  },

  // Outdoor & Garden
  {
    id: '31',
    name: 'Bicycle',
    category: 'outdoor',
    volume: 0.8,
    weight: 15,
    quantity: 1,
    fragile: false,
    valuable: true,
    description: 'Adult bicycle',
    imageUrl: '/items/bicycle.jpg',
  },
  {
    id: '32',
    name: 'Garden Furniture Set',
    category: 'outdoor',
    volume: 2.5,
    weight: 40,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Outdoor table and chairs set',
    imageUrl: '/items/garden-furniture.jpg',
  },
  {
    id: '33',
    name: 'BBQ Grill',
    category: 'outdoor',
    volume: 1.2,
    weight: 35,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Gas or charcoal BBQ grill',
    imageUrl: '/items/bbq-grill.jpg',
  },
  {
    id: '34',
    name: 'Lawnmower',
    category: 'outdoor',
    volume: 0.6,
    weight: 25,
    quantity: 1,
    fragile: false,
    valuable: true,
    description: 'Electric or petrol lawnmower',
    imageUrl: '/items/lawnmower.jpg',
  },
  {
    id: '35',
    name: 'Garden Shed Items',
    category: 'outdoor',
    volume: 1.0,
    weight: 30,
    quantity: 1,
    fragile: false,
    valuable: false,
    description: 'Tools and garden equipment',
    imageUrl: '/items/garden-tools.jpg',
  },
];

// Popular items (frequently selected)
const POPULAR_ITEMS = [
  '1', '2', '3', '7', '9', '13', '15', '20', '21', '26', '27', '28'
];

// Recently used items (would come from user history)
const RECENT_ITEMS = [
  '1', '3', '13', '20', '26'
];

// Fuzzy string matching using Levenshtein distance
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

const fuzzyMatch = (query: string, target: string): number => {
  if (query === target) return 1;
  if (target.toLowerCase().includes(query.toLowerCase())) return 0.9;
  
  const distance = levenshteinDistance(query.toLowerCase(), target.toLowerCase());
  const maxLength = Math.max(query.length, target.length);
  return Math.max(0, 1 - distance / maxLength);
};

// Search function with scoring
export interface SearchResult extends BookingItem {
  score: number;
  matchReason: string;
}

export const searchItems = (
  query: string,
  category: string = 'all',
  options: {
    maxResults?: number;
    includePopular?: boolean;
    includeRecent?: boolean;
  } = {}
): SearchResult[] => {
  const {
    maxResults = SEARCH_CONFIG.maxResults,
    includePopular = true,
    includeRecent = true,
  } = options;

  if (!query.trim() && category === 'all') {
    // Return popular items when no search query
    return MOCK_ITEMS
      .filter(item => includePopular ? POPULAR_ITEMS.includes(item.id) : true)
      .map(item => ({
        ...item,
        score: POPULAR_ITEMS.includes(item.id) ? SEARCH_CONFIG.boostPopular : 1,
        matchReason: 'Popular item',
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  MOCK_ITEMS.forEach(item => {
    // Category filter
    if (category !== 'all' && item.category !== category) {
      return;
    }

    let score = 0;
    let matchReason = '';

    // Exact name match
    if (item.name.toLowerCase() === normalizedQuery) {
      score = 1.0;
      matchReason = 'Exact match';
    }
    // Name contains query
    else if (item.name.toLowerCase().includes(normalizedQuery)) {
      score = 0.9;
      matchReason = 'Name contains search term';
    }
    // Fuzzy name match
    else {
      const fuzzyScore = fuzzyMatch(normalizedQuery, item.name);
      if (fuzzyScore >= SEARCH_CONFIG.fuzzyThreshold) {
        score = fuzzyScore * 0.8;
        matchReason = 'Similar name';
      }
    }

    // Category keyword match
    const categoryData = ITEM_CATEGORIES[item.category as keyof typeof ITEM_CATEGORIES];
    if (categoryData) {
      const keywordMatch = categoryData.keywords.some(keyword => 
        keyword.includes(normalizedQuery) || normalizedQuery.includes(keyword)
      );
      if (keywordMatch && score < 0.7) {
        score = Math.max(score, 0.7);
        matchReason = 'Category match';
      }

      // Synonym match
      const synonymMatch = categoryData.synonyms.some(synonym => 
        synonym.includes(normalizedQuery) || normalizedQuery.includes(synonym)
      );
      if (synonymMatch && score < 0.6) {
        score = Math.max(score, 0.6 * SEARCH_CONFIG.synonymWeight);
        matchReason = 'Related term';
      }
    }

    // Description match
    if (item.description && item.description.toLowerCase().includes(normalizedQuery) && score < 0.5) {
      score = Math.max(score, 0.5);
      matchReason = 'Description match';
    }

    // Apply boosts
    if (score > 0) {
      if (includePopular && POPULAR_ITEMS.includes(item.id)) {
        score *= SEARCH_CONFIG.boostPopular;
        matchReason += ' (Popular)';
      }
      
      if (includeRecent && RECENT_ITEMS.includes(item.id)) {
        score *= SEARCH_CONFIG.boostRecent;
        matchReason += ' (Recent)';
      }

      results.push({
        ...item,
        score,
        matchReason,
      });
    }
  });

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};

// Get items by category
export const getItemsByCategory = (category: string): BookingItem[] => {
  if (category === 'all') {
    return MOCK_ITEMS;
  }
  return MOCK_ITEMS.filter(item => item.category === category);
};

// Get popular items
export const getPopularItems = (limit: number = 12): BookingItem[] => {
  return MOCK_ITEMS
    .filter(item => POPULAR_ITEMS.includes(item.id))
    .slice(0, limit);
};

// Get recent items
export const getRecentItems = (limit: number = 6): BookingItem[] => {
  return MOCK_ITEMS
    .filter(item => RECENT_ITEMS.includes(item.id))
    .slice(0, limit);
};

// Get category suggestions based on query
export const getCategorySuggestions = (query: string): Array<{
  category: string;
  name: string;
  icon: string;
  color: string;
  matchCount: number;
}> => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return Object.entries(ITEM_CATEGORIES)
    .map(([key, data]) => {
      const matchCount = MOCK_ITEMS.filter(item => {
        if (item.category !== key) return false;
        
        return (
          item.name.toLowerCase().includes(normalizedQuery) ||
          data.keywords.some(keyword => keyword.includes(normalizedQuery)) ||
          data.synonyms.some(synonym => synonym.includes(normalizedQuery))
        );
      }).length;

      return {
        category: key,
        name: data.name,
        icon: data.icon,
        color: data.color,
        matchCount,
      };
    })
    .filter(cat => cat.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
};

// Auto-complete suggestions
export const getAutocompleteSuggestions = (query: string, limit: number = 5): string[] => {
  if (query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Add item names that start with or contain the query
  MOCK_ITEMS.forEach(item => {
    const name = item.name.toLowerCase();
    if (name.startsWith(normalizedQuery) || name.includes(normalizedQuery)) {
      suggestions.add(item.name);
    }
  });
  
  // Add category keywords
  Object.values(ITEM_CATEGORIES).forEach(category => {
    category.keywords.forEach(keyword => {
      if (keyword.startsWith(normalizedQuery) || keyword.includes(normalizedQuery)) {
        suggestions.add(keyword);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, limit);
};

// Volume and weight estimation
export const estimateTotals = (selectedItems: Array<BookingItem & { quantity: number }>) => {
  const totalVolume = selectedItems.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
  const totalWeight = selectedItems.reduce((sum, item) => sum + ((item.weight || 0) * item.quantity), 0);
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Estimate van size needed
  let recommendedVan = 'Small Van';
  if (totalVolume > 10) recommendedVan = 'Large Van';
  else if (totalVolume > 5) recommendedVan = 'Medium Van';
  
  // Estimate crew size needed
  let recommendedCrew = 1;
  if (totalWeight > 200 || selectedItems.some(item => item.fragile && item.quantity > 0)) {
    recommendedCrew = 2;
  }
  
  return {
    totalVolume: Math.round(totalVolume * 10) / 10, // Round to 1 decimal
    totalWeight: Math.round(totalWeight),
    totalItems,
    recommendedVan,
    recommendedCrew,
  };
};

export { ITEM_CATEGORIES, POPULAR_ITEMS, RECENT_ITEMS };

