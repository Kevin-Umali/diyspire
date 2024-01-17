import { CheckCircle, Timer, XCircle } from "lucide-react";

const Legend: React.FC = () => {
  return (
    <ul className="mb-4 flex list-none justify-center space-x-4">
      <li className="flex items-center">
        <CheckCircle className="h-4 w-4 text-green-500" aria-label="No known issues" />
        <span className="ml-2 text-xs">No known issues</span>
      </li>
      <li className="flex items-center">
        <Timer className="h-4 w-4 text-blue-500" aria-label="Maintenance" />
        <span className="ml-2 text-xs">Maintenance</span>
      </li>
      <li className="flex items-center">
        <XCircle className="h-4 w-4 text-red-500" aria-label="Outage" />
        <span className="ml-2 text-xs">Outage</span>
      </li>
    </ul>
  );
};

export default Legend;
