
import { useState, useEffect } from 'react';
import { Listing } from '../types';
import { listingService } from '../services/listingService';

const CACHE_KEY = 'nyumbanow_listings_cache';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load from cache first for "Instant-On" feel
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setListings(parsed);
          setLoading(false);
        }
      } catch (e) {
        console.warn("Cache corrupted, ignoring...");
      }
    }

    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setError(null);
      const data = await listingService.getPaginated(0, 50); // Fetch more for better discovery
      
      console.log(`Successfully fetched ${data.length} listings from Supabase.`);
      
      setListings(data);
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e: any) {
      console.error("Hook Fetch Failure:", e.message || e);
      setError(e.message || "Failed to load houses. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return { listings, loading, error, refetch: fetchListings };
};
