import { cn } from "@/lib/utils";
import { ImageUploader } from "../components/imageUploader";

export function Personal() {
  return (
    <div className="border border-muted-foreground rounded-xl py-3 text-muted-foreground">
      <div className="flex divide gap-10 mb-4 px-3">
        <ImageUploader />
        <div className="flex-1 space-y-6 border-l-2 divide-y">
          <div className="flex flex-wrap items-center gap-2 py-5">
            <TextBox title={"Full Name"} value={"John Doe"} />
            <TextBox title={"Email"} value={"allenjacobs03@gmail.com"} />
            <TextBox title={"Phone"} value={"+234 814 274 9921"} />
            <TextBox title={"Date of Birth"} value={"28/05/1982"} />
            <TextBox title={"Location"} value={"Ibadan"} />
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
      <div className="p-3 flex flex-wrap items-center gap-2 py-5 border-y">
        <TextBox title="Business Address" value="37B Ladipo Latinwo Road" disableBorder />
        <TextBox title="City/Town" value="Gwarimpa" disableBorder />
        <TextBox title="State" value="Abuja" disableBorder />
        <TextBox title="Zip Code" value="105100" disableBorder />
        <TextBox title="Gender" value="Male" disableBorder />
        <TextBox title="Role" value="Administrator" disableBorder />
      </div>
    </div>
  );
}

type TextBox = { title: string; value: string; disableBorder?: boolean };

const TextBox = ({ title, value, disableBorder }: TextBox) => {
  return (
    <div className={cn("text-muted-foreground flex-1 px-5", { "border-l border-accent": !disableBorder })}>
      <h6 className="text-accent-foreground text-xs">{title}</h6>
      <p className="whitespace-nowrap text-nowrap">{value}</p>
    </div>
  );
};
