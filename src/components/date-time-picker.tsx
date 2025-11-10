'use client';

import * as React from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isTimePickerOpen, setIsTimePickerOpen] = React.useState(false);

  const hasTime = date ? date.getHours() !== 0 || date.getMinutes() !== 0 : false;
  const [timeEnabled, setTimeEnabled] = React.useState(hasTime);

  React.useEffect(() => {
     const newHasTime = date ? date.getHours() !== 0 || date.getMinutes() !== 0 : false;
     setTimeEnabled(newHasTime);
  }, [date])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      if (date) {
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        setDate(newDate);
      }
      return;
    }
    const [hours, minutes] = value.split(':').map(Number);
    if (date && !isNaN(hours) && !isNaN(minutes)) {
        const newDateWithTime = setMinutes(setHours(date, hours), minutes);
        setDate(newDateWithTime);
    }
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if(!selectedDate) {
        setDate(undefined);
        return;
    };
    if (date && timeEnabled) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const newDate = setMinutes(setHours(selectedDate, hours), minutes);
        setDate(newDate);
    } else {
        setDate(selectedDate);
    }
  }

  const handleTimeToggle = (checked: boolean) => {
    setTimeEnabled(checked);
    if (!checked && date) {
        // Reset time to midnight if toggled off
        const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
        setDate(newDate);
    } else if (checked && date) {
        // Set a default time if toggled on and date exists, e.g., 9:00 AM
        const newDateWithTime = setMinutes(setHours(date, 9), 0);
        setDate(newDateWithTime);
    }
  }

  const timeValue = date && timeEnabled ? format(date, 'HH:mm') : '';
  const dateHasTime = date && (date.getHours() !== 0 || date.getMinutes() !== 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateHasTime ? 'PPP p' : 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="time-toggle" className={cn("text-sm", !date && "text-muted-foreground")}>Add Time</Label>
                  <Switch id="time-toggle" checked={timeEnabled} onCheckedChange={handleTimeToggle} disabled={!date} />
                </div>
                {timeEnabled && (
                    <Input
                        id="time"
                        type="time"
                        value={timeValue}
                        onChange={handleTimeChange}
                    />
                )}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
