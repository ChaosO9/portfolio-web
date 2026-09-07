import React from "react";
import Image from "next/image";

interface IconProps {
  className?: string;
  size?: number;
}

export function AwsIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/aws.svg" alt="AWS" width={size} height={size} className={className} />;
}

export function GcpIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/gcp.svg" alt="Google Cloud" width={size} height={size} className={className} />;
}

export function CloudflareIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/cloudflare.svg" alt="Cloudflare" width={size} height={size} className={className} />;
}

export function DockerIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/docker.svg" alt="Docker" width={size} height={size} className={className} />;
}

export function LinuxIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/linux-svgrepo-com.svg" alt="Linux" width={size} height={size} className={className} />;
}

export function NodeIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/nodejs-icon-svgrepo-com.svg" alt="Node.js" width={size} height={size} className={className} />;
}

export function DotNetIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/dotnet.svg" alt=".NET Core" width={size} height={size} className={className} />;
}

export function CSharpIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/csharp.svg" alt="C#" width={size} height={size} className={className} />;
}

export function PostgresIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/postgresql-svgrepo-com.svg" alt="PostgreSQL" width={size} height={size} className={className} />;
}

export function SqlServerIcon({ className = "w-8 h-8 object-contain", size = 32 }: IconProps) {
  return <Image src="/images/sqlserver.svg" alt="Microsoft SQL Server" width={size} height={size} className={className} />;
}
