import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTasksStore } from "@/store/tasks.store";
import type { IGetAllEvidencesReq } from "@/core/tasks/domain/get-evidences";
import { useUsersStore } from "@/store/users.store";

type EvidencesFilter = IGetAllEvidencesReq & { usuario?: string; page?: number; limit?: number };

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

  // pagination metadata from store (kept for display fallback)
  const pageFromStore = useTasksStore((s) => s.page);
  const limitFromStore = useTasksStore((s) => s.limit);
  const totalPages = useTasksStore((s) => s.totalPages);
  const totalItems = useTasksStore((s) => s.totalItems);

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

    const page = search.get("page");
    if (page !== null && page !== "") filter.page = Number(page);

    const limit = search.get("limit");
    if (limit !== null && limit !== "") filter.limit = Number(limit);

    return filter;
  }, [location.search, params.id]);

  const currentFilter = useMemo(() => parseFilter(), [parseFilter]);

  // determine if any filter is active (excluding page/limit)
  const isFiltering = useMemo(() => {
    return Boolean(
      currentFilter.actividad ||
      currentFilter.mes != null ||
      currentFilter.anio != null ||
      currentFilter.estado ||
      currentFilter.componente ||
      currentFilter.usuario ||
      currentFilter.trimestre != null ||
      currentFilter.justificacion
    );
  }, [currentFilter]);

  // NOTE: refresh uses URL-derived currentFilter as source of truth.
  const refresh = useCallback(async () => {
    try {
      if (!getAllEvidences) return;

      // Map client url filter to server-supported filter
      const serverFilter: any = {};
      if (currentFilter.actividad) serverFilter.actividad = currentFilter.actividad;
      if (currentFilter.mes != null) serverFilter.mes = Number(currentFilter.mes);
      if (currentFilter.anio != null) serverFilter.anio = Number(currentFilter.anio);
      if (currentFilter.estado) serverFilter.estado = currentFilter.estado;
      if (currentFilter.componente) serverFilter.componente = currentFilter.componente;
      if (currentFilter.trimestre != null) serverFilter.trimestre = Number(currentFilter.trimestre);
      if (currentFilter.justificacion) serverFilter.justificacion = currentFilter.justificacion;

      // map usuario -> responsable for server-side filtering
      if ((currentFilter as any).usuario) serverFilter.responsable = (currentFilter as any).usuario;

      // page & limit only when NOT filtering
      if (!isFiltering) {
        serverFilter.page = currentFilter.page ?? 1;
        serverFilter.limit = currentFilter.limit ?? 10;
      } else {
        // ensure we don't send page/limit when filters active
        // serverFilter.page/limit left undefined
      }

      await getAllEvidences(serverFilter as IGetAllEvidencesReq);
    } catch {
      // error handled in store
    }
  }, [getAllEvidences, currentFilter, isFiltering]);

  // refresh when URL filters change (currentFilter) or components loader reference changes
  useEffect(() => {
    refresh();
    getComponents();
  }, [refresh, getComponents]);

  // update multiple search params in a single navigation to avoid race conditions
  const setSearchParams = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const sp = new URLSearchParams(location.search);
      Object.entries(params).forEach(([key, value]) => {
        if (value == null || value === "") sp.delete(key);
        else sp.set(key, String(value));
      });
      const search = sp.toString();
      navigate({ pathname: location.pathname, search: search ? `?${search}` : "" }, { replace: true });
    },
    [location.pathname, location.search, navigate]
  );

  const setComponenteFilter = useCallback(
    (id?: string | null) => {
      // set componente and remove pagination params
      setSearchParams({ componente: id ?? null, page: null, limit: null });
    },
    [setSearchParams]
  );

  const setUsuarioFilter = useCallback(
    (id?: string | null) => {
      // set usuario (maps to responsable) and remove pagination params
      setSearchParams({ usuario: id ?? null, page: null, limit: null });
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (p: number) => {
      // only set page if not filtering; otherwise remove pagination params
      if (isFiltering) {
        setSearchParams({ page: null, limit: null });
      } else {
        setSearchParams({ page: p });
      }
    },
    [setSearchParams, isFiltering]
  );

  const setLimit = useCallback(
    (l: number) => {
      // if filtering, remove pagination params (no paginado). otherwise set limit and reset to first page.
      if (isFiltering) {
        setSearchParams({ limit: null, page: null });
      } else {
        setSearchParams({ limit: l, page: 1 });
      }
    },
    [setSearchParams, isFiltering]
  );

  // client-side filtered evidences fallback (keep but server should return filtered set)
  const filteredEvidences = useMemo(() => {
    const usuario = currentFilter.usuario;
    if (!usuario) return evidences;
    return evidences.filter((ev: any) => {
      const responsables = Array.isArray(ev.responsables) ? ev.responsables : [];
      if (responsables.some((r: any) => r._id === usuario || r.id === usuario)) return true;
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
    // pagination + control helpers (page/limit prefer URL values; fallback to store)
    page: currentFilter.page ?? pageFromStore ?? 1,
    limit: currentFilter.limit ?? limitFromStore ?? 10,
    totalPages,
    totalItems,
    setPage,
    setLimit,
    isFiltering,
    // expose direct store action if caller wants it
    getAllEvidences,
  };
}