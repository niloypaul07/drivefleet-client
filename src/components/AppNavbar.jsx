'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
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
import { CarFront } from "lucide-react";
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
    } catch(err) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Explore Cars", href: "/explore" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-background/70 backdrop-blur-md border-b border-divider">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href="/" className="cursor-pointer text-foreground">
          <CarFront className="w-8 h-8 mr-2 text-primary" />
          <p className="font-bold text-inherit tracking-tight text-xl">DriveFleet</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={pathname === item.href}>
            <Link color={pathname === item.href ? "primary" : "foreground"} href={item.href}>
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {isPending ? (
           <Skeleton className="rounded-full w-8 h-8"/>
        ) : user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user?.name || "User"}
                size="sm"
                src={user?.image || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="add_car" href="/add-car">Add Car</DropdownItem>
              <DropdownItem key="my_bookings" href="/my-bookings">My Bookings</DropdownItem>
              <DropdownItem key="my_cars" href="/my-cars">My Added Cars</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login" color="foreground">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={pathname === item.href ? "primary" : "foreground"}
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {user ? (
          <>
            <NavbarMenuItem><Link href="/add-car" size="lg" color="foreground">Add Car</Link></NavbarMenuItem>
            <NavbarMenuItem><Link href="/my-bookings" size="lg" color="foreground">My Bookings</Link></NavbarMenuItem>
            <NavbarMenuItem><Link href="/my-cars" size="lg" color="foreground">My Added Cars</Link></NavbarMenuItem>
            <NavbarMenuItem><Link onPress={handleLogout} size="lg" color="danger" className="cursor-pointer">Log Out</Link></NavbarMenuItem>
          </>
        ) : (
          <>
            <NavbarMenuItem><Link href="/login" size="lg" color="foreground">Login</Link></NavbarMenuItem>
            <NavbarMenuItem><Link href="/register" size="lg" color="primary">Sign Up</Link></NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
