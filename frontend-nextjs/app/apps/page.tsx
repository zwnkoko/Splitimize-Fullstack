import Link from "next/link";
import { appNavLinks } from "./appNavLinks";

export default function AppsPage() {
  return (
    <div>
      <h1>Apps</h1>
      <p>Explore the apps available in Splitimize.</p>
      <ul className="list-disc pl-5">
        {appNavLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={`/apps/${link.href}`}
              className="text-blue-500 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
