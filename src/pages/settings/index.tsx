import Container from "@/components/layouts/Container";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaRegEdit } from "react-icons/fa";
import { Personal } from "./layouts/Personal";
import NotificationSettings from "./layouts/Notification";

export default function Settings() {
  return (
    <Container className="py-10">
      <div className="flex items-center gap-3">
        <TextSearch containerClass="flex-1" />
        <Button variant={"outline"} className="rounded-full w-44">
          <FaRegEdit className="w-5 h-5" />
          Edit
        </Button>
      </div>
      <Tabs defaultValue="personal" className="mt-5">
        <TabsList className="bg-transparent border w-full justify-baseline">
          <TabsTrigger className="w-fit flex-none px-10 py-1.5" value="personal">Personal</TabsTrigger>
          {/* <TabsTrigger className="w-fit flex-none px-10 py-1.5" value="security">Security</TabsTrigger>
          <TabsTrigger className="w-fit flex-none px-10 py-1.5" value="alert">Alert & Notifications</TabsTrigger> */}
          <TabsTrigger className="w-fit flex-none px-10 py-1.5" value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Personal />
        </TabsContent>
        <TabsContent value="security">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for security
          </p>
        </TabsContent>
        <TabsContent value="alert">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for activity
          </p>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
