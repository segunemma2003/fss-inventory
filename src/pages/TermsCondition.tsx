import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToastHandlers } from "@/hooks/useToaster";
import { patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {}

function TermsCondition(props: Props) {
  const {} = props;
  const navigate = useNavigate();

  const handler = useToastHandlers();

  const {} = useMutation<ApiResponse<any>, ApiResponseError>({
    mutationFn: async (payload) => await patchRequest("", payload),
    onSuccess: (res) => {
      //   if (res?.data?.status === "success") {
      //     navigate("/login");
      //   }
      handler.success("Registration", res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-0">
      <div className="w-full container lg:px-8">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
            alt="Company Logo"
            className="object-contain aspect-[3.6] w-[216px]"
          />
        </div>

        <h2 className="text-4xl mb-3 mt-14 font-bold text-primary font-urbanist">
          Terms and Conditions of Service
        </h2>

        <ScrollArea>
          <div className="h-[65dvh] text-sm font-urbanist space-y-5 px-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum mollis nunc a molestie dictum. Mauris venenatis, felis
              scelerisque aliquet lacinia, nulla nisi venenatis odio, id blandit
              mauris ipsum id sapien. Vestibulum malesuada orci sit amet pretium
              facilisis. In lobortis congue augue, a commodo libero tincidunt
              scelerisque. Donec tempus congue lacinia. Phasellus lacinia felis
              est, placerat commodo odio tincidunt iaculis. Sed felis magna,
            </p>
            <p>
              iaculis a metus id, ullamcorper suscipit nulla. Fusce facilisis,
              nunc ultricies posuere porttitor, nisl lacus tincidunt diam, vel
              feugiat nisi elit id massa. Proin nulla augue, dapibus non justo
              in, laoreet commodo nunc. Maecenas faucibus neque in nulla mollis
              interdum. Quisque quis pellentesque enim, vitae pulvinar purus.
              Quisque vitae suscipit risus. Curabitur scelerisque magna a
              interdum pretium. Integer sodales metus ut placerat viverra.
            </p>
            <p>
              Curabitur accumsan, odio quis vehicula imperdiet, tellus ex
              venenatis nisl, a dignissim lectus augue tincidunt arcu. Fusce
              aliquam libero non venenatis lobortis. Vivamus euismod
              sollicitudin congue. Proin orci est, euismod nec nisi ut, faucibus
              dapibus diam. Suspendisse sodales volutpat posuere. Ut neque
              velit, placerat id commodo congue, aliquam quis risus. Praesent
              nibh ante, aliquet et viverra ut, luctus a felis. Vivamus
              efficitur orci erat, sed scelerisque diam accumsan sed. Aenean
              tincidunt erat lectus, venenatis condimentum magna interdum et.
            </p>
            <p>
              Nullam euismod orci eget tristique eleifend. Suspendisse eleifend
              felis vitae libero ultricies, non tempus lacus ornare. Mauris nibh
              dolor, vehicula at justo quis, egestas bibendum purus. Donec
              varius lorem at tincidunt aliquam. Nulla facilisi. Praesent
              condimentum, mi quis cursus sollicitudin, erat lacus ornare magna,
              quis cursus est erat in diam. In rutrum vel purus eget fermentum.
            </p>
            <p>
              lacus mollis ut. Nulla rhoncus placerat arcu. Donec eu risus
              turpis. Mauris quis orci augue. Donec rhoncus lacus vel lobortis
              pulvinar. In laoreet ex ante, nec bibendum odio tristique feugiat.
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Nam malesuada egestas nisi. Sed
              facilisis tempus orci, quis maximus purus congue quis. Nulla
              bibendum interdum enim in euismod. In quis elit fermentum,
              condimentum lacus a, rutrum felis. Nullam mattis mauris sit amet
              cursus mollis. Cras auctor consectetur enim, et porttitor tellus
              molestie sed. Suspendisse eu elit ipsum. Vivamus pretium sed nibh
              ut mollis. Cras facilisis nulla ac nisl pharetra fermentum. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Fusce in dolor a ipsum tincidunt porttitor nec
              eget turpis. Sed non nisi non neque placerat dapibus. In in
              efficitur nulla. Sed molestie vel risus ut semper. Duis elementum
              pulvinar massa nec lacinia. Fusce et imperdiet diam, ac
              sollicitudin elit. Vivamus rhoncus venenatis enim sed sagittis.
              Pellentesque at nunc feugiat, dictum elit sed, blandit ligula.
              Proin egestas elit quis lacus dignissim, et tristique dui dapibus.
              Sed ac sollicitudin mi. Suspendisse tincidunt nisl sit amet eros
              maximus rhoncus. Sed efficitur purus sed diam ultricies accumsan.
            </p>
            <p>
              In quis felis neque. Sed bibendum id nibh at euismod. Duis nec
              sapien commodo, interdum ante eget, suscipit tortor. Proin id
              augue vitae nunc egestas pharetra. Etiam in molestie enim. Quisque
              vulputate vulputate leo, vitae consectetur libero dictum
              venenatis. Aenean dapibus nulla nisi. Nunc vitae diam sit amet
              magna egestas scelerisque. Curabitur viverra viverra purus vitae
              interdum. Phasellus venenatis risus erat, eu dictum leo aliquam
              vel. Aenean ut leo sem. Pellentesque commodo turpis sed lorem
              ullamcorper, id elementum magna pretium. Maecenas tincidunt ipsum
              libero, efficitur porttitor erat accumsan id. Etiam consectetur
              vulputate libero vitae fringilla. Duis interdum tincidunt justo,
              id ultrices lacus mollis ut. Nulla rhoncus placerat arcu. Donec eu
              risus turpis. Mauris quis orci augue. Donec rhoncus lacus vel
              lobortis pulvinar. In laoreet ex ante, nec bibendum odio tristique
              feugiat. Pellentesque habitant morbi tristique senectus et netus
              et malesuada fames ac turpis egestas. Nam malesuada egestas nisi.
              Sed facilisis tempus orci, quis maximus purus congue quis. Nulla
              bibendum interdum enim in euismod. In quis elit fermentum,
              condimentum lacus a, rutrum felis. Nullam mattis mauris sit amet
              cursus mollis. Cras auctor consectetur enim, et porttitor tellus
              molestie sed. Suspendisse eu elit ipsum. Vivamus pretium sed nibh
              ut mollis. Cras facilisis nulla ac nisl pharetra fermentum. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Fusce in dolor a ipsum tincidunt porttitor nec
              eget turpis. Sed non nisi non neque placerat dapibus.
            </p>
            <p>
              accumsan sit amet ligula. Quisque vel consequat elit, in eleifend
              dui. Aliquam dictum dui nec arcu semper, eu suscipit est feugiat.
              Praesent dignissim nec mi vel ornare. Quisque quis leo nunc. Cras
              eu porttitor arcu. Mauris tempus elit in mauris viverra, sit amet
              vestibulum risus dictum. Maecenas in congue leo, quis tempor nunc.
              Sed ornare mattis sagittis. In cursus aliquam mauris eu eleifend.
              Mauris non tristique arcu. In hac habitasse platea dictumst. Sed
              sed cursus mauris. Integer eu pellentesque ante, elementum
              hendrerit dolor. Praesent aliquam tristique orci vel fermentum.
            </p>
            <p>
              accumsan sit amet ligula. Quisque vel consequat elit, in eleifend
              dui. Aliquam dictum dui nec arcu semper, eu suscipit est feugiat.
              Praesent dignissim nec mi vel ornare. Quisque quis leo nunc. Cras
              eu porttitor arcu. Mauris tempus elit in mauris viverra, sit amet
              vestibulum risus dictum. Maecenas in congue leo, quis tempor nunc.
              Sed ornare mattis sagittis. In cursus aliquam mauris eu eleifend.
              Mauris non tristique arcu. In hac habitasse platea dictumst. Sed
              sed cursus mauris. Integer eu pellentesque ante, elementum
              hendrerit dolor. Praesent aliquam tristique orci vel fermentum.
            </p>
            <p>
              accumsan sit amet ligula. Quisque vel consequat elit, in eleifend
              dui. Aliquam dictum dui nec arcu semper, eu suscipit est feugiat.
              Praesent dignissim nec mi vel ornare. Quisque quis leo nunc. Cras
              eu porttitor arcu. Mauris tempus elit in mauris viverra, sit amet
              vestibulum risus dictum. Maecenas in congue leo, quis tempor nunc.
              Sed ornare mattis sagittis. In cursus aliquam mauris eu eleifend.
              Mauris non tristique arcu. In hac habitasse platea dictumst. Sed
              sed cursus mauris. Integer eu pellentesque ante, elementum
              hendrerit dolor. Praesent aliquam tristique orci vel fermentum.
            </p>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between w-full mt-5">
          <Button variant={"secondary"} className="w-60 bg-black text-white">
            Decline
          </Button>
          <Button
            onClick={() => navigate("/welcome")}
            className="w-60"
          >
            Agree & Continue <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TermsCondition;
