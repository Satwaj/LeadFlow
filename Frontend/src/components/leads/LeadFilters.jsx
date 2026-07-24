import Button from "../common/Button.jsx";
import Select from "../common/Select.jsx";
import { STATUS_OPTIONS } from "../../utils/constants.js";

const LeadFilters = ({ filters, users = [], isAdmin, onChange, onClear }) => (
  <div className="panel mb-5 flex flex-col gap-3 p-4 md:flex-row md:items-end md:justify-between">
    <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Select label="Status" value={filters.status} onChange={(event) => onChange({ status: event.target.value })}>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {isAdmin ? (
        <Select label="Assigned to" value={filters.assignedTo} onChange={(event) => onChange({ assignedTo: event.target.value })}>
          <option value="">All assignees</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </Select>
      ) : null}
    </div>
    <Button variant="ghost" onClick={onClear}>
      Clear filters
    </Button>
  </div>
);

export default LeadFilters;
