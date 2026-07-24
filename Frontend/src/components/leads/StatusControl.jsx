import { LEAD_STATUSES } from "../../utils/constants.js";
import Select from "../common/Select.jsx";

const StatusControl = ({ value, disabled, onChange }) => (
  <Select label="Status" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
    {LEAD_STATUSES.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </Select>
);

export default StatusControl;
