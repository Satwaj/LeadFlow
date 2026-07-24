import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import Toast from "../components/common/Toast.jsx";
import ActivityTimeline from "../components/leads/ActivityTimeline.jsx";
import AssignmentControl from "../components/leads/AssignmentControl.jsx";
import LeadOverview from "../components/leads/LeadOverview.jsx";
import NotesPanel from "../components/leads/NotesPanel.jsx";
import StatusControl from "../components/leads/StatusControl.jsx";
import { fetchUsers } from "../redux/slices/authSlice.js";
import {
  addNoteToLead,
  assignLeadToUser,
  changeLeadStatus,
  clearSelectedLead,
  fetchLeadActivity,
  fetchLeadById,
} from "../redux/slices/leadSlice.js";

const LeadDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.auth);
  const { selectedLead, detailStatus, detailError, activity, activityStatus, activityError, mutationStatus, mutationError } = useSelector((state) => state.leads);
  const [toast, setToast] = useState("");
  const isAdmin = user?.role === "admin";
  const mutating = mutationStatus === "loading";

  useEffect(() => {
    dispatch(fetchLeadById(id));
    dispatch(fetchLeadActivity(id));
    if (isAdmin) dispatch(fetchUsers());
    return () => dispatch(clearSelectedLead());
  }, [dispatch, id, isAdmin]);

  const refreshActivity = () => dispatch(fetchLeadActivity(id));

  const handleStatusChange = async (status) => {
    if (status === selectedLead.status) return;
    const result = await dispatch(changeLeadStatus({ id, status }));
    if (changeLeadStatus.fulfilled.match(result)) {
      setToast("Status updated");
      refreshActivity();
    } else {
      setToast(result.payload || mutationError || "Could not update status.");
    }
  };

  const handleAssign = async (assignedTo) => {
    if (!assignedTo || assignedTo === selectedLead.assignedTo?.id || assignedTo === selectedLead.assignedTo?._id) return;
    const result = await dispatch(assignLeadToUser({ id, assignedTo }));
    if (assignLeadToUser.fulfilled.match(result)) {
      setToast("Lead assigned");
      refreshActivity();
    } else {
      setToast(result.payload || mutationError || "Could not assign lead.");
    }
  };

  const handleAddNote = async (text) => {
    const result = await dispatch(addNoteToLead({ id, text }));
    if (addNoteToLead.fulfilled.match(result)) {
      setToast("Note added");
      refreshActivity();
      return true;
    }
    setToast(result.payload || mutationError || "Could not add note.");
    return false;
  };

  if (detailStatus === "loading") return <Loader label="Loading lead" />;
  if (detailStatus === "failed") return <ErrorState description={detailError} onAction={() => dispatch(fetchLeadById(id))} />;
  if (!selectedLead) return null;

  const assignedId = selectedLead.assignedTo?.id || selectedLead.assignedTo?._id || "";

  return (
    <section className="animate-in space-y-5">
      <div>
        <Link to="/app/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Leads
        </Link>
      </div>
      <div className="panel flex flex-col justify-between gap-4 p-5 md:flex-row md:items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{selectedLead.name}</h2>
          <p className="mt-1 text-[var(--text-secondary)]">{selectedLead.company || "No company"} · {selectedLead.email}</p>
        </div>
        <StatusBadge status={selectedLead.status} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <LeadOverview lead={selectedLead} />
        <section className="panel p-5">
          <h3 className="mb-4 text-lg font-semibold">Management</h3>
          <div className="space-y-4">
            <StatusControl value={selectedLead.status} disabled={mutating} onChange={handleStatusChange} />
            {isAdmin ? (
              <AssignmentControl value={assignedId} users={users} disabled={mutating} onChange={handleAssign} />
            ) : (
              <div className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-3 text-sm text-[var(--text-secondary)]">
                Assigned to: <span className="font-semibold text-[var(--text-primary)]">{selectedLead.assignedTo?.name || "Unassigned"}</span>
              </div>
            )}
            {mutating ? <p className="text-xs font-medium text-[var(--brand)]">Saving change…</p> : null}
          </div>
        </section>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <NotesPanel notes={selectedLead.notes || []} onAddNote={handleAddNote} loading={mutating} />
        <ActivityTimeline activities={activity} status={activityStatus} error={activityError} onRetry={refreshActivity} />
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </section>
  );
};

export default LeadDetailPage;
