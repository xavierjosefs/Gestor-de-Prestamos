"use client";

import { useEffect, useState } from "react";
import { getClientsService } from "../services/client.service";
import type { ClientRecord } from "../types/client.types";

export function useClients() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getClientsService();
        setClients(response.data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudieron cargar los clientes.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadClients();
  }, []);

  const searchClients = async (query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return reloadClients();
    }

    try {
      setSearching(true);
      setError(null);
      setActiveQuery(trimmedQuery);
      const response = await getClientsService(trimmedQuery);
      setClients(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo encontrar el cliente.";
      setError(message);
      setClients([]);
    } finally {
      setSearching(false);
    }
  };

  const reloadClients = async () => {
    try {
      setSearching(true);
      setError(null);
      setActiveQuery("");
      const response = await getClientsService();
      setClients(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudieron cargar los clientes.";
      setError(message);
    } finally {
      setSearching(false);
    }
  };

  return {
    clients,
    loading,
    searching,
    error,
    activeQuery,
    searchClients,
    reloadClients,
  };
}
