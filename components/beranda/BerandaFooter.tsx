import { FooterSection, FooterLink } from "./types";

interface BerandaFooterProps {
  sections: FooterSection[];
  copyright: string;
  legalLinks: FooterLink[];
}

export function BerandaFooter({
  sections,
  copyright,
  legalLinks,
}: BerandaFooterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* Footer Sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Copyright & Legal Links */}
      <div className="col-span-2 md:col-span-4 mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
          {copyright}
        </p>
        <div className="flex justify-center gap-4">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
