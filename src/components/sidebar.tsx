import { Link } from "@heroui/link";
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    Button,
    Accordion,
    AccordionItem,
} from "@heroui/react";

import { TbSmartHome } from "react-icons/tb";
import { FaCalendarCheck } from "react-icons/fa";

import { PiSignOutBold } from "react-icons/pi";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import { Divider } from "@heroui/react";
import { useLocation } from "react-router-dom";
import { useUsersStore } from "@/store/users.store";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    const { logout } = useAuthStore();
    const { users } = useUsersStore()

    const handleLogout = () => {
        logout();
        toast.success("Sesión cerrada correctamente");
    };
    return (
        <>
            <aside className="hidden md:flex flex-col h-full w-64 bg-default-100 border-r border-gray-200 pt-20 px-4 fixed z-30 pr-4">
                <div className="flex flex-col h-screen justify-between">
                    <nav className="flex flex-col gap-2 flex-1">
                        <h1 className="font-bold">Módulos</h1>
                        <Link
                            className={`font-semibold text-success hover:text-default-800 underline flex justify-start gap-1 transition-all
    ${currentPath === "/" ? "bg-success text-white rounded-md py-1 px-1 hover:text-white" : ""}
  `}
                            href="/"
                            isExternal={false}
                        >
                            <TbSmartHome className="w-5 h-5" />
                            Inicio
                        </Link>
                        <Link
                            className={`font-semibold text-success hover:text-default-800 underline flex justify-start gap-1 transition-all 
    ${currentPath === "/users" ? "bg-success text-white rounded-md py-1 px-1 hover:text-white" : ""}`}
                            href="/plan"
                        >
                            <FaCalendarCheck className="w-4 h-4" />
                            Ver plan anual
                        </Link>
                        <Divider />
                        <Accordion >
                            <AccordionItem key={"1"} aria-label="Equipo" title="Equipo" subtitle={"Ver integrantes de la CMR"} className={"cursor-pointer"}>
                                {users.map((user) => (
                                    <Link
                                        key={user._id}
                                        aria-label={user.nombre}
                                        title={user.nombre}
                                        className={`text-sm mb-1 text-success hover:text-default-800  flex justify-start gap-1 transition-all
    ${currentPath === `/users/${user._id}` ? "bg-success text-white rounded-md py-1 px-1 hover:text-white" : ""}
  `}
                                        style={{ willChange: "transform, color" }}
                                        href={`/users/${user._id}`}
                                    >
                                        <p>{user.nombre}</p>
                                    </Link>
                                ))}
                            </AccordionItem>
                        </Accordion>

                    </nav>
                    <div className="mb-[5rem] flex flex-col gap-2">
                        <Divider />
                        <Button
                            className="w-full"
                            color="danger"
                            size="sm"
                            variant="flat"
                            onClick={handleLogout}
                        >
                            <PiSignOutBold /> Cerrar sesión
                        </Button>
                    </div>
                </div>
            </aside>

            <Drawer
                className="z-50"
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
            >
                <DrawerContent className="w-64">
                    <DrawerHeader className="font-bold">Menú</DrawerHeader>
                    <DrawerBody>
                        <Link
                            className={`font-semibold text-success hover:text-default-800 underline flex justify-start gap-1 transition-all
    ${currentPath === "/home" ? "bg-success text-white rounded-md py-1 px-1 hover:text-white" : ""}
  `}
                            href="/home"
                        >
                            <TbSmartHome className="w-5 h-5" />
                            Inicio
                        </Link>
                        <Link
                            className={`font-semibold text-success hover:text-default-800 underline flex justify-start gap-1 transition-all 
    ${currentPath === "/users" ? "bg-success text-white rounded-md py-1 px-1 hover:text-white" : ""}`}
                            href="/users"
                        >
                            <FaCalendarCheck className="w-4 h-4" />
                            Ver plan anual
                        </Link>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
