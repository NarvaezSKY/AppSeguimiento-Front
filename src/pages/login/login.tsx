import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import DefaultLayout from "@/layouts/default";
import { useForm } from "react-hook-form";
import { useLogin } from "./hooks/useLogin";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { handleLogin, isLoading, error } = useLogin();

  const onSubmit = async (data: LoginForm) => {
    await handleLogin(data.email, data.password);
    
  };

  return (
    <DefaultLayout>
      <section className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo"
              required
              fullWidth
              {...register("email", { required: true })}
            />
            <Input
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              required
              fullWidth
              {...register("password", { required: true })}
            />
            {error && (
              <span className="text-red-500 text-sm text-center">{error}</span>
            )}
            <Button color="primary" type="submit" fullWidth isLoading={isLoading}>
              Entrar
            </Button>
          </form>
        </Card>
      </section>
    </DefaultLayout>
  );
}