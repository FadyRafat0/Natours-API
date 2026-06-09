export interface Location {
  type: string;
  coordinates: number[];
  address?: string;
  description?: string;
  day?: number;
  _id?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: 'user' | 'guide' | 'lead-guide' | 'admin';
  isVerified: boolean;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  tour: string | Tour;
  user: User;
}

export interface Tour {
  _id: string;
  id: string;
  name: string;
  nameSlug: string;
  price: number;
  priceDiscount?: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ratingsAverage: number;
  ratingsQuantity: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  startLocation: Location;
  locations: Location[];
  guides: User[];
  reviews?: Review[];
  durationWeeks?: number;
}

export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
}

export interface Booking {
  _id: string;
  tour: Tour;
  user: User;
  price: number;
  paid: boolean;
  createdAt: string;
}
