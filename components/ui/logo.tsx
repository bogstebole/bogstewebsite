"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/images/logo.svg"
      alt="Boule logo"
      width={27}
      height={34}
      className={className}
      priority
    />
  );
}
