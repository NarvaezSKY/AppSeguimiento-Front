import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTasksStore } from "@/store/tasks.store";
import type { IGetAllEvidencesReq } from "@/core/tasks/domain/get-evidences";
import { useUsersStore } from "@/store/users.store";

type EvidencesFilter = IGetAllEvidencesReq & { usuario?: string };

export default function useHome() {
  const location = useLocation();
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const evidences = useTasksStore((s) => s.evidences);
  const isLoading = useTasksStore((s) => s.isLoading);
  const error = useTasksStore((s) => s.error);
  const getAllEvidences = useTasksStore((s) => s.getAllEvidences);
  const clearError = useTasksStore((s) => s.clearError);
  const getComponents = useTasksStore((s) => s.getComponents);
  const components = useTasksStore((s) => s.components);

  const users = useUsersStore((s) => s.users);

  const parseFilter = useCallback((): EvidencesFilter => {
    const search = new URLSearchParams(location.search);
    const filter: EvidencesFilter = {} as EvidencesFilter;

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

    const usuario = search.get("usuario");
    if (usuario) filter.usuario = usuario;

    return filter;
  }, [location.search, params.id]);

  const currentFilter = useMemo(() => parseFilter(), [parseFilter]);

  const refresh = useCallback(async () => {
    try {
      // Only send server-supported filters (strip usuario) to the use case
      const { usuario, ...serverFilter } = currentFilter as any;
      await getAllEvidences(serverFilter as IGetAllEvidencesReq);
    } catch {
      // error handled in store
    }
  }, [getAllEvidences, currentFilter]);

  useEffect(() => {
    refresh();
    getComponents();
    
  }, [refresh, getComponents]);

  const setSearchParam = useCallback(
    (key: string, value?: string | null) => {
      const sp = new URLSearchParams(location.search);
      if (!value) {
        sp.delete(key);
      } else {
        sp.set(key, value);
      }
      const search = sp.toString();
      navigate({ pathname: location.pathname, search: search ? `?${search}` : "" }, { replace: true });
    },
    [location.pathname, location.search, navigate]
  );

  const setComponenteFilter = useCallback(
    (id?: string | null) => {
      setSearchParam("componente", id ?? null);
    },
    [setSearchParam]
  );

  const setUsuarioFilter = useCallback(
    (id?: string | null) => {
      setSearchParam("usuario", id ?? null);
    },
    [setSearchParam]
  );

  // client-side filtered evidences (filter by usuario if provided)
  const filteredEvidences = useMemo(() => {
    const usuario = currentFilter.usuario;
    if (!usuario) return evidences;
    return evidences.filter((ev: any) => {
      // check responsables array and actividad.usuario shapes
      const responsables = Array.isArray(ev.responsables) ? ev.responsables : [];
      if (responsables.some((r: any) => r._id === usuario || r.id === usuario)) return true;
      // fallback: actividad.usuario or creadoPor
      if (ev.actividad?.usuario?._id === usuario || ev.actividad?.usuario === usuario) return true;
      if (ev.creadoPor?._id === usuario || ev.creadoPor === usuario) return true;
      return false;
    });
  }, [evidences, currentFilter]);

  return {
    evidences: filteredEvidences,
    rawEvidences: evidences,
    components,
    users,
    isLoading,
    error,
    refresh,
    clearError,
    currentFilter,
    setComponenteFilter,
    setUsuarioFilter,
  };
}