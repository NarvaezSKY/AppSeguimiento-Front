import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useTasksStore } from "@/store/tasks.store";
import type { IGetAllEvidencesReq } from "@/core/tasks/domain/get-evidences";

export default function useHome() {
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  const evidences = useTasksStore((s) => s.evidences);
  const isLoading = useTasksStore((s) => s.isLoading);
  const error = useTasksStore((s) => s.error);
  const getAllEvidences = useTasksStore((s) => s.getAllEvidences);
  const clearError = useTasksStore((s) => s.clearError);

  const parseFilter = useCallback((): IGetAllEvidencesReq => {
    const search = new URLSearchParams(location.search);
    const filter: IGetAllEvidencesReq = {};

    if (params.id) {
      filter.componente = params.id;
    }

    const actividad = search.get("actividad");
    if (actividad) filter.actividad = actividad;

    const mes = search.get("mes");
    if (mes !== null && mes !== "") filter.mes = Number(mes);

    const anio = search.get("anio");
    if (anio !== null && anio !== "") filter.anio = Number(anio);

    const estado = search.get("estado");
    if (estado) filter.estado = estado;

    if (!filter.componente) {
      const componente = search.get("componente");
      if (componente) filter.componente = componente;
    }

    return filter;
  }, [location.search, params.id]);

  const currentFilter = useMemo(() => parseFilter(), [parseFilter]);

  const refresh = useCallback(async () => {
    try {
      await getAllEvidences(currentFilter);
    } catch {
      // error handled in store
    }
  }, [getAllEvidences, currentFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { evidences, isLoading, error, refresh, clearError, currentFilter };
}