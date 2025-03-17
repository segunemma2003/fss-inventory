"use client";

import { Label } from "./label";
import { Switch } from "./switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useId } from "react";

type ThemeSwitchProps = {
  checked?: boolean;
  setChecked?: (checked: boolean) => void;
}

export default function ThemeSwitch({ checked = false, setChecked }: ThemeSwitchProps) {
  const id = useId();

  return (
    <div>
      <div className="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={setChecked}
          className="peer data-[state=checked]:bg-slate-200/50 data-[state=unchecked]:bg-slate-200/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="peer-data-[state=checked]:text-muted pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center text-muted-foreground">
          <MoonIcon size={14} aria-hidden="true" />
        </span>
        <span className="peer-data-[state=unchecked]:!text-muted-foreground/20 text-muted-foreground pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
          <SunIcon size={14} aria-hidden="true" />
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Dark mode switch
      </Label>
    </div>
  );
}
