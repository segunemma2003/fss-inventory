interface FeatureTagProps {
  text: string;
}

export function FeatureTag({ text }: FeatureTagProps) {
  return (
    <div className="overflow-hidden px-3 py-3 my-auto bg-red-600 border border-accent border-solid rounded-[100px] min-h-12 text-base text-center text-accent font-bold font-urbanist">
      {text}
    </div>
  );
}
