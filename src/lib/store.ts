import { create } from "zustand";
import { persist } from "zustand/middleware";
import { listings as initialListings, vendors } from "./mock-data";

export type ActiveMode = "buyer" | "vendor";
export type VerificationStatus = "unverified" | "pending_review" | "verified" | "rejected";
export type RentalStatus = "pending" | "negotiating" | "accepted" | "rejected" | "expired";
export type DeliveryState = "pending" | "vendor_preparing" | "courier_assigned" | "picked_up" | "in_transit" | "delivered" | "return_pending" | "returned";
export type InsuranceState = "not_required" | "pending_recording" | "recording_started" | "submitted_for_validation" | "approved" | "rejected" | "skipped_warning";

export type Message = {
  id: string;
  authorId: string;
  type: "text" | "offer";
  text?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  ts: number;
};

export type Rental = {
  id: string;
  listingId: string;
  buyerId: string;
  vendorId: string;
  startDate: string;
  endDate: string;
  offerPrice: number;
  status: RentalStatus;
  thread: Message[];
  deliveryState: DeliveryState;
  insuranceState: InsuranceState;
  insuranceCode?: string;
  createdAt: number;
};

export type RentalDraft = {
  listingId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  delivery: "pickup" | "delivery";
  signature: string | null;
  paymentMethod: string | null;
};

export type ListingDraft = {
  category: string | null;
  title: string;
  description: string;
  photos: string[];
  pricePerDay: number | "";
  deposit: number | "";
  delivery: boolean;
  city: string;
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  verificationStatus: VerificationStatus;
  activeMode: ActiveMode;
};

import categoriesJson from "../data/categories.json";
import vendorsJson from "../data/vendors.json";
import listingsJson from "../data/listings.json";
import rentalsJson from "../data/rentals.json";
import usersJson from "../data/users.json";

export type Category = { id: string; label: string; iconName: string };

const initialUser: UserAccount = {
  ...usersJson.find((u: any) => u.id === "user-1") as UserAccount,
  activeMode: "vendor"
};
const initialRentals: Rental[] = rentalsJson as any[];
const mockListings = listingsJson as any[];
const mockVendors = vendorsJson as any[];

const emptyListingDraft: ListingDraft = {
  category: null,
  title: "",
  description: "",
  photos: [],
  pricePerDay: "",
  deposit: "",
  delivery: true,
  city: "Tunis",
};

const emptyRentalDraft: RentalDraft = {
  listingId: "",
  startDate: "",
  endDate: "",
  purpose: "",
  delivery: "pickup",
  signature: null,
  paymentMethod: null,
};

