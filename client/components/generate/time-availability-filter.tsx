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
    <div className={`space-y-4 border px-4 pb-10 pt-5 sm:px-20 ${className}`}>
      <div className="mb-2 flex flex-col items-center text-center sm:flex-col sm:items-center sm:text-center">
        <div className="mb-2 flex flex-col items-center space-x-0 sm:mb-0 sm:flex-row sm:space-x-2">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border sm:mb-0 sm:mr-2">5</div>
          <Label className="text-md block font-medium">What&apos;s your available time?</Label>
        </div>
        <Label className="text-xs">Choose a duration and unit for your available time</Label>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Input type="number" value={timeValue} min="0" onChange={(e) => onValueChange(Number(e.target.value))} placeholder="Duration" />
        <Select onValueChange={(e) => onUnitChange(e)} defaultValue={timeUnit ?? undefined} aria-label="Select time unit">
          <SelectTrigger aria-label="Select a purpose for the end result">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent aria-label="Select a purpose for the end result">
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
