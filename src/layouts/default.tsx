import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@heroui/button";
import { HiMenu } from "react-icons/hi";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, verifyError } = useAuthStore();

  const isAuthenticated = !!user && !verifyError;
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 mt-10">
        {isAuthenticated && (
          <Button
            isIconOnly
            className="fixed bottom-4 right-4 z-40 md:hidden"
            variant="solid"
            onClick={() => setSidebarOpen(true)}
          >
            <HiMenu className="w-7 h-7" />
          </Button>
        )}

        {isAuthenticated && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main
          className={`flex-grow pt-16 px-6 w-full transition-all ${isAuthenticated ? "md:ml-64" : ""
            }`}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <footer className="w-full flex items-center justify-center py-6 border-t mt-10">
        <Link
          isExternal={false}
          className="flex items-center gap-2"
          href="/"
          title="Seguimiento Plan Oprativo CMR"
        >
          <span className="text-default-600">Seguimiento Plan Oprativo - CMR</span>
          <p className="text-success font-bold">SENA</p>
          <span className="text-default-600">Regional Cauca - 2025</span>
        </Link>
      </footer>
    </div>
  );
}
