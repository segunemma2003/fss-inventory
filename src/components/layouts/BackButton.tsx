import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

type BackButtonProps = {
  title?: string;
  onClick?: () => void;
};

export const BackButton = ({ title, onClick }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        typeof onClick !== "undefined" ? onClick() : navigate(-1);
      }}
      className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground"
    >
      <ChevronLeft className="h-5 w-5" />
      <p className="text-base">{title}</p>
    </div>
  );
};
