import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import Pagination from "../components/common/Pagination.jsx";
import LeadFilters from "../components/leads/LeadFilters.jsx";
import LeadMobileList from "../components/leads/LeadMobileList.jsx";
import LeadTable from "../components/leads/LeadTable.jsx";
import { fetchUsers } from "../redux/slices/authSlice.js";
import { fetchLeads, setFilters } from "../redux/slices/leadSlice.js";

const LeadsPage = () => {
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.auth);
  const { items, pagination, filters, status, error } = useSelector((state) => state.leads);
  const [page, setPage] = useState(1);
  const isAdmin = user?.role === "admin";

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      ...(filters.status ? { status: filters.status } : {}),
      ...(isAdmin && filters.assignedTo ? { assignedTo: filters.assignedTo } : {}),
    }),
    [filters.assignedTo, filters.status, isAdmin, page]
  );

  useEffect(() => {
    dispatch(fetchLeads(params));
  }, [dispatch, params]);

  useEffect(() => {
    if (isAdmin) dispatch(fetchUsers());
  }, [dispatch, isAdmin]);

  const handleFilterChange = (nextFilters) => {
    setPage(1);
    dispatch(setFilters(nextFilters));
  };

  const clearFilters = () => {
    setPage(1);
    dispatch(setFilters({ status: "", assignedTo: "" }));
  };

  return (
    <section className="animate-in space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Pipeline Management</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Leads</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Server-side filtered opportunities scoped for your <span className="font-semibold capitalize text-[var(--brand)]">{user?.role}</span> role permissions.
          </p>
        </div>
      </div>

      <LeadFilters filters={filters} users={users} isAdmin={isAdmin} onChange={handleFilterChange} onClear={clearFilters} />

      {status === "loading" ? <Loader label="Loading leads pipeline" /> : null}
      {status === "failed" ? <ErrorState description={error} onAction={() => dispatch(fetchLeads(params))} /> : null}
      
      {status !== "loading" && status !== "failed" && items.length === 0 ? (
        <EmptyState
          title={filters.status || filters.assignedTo ? "No leads match these filters." : "No leads captured yet"}
          description={
            filters.status || filters.assignedTo
              ? "Clear filters or adjust the selected search criteria."
              : "New enquiries submitted on the public website form will appear here."
          }
          actionLabel={filters.status || filters.assignedTo ? "Clear filters" : undefined}
          onAction={clearFilters}
        />
      ) : null}

      {status !== "loading" && status !== "failed" && items.length > 0 ? (
        <div className="panel overflow-hidden bg-white border border-[var(--border-default)] shadow-md">
          <LeadTable leads={items} />
          <div className="p-3 md:hidden">
            <LeadMobileList leads={items} />
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      ) : null}
    </section>
  );
};

export default LeadsPage;
