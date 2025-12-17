import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/navbar";
import LogoSENA from "/icon.png";
import pfpEdith from "../assets/profiles/Edith.png";

import { ThemeSwitch } from "@/components/theme-switch";
import { useAuthStore } from "@/store/auth.store";
import { Chip } from "@heroui/react";

export const Navbar = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <HeroUINavbar
      maxWidth="xl"
      className="bg-success text-white fixed top-0 z-50 w-full h-full max-h-[85px]"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <img src={LogoSENA} alt="logo sena" className="w-15 h-15 mr-2" />
            <p className="font-bold text-white text-xl">
              Seguimiento Plan Operativo <br />
              <span className="text-sm">
                Coordinación Misional Regional
              </span>
            </p>
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
              <Link
                className="flex justify-end items-center gap-1"
                color="foreground"
                href="/users/68ba073327e5ac74d4a55726"
              >
                <img src={pfpEdith} alt="Edith Betancourt Sánchez" className="w-14 h-14 rounded-full border-primary border-2" />
                <div>
                  <p className="font-bold text-white text-xl">Edith Betancourt Sánchez</p>
                  <Chip variant="solid" color="primary" size="sm" className="text-white">Administrador</Chip>

                </div>
              </Link>
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
