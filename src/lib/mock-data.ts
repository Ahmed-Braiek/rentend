import { Wrench, Laptop, Sofa, Dumbbell, Camera, Tent, PartyPopper, Car, type LucideIcon } from "lucide-react";

import categoriesJson from "../data/categories.json";
import vendorsJson from "../data/vendors.json";
import listingsJson from "../data/listings.json";
import reviewsJson from "../data/reviews.json";
import impactJson from "../data/impact.json";
import usersJson from "../data/users.json";

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Laptop,
  Sofa,
  Dumbbell,
  Camera,
  Tent,
  PartyPopper,
  Car
};

export type Category = { id: string; label: string; icon: LucideIcon };

export const categories: Category[] = categoriesJson.map((c) => ({
  id: c.id,
  label: c.label,
  icon: iconMap[c.iconName] || Wrench,
}));

export type Vendor = {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  reviews: number;
  verified: boolean;
  bio: string;
};

export const vendors: Record<string, Vendor> = vendorsJson.reduce((acc: any, v: any) => {
  acc[v.id] = v;
  return acc;
}, {});

export type Listing = {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  rating: number;
  distanceKm: number;
  vendorId: string;
  image: string;
  gallery: string[];
  description: string;
  delivery: boolean;
};

export const listings: Listing[] = listingsJson as Listing[];
export const reviews = reviewsJson;
export const users = usersJson.reduce((acc: any, u: any) => {
  acc[u.id] = u;
  return acc;
}, {});

export const getListing = (id: string) => listings.find((l) => l.id === id);
export const getVendor = (id: string) => vendors[id] || users[id];
export const getReviewsForListing = (listingId: string) => reviews.filter(r => r.listingId === listingId);

export const impactStats = impactJson.stats;
export const impactStories = impactJson.stories.map((story: any) => ({
  ...story,
  avatar: users[story.authorId]?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop",
  author: users[story.authorId]?.name || "Anonymous",
}));

// Mock courier for delivery tracker
export const courier = {
  name: "Riadh — Rented Express",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  eta: "Today, 4:30 PM",
};

