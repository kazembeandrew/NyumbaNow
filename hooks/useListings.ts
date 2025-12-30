
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
      setListings(JSON.parse(cachedData));
      setLoading(false);
    }

    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      // 2. Background fetch
      const data = await listingService.getPaginated(0, 20);
      setListings(data);
      // 3. Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e: any) {
      if (listings.length === 0) setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { listings, loading, error, refetch: fetchListings };
};
