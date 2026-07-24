import { ArrowLeft, CheckCircle2, Clock, Send, ShieldCheck, UserCheck, UserX, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Button from "../components/common/Button.jsx";
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
import {
  approveLeadRequest,
  fetchLeadRequests,
  fetchMyLeadRequests,
  rejectLeadRequest,
  requestLead,
} from "../redux/slices/leadRequestSlice.js";

const LeadDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.auth);
  const {
    selectedLead,
    detailStatus,
    detailError,
    activity,
    activityStatus,
    activityError,
    mutationStatus,
    mutationError,
  } = useSelector((state) => state.leads);

  const { items, myRequests } = useSelector((state) => state.leadRequests);

  const [toast, setToast] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [processingReqId, setProcessingReqId] = useState(null);

  const isAdmin = user?.role === "admin";
  const mutating = mutationStatus === "loading";

  useEffect(() => {
    dispatch(fetchLeadById(id));
    dispatch(fetchLeadActivity(id));
    if (isAdmin) {
      dispatch(fetchUsers());
      dispatch(fetchLeadRequests());
    } else {
      dispatch(fetchMyLeadRequests());
    }
    return () => dispatch(clearSelectedLead());
  }, [dispatch, id, isAdmin]);

  const refreshActivity = () => {
    dispatch(fetchLeadActivity(id));
    dispatch(fetchLeadById(id));
    if (isAdmin) dispatch(fetchLeadRequests());
  };

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
      setToast("Lead assigned successfully.");
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

  const handleRequestLead = async () => {
    setRequesting(true);
    const result = await dispatch(requestLead(id));
    setRequesting(false);

    if (requestLead.fulfilled.match(result)) {
      setToast("Lead request sent.");
      dispatch(fetchMyLeadRequests());
    } else {
      setToast(result.payload || "Could not send lead request.");
    }
  };

  const handleApproveRequest = async (requestId) => {
    setProcessingReqId(requestId);
    const result = await dispatch(approveLeadRequest(requestId));
    setProcessingReqId(null);

    if (approveLeadRequest.fulfilled.match(result)) {
      setToast("Lead assigned to requesting member successfully.");
      refreshActivity();
    } else {
      setToast(result.payload || "Could not approve request.");
    }
  };

  const handleRejectRequest = async (requestId) => {
    setProcessingReqId(requestId);
    const result = await dispatch(rejectLeadRequest(requestId));
    setProcessingReqId(null);

    if (rejectLeadRequest.fulfilled.match(result)) {
      setToast("Lead request rejected.");
      refreshActivity();
    } else {
      setToast(result.payload || "Could not reject request.");
    }
  };

  if (detailStatus === "loading") return <Loader label="Loading lead" />;
  if (detailStatus === "failed") return <ErrorState description={detailError} onAction={() => dispatch(fetchLeadById(id))} />;
  if (!selectedLead) return null;

  const assignedId = selectedLead.assignedTo?.id || selectedLead.assignedTo?._id || "";
  const isAssignedToCurrentMember = assignedId && (assignedId === user?.id || assignedId === user?._id);
  const isUnassigned = !selectedLead.assignedTo;

  // Member's latest request for this lead
  const memberReq = myRequests.find(
    (req) => (req.lead?._id === id || req.lead === id)
  );

  // Admin: Pending requests for this specific lead
  const pendingRequestsForThisLead = items.filter(
    (req) => (req.lead?._id === id || req.lead === id) && req.status === "pending"
  );

  return (
    <section className="animate-in space-y-5">
      <div>
        <Link to="/app/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Leads
        </Link>
      </div>

      <div className="panel flex flex-col justify-between gap-4 p-5 md:flex-row md:items-start bg-white border border-[var(--border-default)] rounded-[var(--radius-xl)] shadow-md">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">{selectedLead.name}</h2>
          <p className="mt-1 text-[var(--text-secondary)]">{selectedLead.company || "No company"} · {selectedLead.email}</p>
        </div>
        <StatusBadge status={selectedLead.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <LeadOverview lead={selectedLead} />
        
        <section className="panel p-5 bg-white border border-[var(--border-default)] rounded-[var(--radius-xl)] space-y-5">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Lead Assignment & Management</h3>
          
          <div className="space-y-4">
            {/* Admin: Show Pending Requests for this Lead */}
            {isAdmin && pendingRequestsForThisLead.length > 0 && (
              <div className="rounded-[var(--radius-md)] border-2 border-[var(--brand-soft)] bg-[var(--surface-muted)] p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                  <Clock className="h-4 w-4" />
                  <span>Pending Request for this Lead</span>
                </div>
                {pendingRequestsForThisLead.map((req) => (
                  <div key={req._id} className="p-3 bg-white rounded-xl border border-[var(--border-default)] space-y-2">
                    <p className="text-xs text-[var(--text-secondary)]">Requested by:</p>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{req.requestedBy?.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{req.requestedBy?.email}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        className="flex-1 justify-center gap-1 bg-[var(--brand)] text-xs font-bold py-1.5"
                        loading={processingReqId === req._id}
                        onClick={() => handleApproveRequest(req._id)}
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Approve Request
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 justify-center gap-1 border border-[var(--border-default)] text-[var(--danger)] text-xs font-bold py-1.5 hover:bg-[var(--danger-soft)]"
                        loading={processingReqId === req._id}
                        onClick={() => handleRejectRequest(req._id)}
                      >
                        <UserX className="h-3.5 w-3.5" /> Reject Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Control - Only enabled if Admin or Member assigned to lead */}
            <StatusControl
              value={selectedLead.status}
              disabled={mutating || (!isAdmin && !isAssignedToCurrentMember)}
              onChange={handleStatusChange}
            />

            {isAdmin ? (
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Direct Manual Assignment:</p>
                <AssignmentControl value={assignedId} users={users} disabled={mutating} onChange={handleAssign} />
              </div>
            ) : (
              <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-muted)] p-4 space-y-3">
                <div className="text-sm text-[var(--text-secondary)]">
                  Assigned to:{" "}
                  <span className="font-bold text-[var(--text-primary)]">
                    {selectedLead.assignedTo?.name || "Unassigned"}
                  </span>
                </div>

                {isUnassigned && (
                  <div>
                    {memberReq?.status === "pending" ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-[var(--warning-soft)] px-4 py-2 text-xs font-bold text-[var(--warning)] border border-[var(--warning)]/30">
                        <Clock className="h-4 w-4" /> Request Pending — Waiting for Admin Review
                      </div>
                    ) : memberReq?.status === "rejected" ? (
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--danger-soft)] px-4 py-2 text-xs font-bold text-[var(--danger)] border border-[var(--danger)]/30">
                          <XCircle className="h-4 w-4" /> Previous Request Rejected by Admin
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Admin reviewed your previous request and kept the lead available. You can resubmit your request below.
                        </p>
                        <Button
                          className="w-full justify-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-xs font-bold mt-2"
                          loading={requesting}
                          onClick={handleRequestLead}
                        >
                          <Send className="h-3.5 w-3.5" /> Request Lead Again
                        </Button>
                      </div>
                    ) : memberReq?.status === "approved" ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-[var(--success-soft)] px-4 py-2 text-xs font-bold text-[var(--success)] border border-[var(--success)]/30">
                        <CheckCircle2 className="h-4 w-4" /> Request Approved — Lead Assigned to You!
                      </div>
                    ) : (
                      <Button
                        className="w-full justify-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-xs font-bold"
                        loading={requesting}
                        onClick={handleRequestLead}
                      >
                        <Send className="h-3.5 w-3.5" /> Request Lead
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {mutating ? <p className="text-xs font-medium text-[var(--brand)]">Saving change…</p> : null}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <NotesPanel
          notes={selectedLead.notes || []}
          onAddNote={handleAddNote}
          loading={mutating || (!isAdmin && !isAssignedToCurrentMember)}
        />
        <ActivityTimeline activities={activity} status={activityStatus} error={activityError} onRetry={refreshActivity} />
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </section>
  );
};

export default LeadDetailPage;
