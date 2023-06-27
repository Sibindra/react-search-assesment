import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface CategoriesProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

export default function Categories(props: CategoriesProps) {
  const { category, onCategoryChange } = props;

  const handleChange = (event: SelectChangeEvent) => {
    onCategoryChange(event.target.value as string);
  };

  const options = [
    "None",
    "Men's clothing",
    "Jewelry",
    "Electronics",
    "Women's clothing",
  ];

  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label="Category"
            onChange={handleChange}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}
