"use client";

import * as React from "react";
import { SubNotificationItem, NotificationSection } from "../components/Notification";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [lowStockAlert, setLowStockAlert] = React.useState(true);
  const [taskCompletion, setTaskCompletion] = React.useState(true);
  const [monthlyNewsletter, setMonthlyNewsletter] = React.useState(true);
  const [googleAuthenticator, setGoogleAuthenticator] = React.useState(true);
  const [anotherPlatform, setAnotherPlatform] = React.useState(false);

  return (
    <main className="mx-auto my-0 w-full rounded-xl border-2 border-solid border-accent max-md:mx-4 max-md:my-0">
      <NotificationSection
        title="Email Notifications"
        description="You have opted to always use your email idristhecurator@gmail.com as your primary email to receive activities on account"
        checked={emailNotifications}
        onCheckedChange={setEmailNotifications}
      />

      <NotificationSection
        title="Push Notifications"
        description="Notifications of activities on account will always will be sent to your last active device"
        checked={pushNotifications}
        onCheckedChange={setPushNotifications}
      />

      <NotificationSection title="Reminders" hasToggle={false}>
        <SubNotificationItem
          title="Low Stock Alert"
          description="(Update about inventory level that are needed to be stocked up)"
          checked={lowStockAlert}
          onCheckedChange={setLowStockAlert}
        />
        <SubNotificationItem
          title="Task Completion"
          description="(Update on relevant milestone achieved on task assigned)"
          checked={taskCompletion}
          onCheckedChange={setTaskCompletion}
        />
      </NotificationSection>

      <NotificationSection
        title="Monthly Newsletter"
        description="Notifications of activities on account will always will be sent to your last active device"
        checked={monthlyNewsletter}
        onCheckedChange={setMonthlyNewsletter}
      />

      <NotificationSection title="Custom Alerts" hasToggle={false}>
        <SubNotificationItem
          title="Google Authenticator:"
          description="Receive notifications and alerts about activities on your account via your google authenticator application"
          checked={googleAuthenticator}
          onCheckedChange={setGoogleAuthenticator}
        />
        <SubNotificationItem
          title="Another Platform:"
          description="Receive notifications and alerts about activities on your account via your selected application"
          checked={anotherPlatform}
          onCheckedChange={setAnotherPlatform}
        />
      </NotificationSection>
    </main>
  );
}

export default NotificationSettings;
