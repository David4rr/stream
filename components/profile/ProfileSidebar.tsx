import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Shield01Icon, InformationCircleIcon, Logout01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "./Avatar";
import type { ProfileTab, TabItem } from "./types";

const tabs: TabItem[] = [
  { id: "account", label: "Pengaturan Akun", icon: <HugeiconsIcon icon={UserIcon} className="h-5 w-5" /> },
  { id: "security", label: "Keamanan", icon: <HugeiconsIcon icon={Shield01Icon} className="h-5 w-5" /> },
  { id: "about", label: "Tentang Kami", icon: <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5" /> },
];

interface ProfileSidebarProps {
  userInitial: string;
  displayName: string;
  userEmail: string;
  avatarUrl?: string;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export function ProfileSidebar({
  userInitial,
  displayName,
  userEmail,
  avatarUrl,
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <aside className="w-full lg:w-80 p-6 lg:p-8 bg-muted/20 lg:bg-muted/10 border-b lg:border-b-0 lg:border-r border-border">
      {/* Avatar Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <ProfileAvatar initial={userInitial} avatarUrl={avatarUrl} />
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-background" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
        <p className="text-sm text-muted-foreground">{userEmail}</p>
      </div>

      {/* Navigation Tabs */}
      <nav className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              activeTab === tab.id
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}

        <Separator className="my-4" />

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          <HugeiconsIcon icon={Logout01Icon} className="h-5 w-5" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </nav>
    </aside>
  );
}

export { tabs };
