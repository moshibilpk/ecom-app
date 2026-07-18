export interface User {
  uid: string;
  email: string;
  username: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type?: "order" | "promo" | "system";
}
