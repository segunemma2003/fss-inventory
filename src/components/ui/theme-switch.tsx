"use client";

import { Label } from "./label";
import { Switch } from "./switch";
import { MoonIcon, SunIcon } from "lucide-react";
import { useId } from "react";

type ThemeSwitchProps = {
  checked?: boolean;
  setChecked?: (checked: boolean) => void;
}

export default function ThemeSwitch({ checked = true, setChecked }: ThemeSwitchProps) {
  const id = useId();

  return (
    <div>
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={setChecked}
          className="peer data-[state=checked]:bg-slate-200/50 data-[state=unchecked]:bg-slate-200/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full dark:data-[state=checked]:bg-slate-800/50 dark:data-[state=unchecked]:bg-slate-800/50"
        />
        <span className="peer-data-[state=checked]:text-slate-500/70 pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center dark:peer-data-[state=checked]:text-slate-400/70">
          <MoonIcon size={16} aria-hidden="true" />
        </span>
        <span className="peer-data-[state=unchecked]:text-slate-500/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center dark:peer-data-[state=unchecked]:text-slate-400/70">
          <SunIcon size={16} aria-hidden="true" />
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Dark mode switch
      </Label>
    </div>
  );
}
