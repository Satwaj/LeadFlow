import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShieldCheck, UserCheck, UserX, XCircle } from "lucide-react";
import Button from "../components/common/Button.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Toast from "../components/common/Toast.jsx";
import {
  approveLeadRequest,
  fetchLeadRequests,
  rejectLeadRequest,
} from "../redux/slices/leadRequestSlice.js";
import { formatDate } from "../utils/formatDate.js";

const AdminLeadRequestsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, status, error } = useSelector((state) => state.leadRequests);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit, setHistoryLimit] = useState(5);

  useEffect(() => {
    dispatch(fetchLeadRequests());
  }, [dispatch]);

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    const result = await dispatch(approveLeadRequest(requestId));
    setProcessingId(null);

    if (approveLeadRequest.fulfilled.match(result)) {
      setToast("Lead assigned successfully.");
      dispatch(fetchLeadRequests());
    } else {
      setToast(result.payload || "Could not approve lead request.");
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    const result = await dispatch(rejectLeadRequest(requestId));
    setProcessingId(null);

    if (rejectLeadRequest.fulfilled.match(result)) {
      setToast("Lead request rejected.");
      dispatch(fetchLeadRequests());
    } else {
      setToast(result.payload || "Could not reject lead request.");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="panel p-8 text-center max-w-lg mx-auto mt-10">
        <span className="inline-block rounded-full bg-[var(--danger-soft)] px-3 py-1 text-xs font-semibold text-[var(--danger)]">
          Access Restricted
        </span>
        <h2 className="mt-4 text-2xl font-bold">Admin Permission Required</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Only LeadFlow Administrators can review and approve Lead Requests.
        </p>
        <div className="mt-6">
          <Link to="/app/dashboard">
            <Button variant="secondary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pendingRequests = items.filter((r) => r.status === "pending");
  const completedRequests = items.filter((r) => r.status !== "pending");

  // Client pagination for completed request history
  const historyTotal = completedRequests.length;
  const historyTotalPages = Math.ceil(historyTotal / historyLimit) || 1;
  const paginatedHistory = completedRequests.slice(
    (historyPage - 1) * historyLimit,
    historyPage * historyLimit
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="border-b border-[var(--border-default)] pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold text-[var(--brand)] uppercase tracking-wider mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Admin Lead Management</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">Lead Requests</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Review Member requests for available active leads. Approving a request assigns the lead to that Member.
        </p>
      </div>

      {status === "loading" ? <Loader label="Loading lead requests" /> : null}
      {status === "failed" ? <ErrorState description={error} onAction={() => dispatch(fetchLeadRequests())} /> : null}

      {status === "succeeded" && items.length === 0 ? (
        <EmptyState
          title="No Lead Requests Yet"
          description="When Team Members request available active leads, their requests will appear here for Admin review."
        />
      ) : null}

      {status === "succeeded" && items.length > 0 ? (
        <div className="space-y-8">
          {/* Pending Requests Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-[var(--brand)]" />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Pending Requests ({pendingRequests.length})
              </h3>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="panel p-6 text-center text-sm text-[var(--text-secondary)] bg-white">
                No pending lead requests awaiting review.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="panel p-6 bg-white border-2 border-[var(--brand-soft)] rounded-[var(--radius-xl)] shadow-md space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--warning-soft)] px-3 py-0.5 text-xs font-bold text-[var(--warning)]">
                          <Clock className="h-3.5 w-3.5" /> Pending Approval
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">{formatDate(req.createdAt)}</span>
                      </div>

                      <h4 className="text-xl font-bold text-[var(--text-primary)]">
                        <Link to={`/app/leads/${req.lead?._id || req.lead}`} className="hover:text-[var(--brand)] hover:underline">
                          {req.lead?.name || "Lead"}
                        </Link>
                      </h4>

                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Company: <span className="font-semibold text-[var(--text-primary)]">{req.lead?.company || "—"}</span> · Service: <span className="font-semibold text-[var(--brand)]">{req.lead?.service}</span>
                      </p>

                      <div className="mt-4 p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-default)]">
                        <p className="text-xs text-[var(--text-secondary)]">Requesting Member:</p>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{req.requestedBy?.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{req.requestedBy?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-default)]">
                      <Button
                        className="flex-1 justify-center gap-1.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-xs font-bold"
                        loading={processingId === req._id}
                        onClick={() => handleApprove(req._id)}
                      >
                        <UserCheck className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 justify-center gap-1.5 border border-[var(--border-default)] text-[var(--danger)] hover:bg-[var(--danger-soft)] text-xs font-bold"
                        loading={processingId === req._id}
                        onClick={() => handleReject(req._id)}
                      >
                        <UserX className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request History Section with Pagination */}
          {completedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Request History</h3>
              <div className="panel overflow-hidden border border-[var(--border-default)] bg-white rounded-[var(--radius-xl)]">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-[var(--surface-muted)] text-xs font-bold uppercase tracking-wider text-[var(--brand)] border-b border-[var(--border-default)]">
                    <tr>
                      <th className="px-6 py-4">Lead</th>
                      <th className="px-6 py-4">Requested By</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Reviewed By</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {paginatedHistory.map((req) => (
                      <tr key={req._id} className="hover:bg-[var(--surface-muted)] transition">
                        <td className="px-6 py-4 font-bold text-[var(--text-primary)]">
                          {req.lead?.name || "Lead"}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold">{req.requestedBy?.name}</td>
                        <td className="px-6 py-4">
                          {req.status === "approved" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--success)]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--danger-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--danger)]">
                              <XCircle className="h-3.5 w-3.5" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--text-secondary)]">
                          {req.reviewedBy?.name || "Admin"}
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--text-muted)]">{formatDate(req.reviewedAt || req.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination
                  pagination={{
                    page: historyPage,
                    limit: historyLimit,
                    total: historyTotal,
                    totalPages: historyTotalPages,
                  }}
                  onPageChange={setHistoryPage}
                  onLimitChange={(newLimit) => {
                    setHistoryLimit(newLimit);
                    setHistoryPage(1);
                  }}
                  limitOptions={[5, 10, 20]}
                />
              </div>
            </div>
          )}
        </div>
      ) : null}

      <Toast message={toast} onClose={() => setToast("")} />
    </motion.section>
  );
};

export default AdminLeadRequestsPage;
