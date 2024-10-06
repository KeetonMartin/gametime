import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FantasyFootballLeague } from "../types";
import LeagueCard from "./ui/leagueCard";
import PlayersCard from "./ui/playersCard";

interface DashboardProps {
  username: string;
  setUsername: (username: string) => void;
  fetchUserData: (username: string) => void;
  userId: string | null;
  displayName: string | null;
  avatar: string | null;
  leagues: FantasyFootballLeague[];
}

export function Dashboard({
  username,
  setUsername,
  fetchUserData,
  userId,
  displayName,
  avatar,
  leagues,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "leagues":
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league, index) => (
              <LeagueCard
                key={index}
                league={league}
                userId={userId}
                displayName={displayName}
              />
            ))}
          </div>
        );
      case "players":
        return (
          <PlayersCard
            leagues={leagues}
            userId={userId}
            displayName={displayName}
          />
        );
      default:
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Leagues
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leagues.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Players
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {leagues.reduce((total, league) => total + (league.rosters?.length || 0), 0)}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>User Info</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatar ? `https://sleepercdn.com/avatars/${avatar}` : undefined} alt="Avatar" />
                    <AvatarFallback>{displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {displayName || "Unknown User"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <button
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            onClick={() => setActiveTab("dashboard")}
          >
            <Package2 className="h-6 w-6" />
            <span>Gametime Fantasy Dashboard</span>
          </button>
          <button
            className={`transition-colors hover:text-foreground ${activeTab === "dashboard" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`transition-colors hover:text-foreground ${activeTab === "leagues" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("leagues")}
          >
            Leagues
          </button>
          <button
            className={`transition-colors hover:text-foreground ${activeTab === "players" ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("players")}
          >
            Players
          </button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <button
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setActiveTab("dashboard")}
              >
                <Package2 className="h-6 w-6" />
                <span>Gametime Fantasy Dashboard</span>
              </button>
              <button
                className={`hover:text-foreground ${activeTab === "dashboard" ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
              <button
                className={`hover:text-foreground ${activeTab === "leagues" ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("leagues")}
              >
                Leagues
              </button>
              <button
                className={`hover:text-foreground ${activeTab === "players" ? "text-foreground" : "text-muted-foreground"}`}
                onClick={() => setActiveTab("players")}
              >
                Players
              </button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial" onSubmit={(e) => {
            e.preventDefault();
            fetchUserData(username);
          }}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Enter Sleeper username..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;