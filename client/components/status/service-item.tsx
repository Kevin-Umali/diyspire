import { statusIcons } from "@/constants";
import { ServiceStatusType } from "@/interfaces";

interface ServiceItemProps {
  name: string;
  status: ServiceStatusType;
  message: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ name, status, message }) => {
  const StatusIcon = statusIcons[status];

  const statusColorMap: Record<ServiceStatusType, string> = {
    Normal: "text-green-500",
    Maintenance: "text-blue-500",
    Outage: "text-red-500",
  };

  const iconColorClass = statusColorMap[status] || "";

  return (
    <div className="rounded border border-green-500 p-2">
      <div className="flex items-center">
        <StatusIcon className={`size-4 ${iconColorClass}`} alt={status} />
        <span className="ml-2 text-sm font-medium">{name}</span>
      </div>
      <p className="mt-1 text-xs">{message}</p>
    </div>
  );
};

export default ServiceItem;
