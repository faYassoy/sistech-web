import { Input } from "@/components/ui/input";
import { useState } from "react";

type InputCurrencyProps = React.InputHTMLAttributes<HTMLInputElement>

const InputCurrency: React.FC<InputCurrencyProps> = ({ value, onChange, ...props }) => {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value as number | string));

  function formatCurrency(num: number | string) {
    if (!num) return "";
    return Number(num).toLocaleString("id-ID");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setDisplayValue(formatCurrency(rawValue)); 

    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: rawValue },
      });
    }
  }

  return (
    <Input 
      {...props} 
      value={displayValue} 
      onChange={handleChange} 
      inputMode="numeric" 
    />
  );
};

export default InputCurrency;
