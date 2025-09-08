import React from "react";
import {
    Modal as HeroModal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "full";
}

const sizeWidth: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    full: "w-full max-w-full",
};

export default function Modal({
    open,
    title,
    onClose,
    children,
    footer,
    size = "md"
}: ModalProps) {
    if (!open) return null;

    return (
        <HeroModal isOpen={open} onClose={onClose}>

            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <ModalContent className={`relative mx-4 ${sizeWidth[size]}`}>
                    <ModalHeader className="flex items-start justify-between gap-4 p-4 border-default-200 border-b">
                        <div>{title && <h3 className="text-lg font-semibold">{title}</h3>}</div>
                    </ModalHeader>

                    <ModalBody className="p-4">{children}</ModalBody>

                    {footer && <ModalFooter className="p-4 border-t">{footer}</ModalFooter>}
                </ModalContent>
            </div>
        </HeroModal>
    );
}