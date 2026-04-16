import { Avatar } from "@heroui/react";
import { getProfileImage } from "@/shared/utils/profile-images";

interface ProfileAvatarProps {
  name?: string | null;
  size?: "sm" | "md" | "lg";
  imgClassName?: string;
  avatarClassName?: string;
  initialsLimit?: number;
}

const getInitials = (name: string, initialsLimit = 2) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, initialsLimit);

export function ProfileAvatar({
  name,
  size = "md",
  imgClassName = "w-10 h-10 rounded-full object-cover",
  avatarClassName,
  initialsLimit = 2,
}: ProfileAvatarProps) {
  const image = getProfileImage(name);

  if (image) {
    return <img src={image.src} alt={image.alt} className={imgClassName} />;
  }

  return (
    <Avatar
      name={name ? getInitials(name, initialsLimit) : "?"}
      size={size}
      className={avatarClassName}
    />
  );
}
