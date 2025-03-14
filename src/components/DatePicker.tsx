"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  name: string;
  initialDate?: Date | string;
}

export default function DatePicker({ name, initialDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!initialDate) return undefined;
    return typeof initialDate === 'string' ? new Date(initialDate) : initialDate;
  });

  return (
    <>
      {/* Champ caché pour stocker la valeur de la date */}
      <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    </>
  );
}
