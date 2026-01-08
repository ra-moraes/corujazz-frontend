import { useCallback, useEffect, useState } from "react";
import { getEstablishments } from "../services/establishment.service";
import type { Establishment } from "../types/establishment";

export function useEstablishments() {
  const [establishmentOptions, setEstablishmentOptions] = useState<
    Establishment[]
  >([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEstablishments();
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setEstablishmentOptions(sorted);
      return sorted; // 👈 chave
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 🔑 agenda para o próximo microtask
    Promise.resolve().then(load);
  }, [load]);

  const getById = useCallback(
    (id: string) =>
      establishmentOptions.find((e) => {
        return e.id === id;
      }) || null,
    [establishmentOptions]
  );

  return {
    establishmentOptions,
    loading,
    reload: load,
    getById,
  };
}
