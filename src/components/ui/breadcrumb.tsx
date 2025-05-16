import * as React from "react";
import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string;
    href: string;
    isLast?: boolean;
  }[];
  showHome?: boolean;
}

export function Breadcrumb({
  segments,
  showHome = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-8 flex items-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {showHome && (
          <li>
            <Link 
              href="/dashboard"
              className="flex items-center hover:text-foreground transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </li>
        )}
        {showHome && segments.length > 0 && (
          <li className="flex items-center">
            <ChevronRightIcon className="h-4 w-4" />
          </li>
        )}
        
        {segments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <li key={index}>
              {segment.isLast ? (
                <span className="font-medium text-foreground">
                  {segment.name}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className="hover:text-foreground transition-colors"
                >
                  {segment.name}
                </Link>
              )}
            </li>
            {!segment.isLast && (
              <li className="flex items-center">
                <ChevronRightIcon className="h-4 w-4" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
