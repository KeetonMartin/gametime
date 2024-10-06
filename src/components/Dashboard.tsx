import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Gametime Fantasy Dashboard</span>
          </Link>
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/leagues"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Leagues
          </Link>
          <Link
            to="/players"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Players
          </Link>
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
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span>Gametime Fantasy Dashboard</span>
              </Link>
              <Link to="/" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link
                to="/leagues"
                className="text-muted-foreground hover:text-foreground"
              >
                Leagues
              </Link>
              <Link
                to="/players"
                className="text-muted-foreground hover:text-foreground"
              >
                Players
              </Link>
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
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>{activeTab === "players" ? "Players" : "Leagues"}</CardTitle>
                <CardDescription>
                  {activeTab === "players" ? "Your players across all leagues" : "Your fantasy football leagues"}
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1" onClick={() => setActiveTab(activeTab === "players" ? "leagues" : "players")}>
                <Link to="#">
                  {activeTab === "players" ? "View Leagues" : "View Players"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeTab === "players" ? (
                <PlayersCard
                  leagues={leagues}
                  userId={userId}
                  displayName={displayName}
                />
              ) : (
                leagues.map((league, index) => (
                  <LeagueCard
                    key={index}
                    league={league}
                    userId={userId}
                    displayName={displayName}
                  />
                ))
              )}
            </CardContent>
          </Card>
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;