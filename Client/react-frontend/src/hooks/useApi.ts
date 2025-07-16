import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '../utils/errorUtils';

/**
 * Custom hook for fetching data from an API
 * @param fetchFunction The function to call to fetch data
 * @param dependencies Optional dependencies array for the effect
 * @returns Object containing data, loading state, error, and a refetch function
 */
export function useApiRequest<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Custom hook for making mutations (POST, PUT, DELETE) to an API
 * @param mutationFunction The function to call for the mutation
 * @returns Object containing execute function, loading state, error, and data
 */
export function useApiMutation<T, P>(
  mutationFunction: (params: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
}
