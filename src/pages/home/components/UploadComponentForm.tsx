import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTasksStore } from "@/store/tasks.store";
import { toast } from "sonner";

interface Props {
    onClose: () => void;
    onCreated?: () => void;
}

export default function UploadComponentForm({ onClose, onCreated }: Props) {
    const [nombre, setNombre] = useState("");
    const createComponent = useTasksStore((s) => s.createComponent);
    const getComponents = useTasksStore((s) => s.getComponents);
    const isLoading = useTasksStore((s) => s.isLoading);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!nombre.trim()) {
            toast.error("El nombre del componente es requerido");
            return;
        }

        try {
            await createComponent({
                nombreComponente: nombre.trim(),
            });
            try {
                await getComponents();
            } catch { }
            toast.success("Componente creado");
            onCreated?.();
            onClose();
        } catch (err) {
            toast.error("Error creando componente");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Nombre del componente"
                placeholder="Escribe el nombre"
                required
                value={nombre}
                onChange={(e: any) => setNombre(e.target.value)}
                fullWidth
            />

            <div className="flex justify-end gap-2 mt-2">
                <Button color="default" onClick={onClose} type="button">
                    Cancelar
                </Button>
                <Button color="success" type="submit" isLoading={isLoading}>
                    Crear
                </Button>
            </div>
        </form>
    );
}