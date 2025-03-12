interface FeatureTagProps {
  text: string;
}

export function FeatureTag({ text }: FeatureTagProps) {
  return (
    <div className="overflow-hidden px-3 py-2 my-auto bg-primary border border-primary border-solid rounded-[100px] text-xs text-center text-accent-foreground font-semibold font-urbanist">
      {text}
    </div>
  );
}