type State = {
  authed: boolean;
  currentUser: UserAccount;
  rentals: Rental[];
  myListings: any[]; // User's own listings
  listingDraft: ListingDraft;
  draft: RentalDraft;

  // Global UI states
  isVerificationModalOpen: boolean;
  blockedActionReason: string | null;

  // Actions
  setAuthed: (authed: boolean) => void;
  setActiveMode: (mode: ActiveMode) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  
  // Verification Interceptor
  requireVerification: (reason: string, onVerified?: () => void) => boolean;
  closeVerificationModal: () => void;
  completeVerification: () => void;

  // Async Services
  acceptRental: (rentalId: string) => Promise<void>;
  rejectRental: (rentalId: string) => Promise<void>;
  counterOffer: (rentalId: string, price: number) => Promise<void>;
  createRentalRequest: (listingId: string, vendorId: string, startDate: string, endDate: string, price: number) => Promise<void>;
  updateInsuranceState: (rentalId: string, state: InsuranceState) => Promise<void>;
  generateInsuranceCode: (rentalId: string) => Promise<string>;

  // Listing Draft Actions
  startListingDraft: () => void;
  updateListingDraft: (patch: Partial<ListingDraft>) => void;
  publishListing: () => string | null;

  // Rental Draft Actions
  startDraft: (listingId: string) => void;
  updateDraft: (patch: Partial<RentalDraft>) => void;
  updateDeliveryState: (rentalId: string, state: DeliveryState) => void;
  
  // Account Switcher for testing
  switchAccount: (userId: string) => void;
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      authed: false,
      currentUser: initialUser,
      rentals: initialRentals,
      myListings: [],
      listingDraft: emptyListingDraft,
      draft: emptyRentalDraft,

      isVerificationModalOpen: false,
      blockedActionReason: null,

      setAuthed: (authed) => set({ authed }),
      setActiveMode: (mode) => set((s) => ({ currentUser: { ...s.currentUser, activeMode: mode } })),
      setVerificationStatus: (status) => set((s) => ({ currentUser: { ...s.currentUser, verificationStatus: status } })),

      requireVerification: (reason, onVerified) => {
        const { currentUser } = get();
        if (currentUser.verificationStatus === "verified") {
          if (onVerified) onVerified();
          return true;
        } else {
          set({ isVerificationModalOpen: true, blockedActionReason: reason });
          return false;
        }
      },
      closeVerificationModal: () => set({ isVerificationModalOpen: false, blockedActionReason: null }),
      completeVerification: () => {
        set((s) => ({ currentUser: { ...s.currentUser, verificationStatus: "pending_review" } }));
        // Simulate review process
        setTimeout(() => {
          set((s) => ({ currentUser: { ...s.currentUser, verificationStatus: "verified" } }));
        }, 3000); // 3 seconds fake review
      },

      acceptRental: async (rentalId) => {
        await delay(600); // Network simulation
        set((s) => ({
          rentals: s.rentals.map((r) => {
            if (r.id === rentalId) {
              return {
                ...r,
                status: "accepted",
                deliveryState: "vendor_preparing",
                insuranceState: "pending_recording",
                insuranceCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
              };
            }
            return r;
          })
        }));
      },
      rejectRental: async (rentalId) => {
        await delay(400);
        set((s) => ({
          rentals: s.rentals.map((r) => r.id === rentalId ? { ...r, status: "rejected" } : r)
        }));
      },
      counterOffer: async (rentalId, price) => {
        await delay(500);
        set((s) => ({
          rentals: s.rentals.map((r) => {
            if (r.id === rentalId) {
              return {
                ...r,
                status: "negotiating",
                offerPrice: price,
                thread: [
                  ...r.thread,
                  {
                    id: `m-${Date.now()}`,
                    authorId: s.currentUser.id,
                    type: "offer",
                    price,
                    ts: Date.now()
                  }
                ]
              };
            }
            return r;
          })
        }));
      },
      createRentalRequest: async (listingId, vendorId, startDate, endDate, price) => {
        await delay(800);
        const newRental: Rental = {
          id: `rent-${Date.now()}`,
          listingId,
          buyerId: get().currentUser.id,
          vendorId,
          startDate,
          endDate,
          offerPrice: price,
          status: "pending",
          thread: [],
          deliveryState: "pending",
          insuranceState: "not_required",
          createdAt: Date.now(),
        };
        set((s) => ({ rentals: [newRental, ...s.rentals] }));
      },
      updateInsuranceState: async (rentalId, state) => {
        await delay(1000);
        set((s) => ({
          rentals: s.rentals.map((r) => {
            if (r.id === rentalId) {
              let nextDeliveryState = r.deliveryState;
              if (state === "approved") nextDeliveryState = "courier_assigned";
              if (state === "rejected") nextDeliveryState = "pending"; // Blocked
              return { ...r, insuranceState: state, deliveryState: nextDeliveryState };
            }
            return r;
          })
        }));
      },
      generateInsuranceCode: async (rentalId) => {
        await delay(300);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        set((s) => ({
          rentals: s.rentals.map((r) => r.id === rentalId ? { ...r, insuranceCode: code } : r)
        }));
        return code;
      },
      
      startListingDraft: () => set({ listingDraft: emptyListingDraft }),
      updateListingDraft: (patch) => set((s) => ({ listingDraft: { ...s.listingDraft, ...patch } })),
      publishListing: () => {
        const d = get().listingDraft;
        if (!d.title || !d.category || !d.pricePerDay) return null;
        const id = `vl-${Date.now().toString(36)}`;
        const newListing = {
          id,
          title: d.title,
          category: d.category,
          pricePerDay: Number(d.pricePerDay),
          image: d.photos[0] ?? "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
          active: true,
          views: 0,
        };
        set((s) => ({
          myListings: [newListing, ...s.myListings],
          listingDraft: emptyListingDraft,
        }));
        return id;
      },

      startDraft: (listingId) => set({ draft: { ...emptyRentalDraft, listingId } }),
      updateDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      updateDeliveryState: (rentalId, state) => set((s) => ({
        rentals: s.rentals.map((r) => r.id === rentalId ? { ...r, deliveryState: state } : r)
      })),
      
      switchAccount: (userId) => {
        const user = usersJson.find((u: any) => u.id === userId);
        if (user) {
          set({
            currentUser: { ...user, activeMode: "buyer" } as UserAccount
          });
        }
      },
    }),
    { name: "rented-app-v8" }
  )
);
