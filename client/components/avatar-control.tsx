import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AvatarControlProps {
  isAuthenticated: boolean | undefined;
  logout: (() => void) | undefined;
}

const AvatarControl: React.FC<AvatarControlProps> = ({ isAuthenticated, logout }) => {
  const router = useRouter();

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-50">
          <DropdownMenuItem onClick={logout}>
            <span className="flex items-center space-x-2">
              <span>Logout</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Button onClick={() => router.push("/login")} variant="outline">
        Login
      </Button>
    );
  }
};

export default AvatarControl;
