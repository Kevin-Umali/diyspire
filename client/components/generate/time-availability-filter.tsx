import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeAvailabilityFilterProps {
  timeValue: number;
  timeUnit: string | null;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: string) => void;
  className?: string;
}

const TimeAvailabilityFilter: React.FC<TimeAvailabilityFilterProps> = ({ timeValue, timeUnit, onValueChange, onUnitChange, className }) => {
  return (
    <div className={className}>
      <Label className="text-md mb-2 block font-medium">
        Available Time:
        {timeValue > 0 && timeUnit ? ` ${timeValue} ${timeUnit}` : ""}
      </Label>
      <div className="flex space-x-4">
        <Input type="number" value={timeValue} min="0" onChange={(e) => onValueChange(Number(e.target.value))} className="w-20" />
        <Select onValueChange={(e) => onUnitChange(e)} defaultValue={timeUnit ?? undefined} aria-label="Select time unit">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time Units</SelectLabel>
              {["minutes", "hours", "days", "weeks", "months"].map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}(s)
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeAvailabilityFilter;
