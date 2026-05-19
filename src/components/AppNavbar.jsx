'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Skeleton
} from "@heroui/react";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";

import {
  CarFront,
  Home,
  Car,
  Plus,
  BookOpen,
  LayoutDashboard,
  LogOut
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      toast.success("Logged out successfully");

      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // MAIN NAVBAR ITEMS
  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />
    },

    {
      name: "Explore Cars",
      href: "/explore",
      icon: <Car className="w-4 h-4" />
    },

    // SHOW ONLY AFTER LOGIN
    ...(user
      ? [
          {
            name: "Add Car",
            href: "/add-car",
            icon: <Plus className="w-4 h-4" />
          },

          {
            name: "My Bookings",
            href: "/my-bookings",
            icon: <BookOpen className="w-4 h-4" />
          }
        ]
      : [])
  ];

  // DROPDOWN MENU
  const userMenuItems = [
    {
      key: "add_car",
      label: "Add Car",
      href: "/add-car",
      icon: <Plus className="w-4 h-4 text-primary" />
    },

    {
      key: "my_bookings",
      label: "My Bookings",
      href: "/my-bookings",
      icon: <BookOpen className="w-4 h-4 text-primary" />
    },

    {
      key: "my_cars",
      label: "My Added Cars",
      href: "/my-cars",
      icon: <LayoutDashboard className="w-4 h-4 text-primary" />
    }
  ];

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        maxWidth="xl"
        height="4rem"
        className="bg-background border-b border-divider shadow-sm pt-5 pb-5"
      >
        {/* LEFT */}
        <NavbarContent justify="start" className="gap-2">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl bg-default-100 border border-divider gap-1.5 shrink-0 z-50"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-4 h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center ${
                isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />

            <span
              className={`block w-4 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                isMenuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />

            <span
              className={`block w-4 h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center ${
                isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>

          {/* LOGO */}
          <NavbarBrand
            as={NextLink}
            href="/"
            className="cursor-pointer gap-2 min-w-fit"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary shadow-lg shadow-primary/30 shrink-0">
              <CarFront className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground">
                Drive
              </span>

              <span className="font-extrabold text-base sm:text-lg tracking-tight text-primary -mt-1">
                Fleet
              </span>
            </div>
          </NavbarBrand>
        </NavbarContent>

        {/* CENTER NAVIGATION */}
        <NavbarContent className="hidden sm:flex" justify="center">
          <NavbarItem>
            <div className="flex items-center gap-1 bg-default-100 border border-divider rounded-2xl p-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    as={NextLink}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                      ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "text-default-600 hover:text-foreground hover:bg-default-200"
                      }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </NavbarItem>
        </NavbarContent>

        {/* RIGHT SIDE */}
        <NavbarContent justify="end" className="gap-2 sm:gap-3">
          {isPending ? (
            <Skeleton className="rounded-full w-8 h-8 sm:w-9 sm:h-9" />
          ) : user ? (
            <Dropdown
              placement="bottom-end"
              backdrop="opaque"
              classNames={{
                content:
                  "p-1 border border-divider bg-background shadow-2xl min-w-[220px] rounded-2xl z-[9999]"
              }}
            >
              <DropdownTrigger>
                <button className="flex items-center gap-2 outline-none">
                  <div className="hidden lg:flex flex-col items-end leading-none">
                    <span className="text-xs font-semibold text-foreground">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>

                    <span className="text-[10px] text-default-400">
                      Member
                    </span>
                  </div>

                  <div className="relative">
                    <Avatar
                      isBordered
                      color="primary"
                      name={user?.name || "User"}
                      size="sm"
                      src={user?.image}
                      className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer hover:scale-105 transition-transform"
                    />

                    <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-success rounded-full border-2 border-background" />
                  </div>
                </button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="w-full"
                itemClasses={{
                  base: "rounded-xl px-3 py-2 data-[hover=true]:bg-default-100"
                }}
              >
                <DropdownItem
                  key="profile"
                  isReadOnly
                  className="opacity-100 cursor-default rounded-xl mb-1 bg-default-50 border border-divider"
                  textValue="profile"
                >
                  <div className="flex items-center gap-3 py-1">
                    <Avatar
                      color="primary"
                      name={user?.name || "User"}
                      size="sm"
                      src={user?.image}
                    />

                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {user?.name}
                      </p>

                      <p className="text-xs text-default-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </DropdownItem>

                {userMenuItems.map((item) => (
                  <DropdownItem
                    key={item.key}
                    as={NextLink}
                    href={item.href}
                    startContent={item.icon}
                    className="font-medium text-foreground"
                  >
                    {item.label}
                  </DropdownItem>
                ))}

                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                  startContent={<LogOut className="w-4 h-4" />}
                  className="font-medium mt-1"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                as={NextLink}
                href="/login"
                variant="light"
                size="sm"
                className="font-semibold text-default-600 hidden sm:flex"
              >
                Login
              </Button>

              <Button
                as={NextLink}
                href="/register"
                color="primary"
                size="sm"
                className="font-bold shadow-md shadow-primary/30 px-4 sm:px-5"
              >
                Sign Up
              </Button>
            </div>
          )}
        </NavbarContent>

        {/* MOBILE MENU */}
        <NavbarMenu className="bg-background border-t border-divider pt-4 pb-8 gap-1 overflow-y-auto top-16 z-[9999] h-screen fixed">
          {/* USER CARD */}
          {user && (
            <div className="flex items-center gap-3 mx-2 mb-4 p-4 bg-default-100 border border-divider rounded-2xl">
              <Avatar
                isBordered
                color="primary"
                name={user?.name || "User"}
                size="sm"
                src={user?.image}
              />

              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.name}
                </p>

                <p className="text-xs text-default-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          )}

          <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-4 mb-2">
            Navigation
          </p>

          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <NavbarMenuItem key={`${item.name}-${index}`}>
                <NextLink
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-default-600 hover:bg-default-100 hover:text-foreground"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </NextLink>
              </NavbarMenuItem>
            );
          })}

          {user ? (
            <>
              <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-4 mt-5 mb-2">
                Account
              </p>

              {userMenuItems.map((item) => (
                <NavbarMenuItem key={item.key}>
                  <NextLink
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all"
                  >
                    {item.icon}
                    {item.label}
                  </NextLink>
                </NavbarMenuItem>
              ))}

              <NavbarMenuItem>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-danger hover:bg-danger/10 transition-all mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </NavbarMenuItem>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-default-400 uppercase tracking-wider px-4 mt-5 mb-2">
                Account
              </p>

              <NavbarMenuItem>
                <NextLink
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-default-600 hover:bg-default-100 hover:text-foreground transition-all"
                >
                  Login
                </NextLink>
              </NavbarMenuItem>

              <div className="px-2 mt-2">
                <Button
                  as={NextLink}
                  href="/register"
                  color="primary"
                  className="font-bold shadow-md shadow-primary/30 w-full"
                  onPress={() => setIsMenuOpen(false)}
                >
                  Sign Up — It's Free
                </Button>
              </div>
            </>
          )}
        </NavbarMenu>
      </Navbar>
    </>
  );
}