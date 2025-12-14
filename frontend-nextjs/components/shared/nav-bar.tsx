import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AuthButton } from "@/components/shared/auth-button";
import { MobileNav } from "@/components/shared/mobile-nav";

export interface NavLinks {
  href: string;
  label: string;
}

interface NavBarProps {
  title?: string;
  links: NavLinks[];
  showThemeToggle?: boolean;
}

export function NavBar({ title, links, showThemeToggle = true }: NavBarProps) {
  return (
    <>
      {/* Medium and above view port normal nav bar*/}
      <nav className="hidden size-full grid-cols-12 md:grid">
        <div className="col-span-7 flex flex-col justify-center">
          <p className="font-semibold"> {title} </p>
        </div>
        <div className="col-span-5 flex flex-row items-center justify-end gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-opacity hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}
          <AuthButton />
          {/* Reserve space for theme toggle - Prevent layout shift on first load*/}
          <div className="flex h-10 w-10 items-center justify-center">
            {showThemeToggle && <ThemeToggle />}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer nav */}
      <nav className="grid size-full grid-cols-12 md:hidden">
        <div className="col-span-3 flex items-center">
          <div className="h-9 w-9">{showThemeToggle && <ThemeToggle />}</div>
        </div>
        <p className="col-span-6 flex items-center justify-center font-semibold">
          {title}
        </p>
        <div className="col-span-3 flex items-center justify-end">
          <MobileNav links={links} />
        </div>
      </nav>
    </>
  );
}
