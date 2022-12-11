import Link from 'next/link';
import {PropsWithChildren, ReactNode} from 'react';

interface BreadcrumbType {
  items: Array<{
    text: ReactNode;
    href?: string;
  }>;
}

export default function Breadcrumb(props: BreadcrumbType) {
  return (
    <div className="bg-primary">
      <nav
        className="container mx-auto overflow-y-auto flex px-2 md:pl-24 py-4"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <BreadcrumbItem first href="/">
            <svg
              className="mr-2 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </BreadcrumbItem>

          {props.items.map((item, index) => (
            <BreadcrumbItem
              key={index}
              last={index === props.items.length - 1}
              href={item.href}
            >
              {item.text}
            </BreadcrumbItem>
          ))}
        </ol>
      </nav>
    </div>
  );
}

type BreadcrumbItemType = PropsWithChildren<{
  href?: string;
  last?: boolean;
  first?: boolean;
}>;

function BreadcrumbItem({href, first, last, children}: BreadcrumbItemType) {
  return (
    <li aria-current={last ? 'page' : undefined}>
      <div className="flex items-center">
        {first || (
          <svg
            className="w-6 h-6 text-blue-dark"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center text-sm font-medium text-blue-dark hover:text-white whitespace-nowrap ml-2 first-letter:uppercase"
          >
            {children}
          </Link>
        ) : (
          <span className="text-sm font-medium text-blue-dark whitespace-nowrap ml-2 first-letter:uppercase">
            {children}
          </span>
        )}
      </div>
    </li>
  );
}
