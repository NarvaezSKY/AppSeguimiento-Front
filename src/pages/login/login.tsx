import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import DefaultLayout from "@/layouts/default";
import { useForm } from "react-hook-form";
import { useLogin } from "./hooks/useLogin";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Divider } from "@heroui/react";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { handleLogin, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    await handleLogin(data.email, data.password);
  };

  return (
    <DefaultLayout>
      <section className="flex items-center justify-center pt-16">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <h2 className="font-semibold mb-6 text-center text-4xl">¡Bienvenida de vuelta!</h2>
          <h3 className="text-md text-center text-default-500 mb-4">Inicia sesión para gestionar las evidencias del Plan Operativo</h3>
          <Divider className="mb-4"/>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo"
              required
              fullWidth
              {...register("email", { required: true })}
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                required
                fullWidth
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                onMouseDown={(e) => e.preventDefault()}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-500 transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <Divider />
            {error && (
              <span className="text-red-500 text-sm text-center">{error}</span>
            )}
            <Button color="success" type="submit" variant="shadow" fullWidth isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        </Card>
      </section>
    </DefaultLayout>
  );
}