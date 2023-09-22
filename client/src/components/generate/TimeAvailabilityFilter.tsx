import { useState, useCallback } from "react";
import { Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, BoxProps } from "@chakra-ui/react";

interface TimeAvailabilityFilterProps extends BoxProps {
  onTimeChange: (time: number) => void;
}

const TimeAvailabilityFilter: React.FC<TimeAvailabilityFilterProps> = ({ onTimeChange, ...props }) => {
  const [timeValue, setTimeValue] = useState<number>(0);

  const handleSliderChange = useCallback(
    (value: number) => {
      setTimeValue(value);
      onTimeChange(value);
    },
    [onTimeChange],
  );

  return (
    <Box {...props}>
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
