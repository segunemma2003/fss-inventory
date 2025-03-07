import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { ReactNode, useState } from "react";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | ReactNode;
  containerClass?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  helperText?: string;
  inputClass?: string;
  inputLength?: number;
};

export type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label?: string | ReactNode;
  containerClass?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  rows?: number;
  helperText?: string;
  inputClass?: string;
  inputLength?: number;
};

export const TextInput = (props: TextInputProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        props.containerClass ?? ""
      }`}
    >
      {/* <Label className="mb-2 text-sm font-medium text-gray-900">
        {props.label}
      </Label> */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:ring-1">
          {props.startAdornment && (
            <span className="pl-3">{props.startAdornment}</span>
          )}
          <Input
            {...props}
            className="w-full py-2.5 px-3 text-sm rounded-l-none text-gray-900 border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
          />
          {props.endAdornment && (
            <span className="pr-3">{props.endAdornment}</span>
          )}
        </div>
        {props.error && (
          <span className="absolute text-xs text-red-500 mt-1">
            {props.error}
          </span>
        )}
      </div>
    </div>
  );
};

export const TextArea = (props: TextAreaProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        props.containerClass ?? ""
      }`}
    >
      <Label className="flex flex-col justify-center text-sm whitespace-nowrap text-stone-900">
        {props.label}
      </Label>
      <div className="flex items-center bg-white rounded-lg border border-solid border-stone-300 py-1 mt-2 px-3 gap-1">
        <span>{props.startAdornment}</span>
        <Textarea
          {...props}
          className="w-full text-sm leading-5 border-0 text-stone-400 !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs placeholder:text-gray-300 flex-1 focus-visible:ring-offset-0"
        />
        <span>{props.endAdornment}</span>
      </div>
      <span className="text-xs text-red-500 mt-1">{props.error}</span>
    </div>
  );
};

export function TextPassword(props: TextInputProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div
      className={cn("lex flex-col font-medium w-full", props.containerClass)}
    >
      {/* Password input field with toggle visibility button */}
      <div className="space-y-2 w-full">
        {/* <Label htmlFor={props.name}>{props.label}</Label> */}
        <div className="relative">
          <div className="flex items-center rounded-lg border border-gray-300 focus-within:ring-1">
            {props.startAdornment && (
              <span className="pl-3">{props.startAdornment}</span>
            )}

            <Input
              {...props}
              id={props.name}
              className="w-full py-2.5 px-3 text-sm text-gray-900 border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
            />

            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? (
                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Eye size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <p
        className="mt-1 text-xs text-[#64748B] font-sans"
        role="alert"
        aria-live="polite"
      >
        {props.helperText}
      </p>
      <span className="text-xs text-red-500 mt-1">{props.error}</span>
    </div>
  );
}
