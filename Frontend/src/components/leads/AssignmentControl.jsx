import Select from "../common/Select.jsx";

const AssignmentControl = ({ value, users = [], disabled, onChange }) => (
  <Select label="Assigned To" value={value || ""} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
    <option value="" disabled>
      Select assignee
    </option>
    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name} ({user.role})
      </option>
    ))}
  </Select>
);

export default AssignmentControl;
