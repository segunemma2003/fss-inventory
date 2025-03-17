import { Switch } from "@/components/ui/switch";

interface NotificationSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  hasToggle?: boolean;
}

export function NotificationSection({
  title,
  description,
  children,
  checked = true,
  onCheckedChange,
  hasToggle = true,
}: NotificationSectionProps) {
  return (
    <section className="flex justify-between items-center px-8 py-5 border-b border-solid border-b-accent max-sm:flex-col max-sm:items-start">
      <div className="flex-1">
        <h2 className="mb-2.5 text-xl font-bold text-accent-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-[800px] max-md:max-w-[600px]">
            {description}
          </p>
        )}
        {children}
      </div>
      {hasToggle && (
        <div className="max-sm:self-end max-sm:mt-2.5">
          <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
      )}
    </section>
  );
}


interface SubNotificationItemProps {
  title: string;
  description: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function SubNotificationItem({
  title,
  description,
  checked = true,
  onCheckedChange,
}: SubNotificationItemProps) {
  return (
    <div className="flex justify-between items-center mb-5 max-sm:flex-col max-sm:items-start">
      <div className="flex-1">
        <h3 className="mb-1 text-base font-bold text-accent-foreground/80">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="max-sm:self-end max-sm:mt-2.5">
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}
