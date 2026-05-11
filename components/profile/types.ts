export type ProfileTab = "security" | "account" | "about";

export interface TabItem {
  id: ProfileTab;
  label: string;
  icon: React.ReactNode;
}

export interface AccountInfo {
  displayName: string;
  userEmail: string;
  userName: string;
  subscriptionType?: string | null;
  userId?: string;
}

export interface SecurityInfo {
  userId?: string;
  createdAt?: string;
}
