export interface Lead {
  businessName: string;
  phone: string;
  website: string;
  email: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviewsCount: number;
  categories: string[];
  googleMapsUrl: string;
  categoryName: string;
}

export interface SearchParams {
  keyword: string;
  city: string;
  state: string;
  limit: number;
}

export interface SearchHistoryEntry {
  id: string;
  keyword: string;
  city: string;
  state: string;
  resultCount: number;
  timestamp: number;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  lead: Lead;
  createdAt: string;
}
