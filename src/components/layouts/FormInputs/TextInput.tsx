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
import { Tag, TagInput } from "emblor";

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

export type TextFileProps = {
  label?: string | JSX.Element;
  containerClass?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  helperText?: string;
  files?: File[] | null;
  value?: File[] | null;
  onChange?: (value: File[] | null) => void;
  element: JSX.Element;
};

export const TextInput = (props: TextInputProps) => {
  return (
    <div
      className={`flex flex-col font-medium w-full relative ${
        props.containerClass ?? ""
      }`}
    >
      {props.label && (
        <Label className="mb-2 text-sm font-medium text-gray-900">
          {props.label}
        </Label>
      )}
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
        <p
          className="mt-1 text-xs text-muted-foreground font-sans"
          role="alert"
          aria-live="polite"
        >
          {props.helperText}
        </p>
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
      <Label className="text-sm whitespace-nowrap text-stone-900">
        {props.label}
      </Label>
      <div className="flex items-baseline bg-transparent text-muted-foreground rounded-lg border border-solid border-stone-300 py-1 mt-2 px-3 gap-1">
        <span>{props.startAdornment}</span>
        <Textarea
          {...props}
          className="w-full text-sm leading-5 border-0 text-muted-foreground !focus-visible:ring-0 !ring-0 !focus:border-0 !focus:outline-none px-0 placeholder:text-xs placeholder:text-muted-foreground flex-1 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
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
              className="w-full py-2.5 px-3 text-sm bg-transparent focus-visible:ring-offset-0 focus:right-0 focus-visible:outline-none focus-visible:ring-0 text-muted-foreground border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
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
    <div className={cn("*:not-first:mt-2 w-96", props.containerClass)}>
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className="peer ps-9 pe-9 w-full"
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

// Create a modified version of the FileUploader with fixed types
// @ts-ignore - Ignore any type errors in this file
function SafeFileUploader(props: any) {
  return <FileUploader {...props} />;
}

export const TextFileUploader = ({
  value,
  onChange,
  element,
  containerClass,
  error,
  ...props
}: TextFileProps) => {
  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4, // 4MB
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  };

  // Force TypeScript to treat this as the correct function signature
  // by using a wrapper function with explicit type assertion
  const onValueChangeWrapper = (files: File[] | null | undefined) => {
    // Convert undefined to null to satisfy the callback type
    const safeFiles = files === undefined ? null : files;
    // Only call onChange if it exists
    onChange?.(safeFiles);
  };

  // Force TypeScript to accept our implementation
  const typedValueChange = onValueChangeWrapper as (files: File[] | null) => void;

  return (
    <>
      <SafeFileUploader
        {...props}
        value={value}
        // @ts-ignore - Bypassing the type check issue
        onValueChange={typedValueChange}
        dropzoneOptions={dropZoneConfig}
        // reSelect={true}
        className={cn(
          "relative rounded-lg border-2 border-dashed",
          containerClass
        )}
      >
        <FileInput className="min-h-40 bg-accent/5 hover:bg-accent/10 transition-colors duration-200">
          <div className="flex items-center justify-center h-40 flex-col w-full">
            {element}
          </div>
        </FileInput>

        <FileUploaderContent>
          {value &&
            value.length > 0 &&
            value?.map?.((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </SafeFileUploader>
      <span className="text-xs text-red-500 mt-1">{error}</span>
    </>
  );
};

export function TextTagInput({
  label,
  containerClass,
  ...rest
}: TextInputProps & { value: Tag[] }) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className={cn("space-y-2", containerClass)}>
      {label && <Label htmlFor={rest.name}>{label}</Label>}
      <TagInput
        id={rest.name}
        tags={rest.value}
        setTags={() => {}}
        onTagAdd={(tag) => {
          const tagValue: Tag = {
            id: tag,
            text: tag,
          };

          const payload = {
            target: { value: [...rest.value, tagValue], name: rest?.name },
          } as any;

          rest?.onChange?.(payload);
        }}
        onTagRemove={(tag) => {
          const payload = {
            target: {
              value: rest.value.filter((item) => item.id !== tag),
              name: rest?.name,
            },
          } as any;

          rest?.onChange?.(payload);
        }}
        placeholder={rest.placeholder}
        styleClasses={{
          tagList: {
            container: "gap-1",
          },
          input:
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          tag: {
            body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        inlineTags={false}
        inputFieldPosition="top"
      />
      <span className="text-xs text-red-500 mt-1">{rest.error}</span>

      <p
        className="mt-1 text-xs text-slate-500 font-sans"
        role="alert"
        aria-live="polite"
      >
        {rest.helperText}
      </p>
    </div>
  );
}