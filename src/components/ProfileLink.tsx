import { Link } from "@heroui/link";
import { Chip } from "@heroui/react";

import pfpEdith from "../assets/profiles/Edith.png";
import pfpJulian from "../assets/profiles/Inge Julian.png";
import pfpRodrigo from "../assets/profiles/Rodrigo.png";

interface ProfileConfig {
  image: string;
  userId: string;
}

const PROFILE_MAP: Record<string, ProfileConfig> = {
  jgarces: {
    image: pfpJulian,
    userId: "68ba075327e5ac74d4a5572a",
  },
  rmontanof: {
    image: pfpRodrigo,
    userId: "68ba07ef27e5ac74d4a55736",
  },
};

const DEFAULT_PROFILE: ProfileConfig = {
  image: pfpEdith,
  userId: "68ba073327e5ac74d4a55726",
};

function getProfileConfig(email?: string | null): ProfileConfig {
  if (!email) return DEFAULT_PROFILE;
  const match = Object.keys(PROFILE_MAP).find((key) => email.includes(key));
  return match ? PROFILE_MAP[match] : DEFAULT_PROFILE;
}

interface ProfileLinkProps {
  name?: string;
  email?: string | null;
}

export const ProfileLink = ({ name, email }: ProfileLinkProps) => {
  const { image, userId } = getProfileConfig(email);

  return (
    <Link
      className="flex justify-end items-center gap-1"
      color="foreground"
      href={`/users/${userId}`}
    >
      <img
        src={image}
        alt={name}
        className="w-14 h-14 rounded-full border-primary border-2"
      />
      <div>
        <p className="font-bold text-white text-xl">{name}</p>
        <Chip variant="solid" color="primary" size="sm" className="text-white">
          Administrador
        </Chip>
      </div>
    </Link>
  );
};
