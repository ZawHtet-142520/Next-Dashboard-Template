"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  //   DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, DollarSign, HelpCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/stores/useDashboardStore";

export default function ProfileDropdown() {
  const router = useRouter();
  const handleLogout = useDashboardStore((state) => state.handleLogout);

  const onLogout = () => {
    handleLogout();
    router.push("/login");
  };
  return (
    <DropdownMenu>
      <div className="flex items-center gap-3 dark:text-white">
        {/* Optional: Add name or role */}
        <div>
          <div className="font-bold text-gray-700 hidden sm:block text-right dark:text-white">
            John Doe
          </div>
          <div className="text-sm text-gray-700 hidden sm:block text-right dark:text-white">
            Super Admin
          </div>
        </div>

        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 cursor-pointer dark:bg-white">
            <AvatarImage src="/profile.jpg" alt="User Profile" />
            <AvatarFallback className="dark:bg-white text-gray-700 dark:text-black">
              JD
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/profile.jpg" alt="User Profile" />
            <AvatarFallback className="dark:bg-white dark:text-black">
              JD
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm dark:text-white">John Doe</p>
            <p className="text-xs text-gray-500 dark:text-white">
              admin@vuexy.com
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="w-4 h-4 mr-2" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <DollarSign className="w-4 h-4 mr-2" /> Pricing
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="w-4 h-4 mr-2" /> FAQ
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onLogout()}
          className="cursor-pointer text-red-600 font-semibold hover:bg-red-100"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
