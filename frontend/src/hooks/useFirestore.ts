import { useState, useEffect, useCallback } from "react";
import { FirestoreService } from "../services/firestore";
import { LoadingState } from "../types";

export function useFirestore<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false });
  const [service] = useState(() => new FirestoreService<T>(collectionName));

  // Get all documents
  const getAll = useCallback(async () => {
    setLoading({ isLoading: true });
    try {
      const result = await service.getAll();
      setData(result);
      setLoading({ isLoading: false });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, [service]);

  // Get document by ID
  const getById = useCallback(
    async (id: string) => {
      setLoading({ isLoading: true });
      try {
        const result = await service.getById(id);
        setLoading({ isLoading: false });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setLoading({ isLoading: false, error: errorMessage });
        throw error;
      }
    },
    [service]
  );

  // Add document
  const add = useCallback(
    async (item: Omit<T, "id">) => {
      setLoading({ isLoading: true });
      try {
        const id = await service.add(item);
        setLoading({ isLoading: false });
        // Refresh the data
        await getAll();
        return id;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setLoading({ isLoading: false, error: errorMessage });
        throw error;
      }
    },
    [service, getAll]
  );

  // Update document
  const update = useCallback(
    async (id: string, item: Partial<T>) => {
      setLoading({ isLoading: true });
      try {
        await service.update(id, item);
        setLoading({ isLoading: false });
        // Refresh the data
        await getAll();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setLoading({ isLoading: false, error: errorMessage });
        throw error;
      }
    },
    [service, getAll]
  );

  // Delete document
  const remove = useCallback(
    async (id: string) => {
      setLoading({ isLoading: true });
      try {
        await service.delete(id);
        setLoading({ isLoading: false });
        // Refresh the data
        await getAll();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setLoading({ isLoading: false, error: errorMessage });
        throw error;
      }
    },
    [service, getAll]
  );

  // Query documents
  const query = useCallback(
    async (constraints: any[] = []) => {
      setLoading({ isLoading: true });
      try {
        const result = await service.query(constraints);
        setData(result);
        setLoading({ isLoading: false });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setLoading({ isLoading: false, error: errorMessage });
        throw error;
      }
    },
    [service]
  );

  // Clear error
  const clearError = useCallback(() => {
    setLoading((prev) => ({ ...prev, error: undefined }));
  }, []);

  return {
    data,
    loading,
    getAll,
    getById,
    add,
    update,
    remove,
    query,
    clearError,
  };
}
