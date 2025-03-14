import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  LoaderCircleIcon,
  Paperclip,
  SearchIcon,
} from "lucide-react";
import { ReactNode, useId, useState } from "react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

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

export type TextFileProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  helperText?: string;
  files: File[] | null;
  onChange: (value: File[] | null) => void;
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
        <div className="flex items-center bg-whit rounded-lg border border-gray-300 focus-within:ring-1">
          {props.startAdornment && (
            <span className="pl-3 text-muted-foreground">
              {props.startAdornment}
            </span>
          )}
          <Input
            {...props}
            className="w-full py-2.5 px-3 text-sm rounded-l-none bg-transparent focus-visible:ring-offset-0 focus:right-0 focus-visible:outline-none focus-visible:ring-0 text-muted-foreground border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
          />
          {props.endAdornment && (
            <span className="pr-3">{props.endAdornment}</span>
          )}
        </div>
        {props.error && (
          <span className="block text-xs text-red-500 mt-1">{props.error}</span>
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
      <div className="flex items-baseline bg-transparent text-muted-foreground rounded-lg border border-solid border-stone-300 py-1 mt-2 px-3 gap-1">
        <span>{props.startAdornment}</span>
        <Textarea
          {...props}
          className="w-full text-sm leading-5 border-0 text-muted-foreground !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs placeholder:text-muted flex-1 focus-visible:ring-offset-0"
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
              <span className="pl-3 text-muted-foreground">
                {props.startAdornment}
              </span>
            )}

            <Input
              {...props}
              id={props.name}
              className="w-full py-2.5 px-3 text-sm bg-transparent focus-visible:ring-offset-0 focus:right-0 focus-visible:outline-none focus-visible:ring-0 text-gray-900 border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
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

export default function TextSearch(
  props: TextInputProps & { isLoading?: boolean }
) {
  const id = useId();

  return (
    <div className="*:not-first:mt-2">
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className="peer ps-9 pe-9 w-96"
          placeholder="Search..."
          type="search"
          {...props}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          {props.isLoading ? (
            <LoaderCircleIcon
              className="animate-spin"
              size={16}
              role="status"
              aria-label="Loading..."
            />
          ) : (
            <SearchIcon size={16} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-primary">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

export const TextFileUploader = (
  props: TextFileProps & { value: File[] | null; element: JSX.Element }
) => {
  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const handleFile = (files: File[] | null) => {
    props?.onChange?.(files);
  };

  return (
    <>
      <FileUploader
        {...props}
        value={props.value} 
        onValueChange={handleFile}
        dropzoneOptions={dropZoneConfig}
        className={cn(
          "relative bg-background rounded-lg",
          props.containerClass
        )}
      >
        <FileInput className="outline-dashed outline-1 outline-white bg-accent min-h-40">
          <div className="flex items-center justify-center h-full flex-col pb-4 w-full ">
            {props.element}
          </div>
        </FileInput>
        <FileUploaderContent>
          {props.value &&
            props.value.length > 0 &&
            props.value?.map?.((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      <span className="text-xs text-red-500 mt-1">{props.error}</span>
    </>
  );
};
