import { cn } from "@/lib/utils";
import { ImageUploader } from "../components/imageUploader";
import { useUser } from "@/store/authSlice";

export function Personal() {
  const user = useUser();

  return (
    <div className="border border-muted-foreground rounded-xl py-3 text-muted-foreground">
      <div className="flex divide gap-10 mb-4 px-3 py-10">
        <ImageUploader />
        <div className="flex-1 space-y-6 border-l-2 divide-y">
          <div className="flex flex-wrap items-center gap-2 py-5">
            <TextBox title={"Full Name"} value={user?.full_name} />
            <TextBox title={"Email"} value={user?.email} />
            <TextBox title={"Phone"} value={user?.phoneNumber} />
            <TextBox title={"Date of Birth"} value={user?.dateOfBirth} />
            <TextBox title={"Location"} value={user?.businessAddress} />
          </div>
          <div className="pl-5">
            <h6 className="text-accent-foreground text-xs">About</h6>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-wrap items-center gap-2 py-10 border-y">
        <TextBox title="Business Address" value={user?.businessAddress} disableBorder />
        <TextBox title="City/Town" value={user?.country} disableBorder />
        <TextBox title="State" value="" disableBorder />
        <TextBox title="Zip Code" value={user?.zipCode} disableBorder />
        <TextBox title="Gender" value={user?.gender} disableBorder />
        <TextBox title="Role" value={user?.role} disableBorder />
      </div>
    </div>
  );
}

type TextBox = { title: string; value?: string; disableBorder?: boolean };

const TextBox = ({ title, value, disableBorder }: TextBox) => {
  return (
    <div className={cn("text-muted-foreground flex-1 px-5", { "border-l border-accent": !disableBorder })}>
      <h6 className="text-accent-foreground text-xs">{title}</h6>
      <p className="whitespace-nowrap text-nowrap">{value}</p>
    </div>
  );
};
