import { HelpCircle, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AvatarControlProps {
  logout: (() => void) | undefined;
}

const AvatarControl: React.FC<AvatarControlProps> = ({ logout }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <span className="flex items-center space-x-2">
            <Settings size={20} />
            <span>Settings</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <span className="flex items-center space-x-2">
            <HelpCircle size={20} />
            <span>Support</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <span className="flex items-center space-x-2">
            <LogOut size={20} />
            <span>Logout</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarControl;
