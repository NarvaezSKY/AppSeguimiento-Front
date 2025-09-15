import DefaultLayout from "@/layouts/default";
import { useUsersByComponent } from "./hooks/useUsersByComponent";
import { useLocation, Link } from "react-router-dom";
import { Card, CardHeader, Avatar, Chip } from "@heroui/react";

export const UsersByComponent = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const componentId =
    pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : "";
  const { usersInComponent, isLoadingUsersByComponent } =
    useUsersByComponent(componentId);

  return (
    <DefaultLayout>
      <section className="max-w-4xl mx-auto py-10 flex flex-col gap-8">
        <h2 className="text-2xl font-bold mb-6">
          Usuarios con evidencias en el componente:
        </h2>
        {isLoadingUsersByComponent ? (
          <div className="text-center text-default-500 py-8">
            Cargando usuarios...
          </div>
        ) : usersInComponent && usersInComponent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {usersInComponent.map((user) => (
              <Link
                key={user._id}
                to={`/users/${user._id}`}
                replace
                className="block group h-full"
                style={{ textDecoration: "none" }}
              >
                <Card className="transition-shadow group-hover:shadow-2xl group-hover:border-primary-500 h-full flex flex-col justify-center">
                  <CardHeader className="flex items-center gap-4 py-6">
                    <Avatar
                      name={user.nombre}
                      size="lg"
                    >
                      {user.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 3)}
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold group-hover:text-primary-700 transition-colors break-words">
                        {user.nombre}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Chip color="primary" size="sm">
                          {user.vinculacion}
                        </Chip>
                        <span className="text-default-400 text-sm truncate block max-w-[140px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-default-500 py-8">
            No hay usuarios para este componente.
          </div>
        )}
      </section>
    </DefaultLayout>
  );
};

export default UsersByComponent;
