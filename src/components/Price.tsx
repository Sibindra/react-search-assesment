import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface PriceProps {
  price: string;
  onPriceChange: (value: string) => void;
}

export default function Price({ price, onPriceChange }: PriceProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onPriceChange(value);
  };

  const priceOptions = [
    { label: "None", value: "None" },
    { label: "less than $20", value: "<20" },
    { label: "less than $50", value: "<50" },
    { label: "less than $100", value: "<100" },
    { label: "less than $200", value: "<200" },
    { label: "less than $500", value: "<500" },
    { label: "less than $700", value: "<700" },
    { label: "less than $1000", value: "<1000" },
    { label: "less than $5000", value: "<5000" },
  ];

  return (
    <div className="p-2">
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Price</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={price}
            label="Price"
            onChange={handleChange}
          >
            {priceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
