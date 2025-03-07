import { Button } from "@/components/ui/button";
import { FeatureTag } from "./FeatureTag";

export function FeatureSection() {
  const features = [
    "Automate Your Inventory",
    "Simplify Your Sales Process",
    "Maximize Your Efficiency",
    "Optimize Your Operations",
    "Scalable Inventory Management",
    "Stay on Top of Your Sales",
  ];

  return (
    <section className="overflow-hidde">
      <div className="flex overflow-hidden flex-col w-full max-md:max-w-full">
        <div className="flex max-w-full text-4xl tracking-tighter leading-10 text-neutral-900 px-5 mb-10">
          <h2 className="grow shrink w-[615px] max-md:max-w-full font-urbanist font-medium">
            Inventory Management, Made Easy
            <br />
            For You!
          </h2>
          {/* <Button
            onClick={() => navigate(-1)}
            size={"icon"}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button> */}
        </div>

        <div className="relative pt-0.5 w-full h-[70dvh] text-base text-muted max-md:px-5 max-md:pb-24 max-md:max-w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/63a5d0c4099f2618eee8a6440abe1e510254ee9672ea2825bf27721d84fa4a41?placeholderIfAbsent=true"
            alt="Background"
            className="object-cover h-full w-full static"
          />

          <div className="flex absolute flex-wrap gap-x-3 bg-linear-to-b pl-5 from-white h-60 to-white/20 py-2 items-center mb-0 w-full max-md:mb-2.5 max-md:max-w-full">
            {features.map((feature, index) => (
              <FeatureTag key={index} text={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
