import { useState } from "react";
import { Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";

interface TimeAvailabilityFilterProps {
  onTimeChange: (time: number) => void;
}

const TimeAvailabilityFilter: React.FC<TimeAvailabilityFilterProps> = ({ onTimeChange }) => {
  const [timeValue, setTimeValue] = useState<number>(0);

  const handleSliderChange = (value: number) => {
    setTimeValue(value);
    onTimeChange(value);
  };

  return (
    <Box>
      <Text mb={2}>
        Available Time: {timeValue} hour{timeValue > 1 ? "s" : ""}
      </Text>
      <Slider defaultValue={0} min={0} max={24} onChange={handleSliderChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb></SliderThumb>
      </Slider>
    </Box>
  );
};

export default TimeAvailabilityFilter;
