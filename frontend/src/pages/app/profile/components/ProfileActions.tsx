import React from "react";
import { ActionList, ActionItem } from "../../../../components/shared";

interface ProfileActionsProps {
  onSignOut: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  onSignOut,
}) => {
  const actions: ActionItem[] = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: "✏️",
      onPress: () => {},
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "🔔",
      onPress: () => {},
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: "🔒",
      onPress: () => {},
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "❓",
      onPress: () => {},
    },
    {
      id: "about",
      title: "About",
      icon: "ℹ️",
      onPress: () => {},
    },
    {
      id: "sign-out",
      title: "Sign Out",
      icon: "🚪",
      onPress: onSignOut,
    },
  ];

  return <ActionList title="Settings" actions={actions} />;
};
