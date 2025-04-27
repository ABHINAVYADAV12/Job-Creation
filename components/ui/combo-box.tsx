"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboBoxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  heading: string; // Heading is now used in the UI
}

const ComboBox = ({ options, value, onChange, heading }: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white border border-gray-300 shadow-2xl rounded-xl">
        <Command>
          {/* Display heading inside the dropdown */}
          <div className="px-3 py-2 text-base font-semibold border-b bg-gray-50 text-gray-800 rounded-t-xl">
            {heading}
          </div>

          <CommandInput placeholder="Search category..." className="bg-gray-100 rounded mt-2 mb-2 px-2 py-2 text-gray-800 border border-gray-200 focus:border-blue-400" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(selectedLabel) => {
                    const selectedOption = options.find(opt => opt.label === selectedLabel);
                    if (selectedOption) {
                      onChange(selectedOption.value); // Pass the ID back
                    }
                    setOpen(false); // Close dropdown
                  }}
                  className="text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors cursor-pointer rounded"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100 text-blue-600" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
