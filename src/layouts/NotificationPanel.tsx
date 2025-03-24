import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MapList } from "@/components/layouts/MapList";
import { format } from "date-fns";
import { getNotificationData } from "@/demo";
import { groupBy } from "lodash";
import { FaRegBell } from "react-icons/fa";
import Container from "@/components/layouts/Container";

export function NotificationPanel() {
  const notifications = getNotificationData();

  const notificationByDate = groupBy(notifications, (notification) => {
    return notification.createdAt;
  });

  const notificationList = Object.entries(notificationByDate).map((item) => ({
    title: item[0],
    notifications: item[1],
  }));

  return (
    <Sheet>
      <SheetTrigger>
        <div className="h-10 w-10 bg-muted-foreground rounded-full cursor-pointer grid place-items-center mx-4">
          <FaRegBell className="text-black" />
        </div>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Notification</SheetTitle>
        </SheetHeader>
        <Container>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={notificationList[0].title}
          >
            <MapList
              data={notificationList}
              renderItem={(group, index) => (
                <NotificationDateGroup
                  key={index}
                  date={group.title}
                  notifications={group.notifications}
                />
              )}
            />
          </Accordion>
        </Container>
      </SheetContent>
    </Sheet>
  );
}

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "low-in-stock":
        return "text-red-600 bg-rose-200 border-red-600";
      case "high-in-stock":
        return "text-emerald-700 bg-emerald-100 border-emerald-300";
      case "completed":
        return "text-white bg-neutral-900 border-neutral-900 border-opacity-30";
      case "ongoing":
        return "text-yellow-900 bg-orange-200 border-amber-400";
      case "not-started":
        return "text-neutral-700 border-neutral-700 bg-white";
      default:
        return "text-neutral-700 border-neutral-700 bg-white";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "low-in-stock":
        return "Low in stock";
      case "high-in-stock":
        return "High in stock";
      case "completed":
        return "Completed";
      case "ongoing":
        return "Ongoing";
      case "not-started":
        return "Not Started";
      default:
        return status;
    }
  };

  return (
    <div
      className={`gap-2.5 self-stretch p-2 text-base font-bold tracking-tight text-right whitespace-nowrap rounded border border-solid ${getStatusStyles()}`}
    >
      {getStatusText()}
    </div>
  );
};

type NotificationStatus =
  | "low-in-stock"
  | "high-in-stock"
  | "completed"
  | "ongoing"
  | "not-started";

export interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  status: NotificationStatus;
  imageSrc?: string;
  iconBgColor?: string;
  createdAt?: string;
}

const NotificationItem = ({
  title,
  description,
  status,
  imageSrc,
  iconBgColor,
}: NotificationItemProps) => {
  return (
    <div className="flex overflow-hidden flex-wrap gap-5 justify-between py-1.5 pr-2.5 pl-1 w-full rounded">
      <div className="flex gap-3.5 text-neutral-900">
        <div className="flex overflow-hidden relative flex-col items-center aspect-square h-10 rounded-[100px] w-10">
          {imageSrc ? (
            <>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/2506fc6cc029a68310fecb22e22465215144d8a89030456da597205ada472567?placeholderIfAbsent=true"
                className="object-cover absolute inset-0 size-full"
              />
              {status === "completed" ? (
                <div className="flex relative shrink-0 w-full bg-emerald-700 h-10 rounded-[1000px]" />
              ) : status === "ongoing" || status === "not-started" ? (
                <div
                  className={`flex shrink-0 ${
                    iconBgColor || "bg-amber-400"
                  } h-10 rounded-[100px] w-10`}
                />
              ) : (
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/715873bbbe2293df1eb22d3313b0be149d121dc04bb4b508acfebad75b47267c?placeholderIfAbsent=true"
                  className="object-contain w-full aspect-square rounded-[1000px]"
                />
              )}
            </>
          ) : (
            <div
              className={`flex shrink-0 ${
                iconBgColor || "bg-amber-400"
              } h-[52px] rounded-[100px] w-[52px]`}
            />
          )}
        </div>
        <div className="grow shrink-0 my-auto basis-0 w-fit">
          <div className="text-sm font-bold">{title}</div>
          <div className="text-xs ">{description}</div>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
};

export interface NotificationDateGroupProps {
  date: string;
  notifications: NotificationItemProps[];
}

const NotificationDateGroup: React.FC<NotificationDateGroupProps> = ({
  date,
  notifications,
}) => {
  return (
    <AccordionItem value={date} key={date} className="py-2">
      <AccordionTrigger className=" p-0 !text-[12px] leading-6 hover:no-underline">
        {format(date ?? "12/02/2000", "MMM dd yyyy")}
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground pb-2">
        <MapList
          data={notifications}
          renderItem={(notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              title={notification.title}
              status={notification.status}
              imageSrc={notification.imageSrc}
              description={notification.description}
              iconBgColor={notification.iconBgColor}
            />
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
