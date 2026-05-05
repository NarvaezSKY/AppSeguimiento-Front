import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/navbar";
import LogoSENA from "/white_icon.png";
import LogoSeguimiento from '../assets/Logo.png'
import LogoCMR from '../assets/CMR.png'
import { ThemeSwitch } from "@/components/theme-switch";
import { useAuthStore } from "@/store/auth.store";
import { ProfileLink } from "@/components/ProfileLink";

export const Navbar = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <HeroUINavbar
      maxWidth="xl"
      className="bg-success text-white fixed top-0 z-50 w-full h-full max-h-[95px]"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <img src={LogoSENA} alt="logo sena" className="w-19 h-19 mr-2" />
            <div className="flex flex-col space-y-[-8px]">
              <img src={LogoSeguimiento} alt="logo sena" className="w-105 h-19 mt-6" />
              <img src={LogoCMR} alt="CMR" className="w-40 mb-6 mr-2"/>

            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="gap-2 max-w-fit mr-4">
          {user && (
            <div className="flex items-center gap-2">
              <ProfileLink name={user.name} email={user.email} />
            </div>
          )}
        </NavbarItem>

        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu></NavbarMenu>
    </HeroUINavbar>
  );
};
