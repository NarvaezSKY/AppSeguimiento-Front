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
  edith: {
    image: pfpEdith,
    userId: "68ba073327e5ac74d4a55726",
  },
  jgarces: {
    image: pfpJulian,
    userId: "68ba075327e5ac74d4a5572a",
  },
  rmontanof: {
    image: pfpRodrigo,
    userId: "68ba07ef27e5ac74d4a55736",
  },
};

function getProfileConfig(email?: string | null): ProfileConfig | null {
  if (!email) return null;
  const match = Object.keys(PROFILE_MAP).find((key) => email.includes(key));
  return match ? PROFILE_MAP[match] : null;
}

interface ProfileLinkProps {
  name?: string;
  email?: string | null;
}

export const ProfileLink = ({ name, email }: ProfileLinkProps) => {
  const profile = getProfileConfig(email);
  const isLoadingCredentials = !email;

  if (isLoadingCredentials) {
    return (
      <div className="flex justify-end items-center gap-2" aria-busy="true" aria-live="polite">
        <div className="w-14 h-14 rounded-full animate-pulse bg-default-300" />
        <div className="flex flex-col items-start gap-2">
          <div className="h-5 w-32 rounded-md animate-pulse bg-default-300" />
          <div className="h-5 w-24 rounded-full animate-pulse bg-default-300" />
        </div>
      </div>
    );
  }

  return (
    <Link
      className="flex justify-end items-center gap-1"
      color="foreground"
      href={profile ? `/users/${profile.userId}` : "#"}
    >
      {profile ? (
        <img
          src={profile.image}
          alt={name}
          className="w-14 h-14 rounded-full border-primary border-2"
        />
      ) : (
        <div className="w-14 h-14 rounded-full border-primary border-2 bg-default-200 text-default-700 flex items-center justify-center font-bold text-lg uppercase">
          {name?.trim()?.charAt(0) ?? "?"}
        </div>
      )}
      <div>
        <p className="font-bold text-white text-xl">{name}</p>
        <Chip variant="solid" color="primary" size="sm" className="text-white">
          Administrador
        </Chip>
      </div>
    </Link>
  );
};
