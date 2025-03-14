import { HTMLAttributes } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Github, MessagesSquare, Twitter } from 'lucide-react';

import { cn } from '@documenso/ui/lib/utils';

export type FooterProps = HTMLAttributes<HTMLDivElement>;

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/documenso', icon: <Twitter className="h-6 w-6" /> },
  { href: 'https://github.com/documenso/documenso', icon: <Github className="h-6 w-6" /> },
  { href: 'https://documen.so/discord', icon: <MessagesSquare className="h-6 w-6" /> },
];

const FOOTER_LINKS = [
  { href: '/pricing', text: 'Pricing' },
  { href: '/blog', text: 'Blog' },
  { href: '/open', text: 'Open' },
  { href: 'https://shop.documenso.com', text: 'Shop', target: '_blank' },
  { href: 'https://status.documenso.com', text: 'Status', target: '_blank' },
  { href: 'mailto:support@documenso.com', text: 'Support' },
  { href: '/privacy', text: 'Privacy' },
];

export const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <div className={cn('border-t py-12', className)} {...props}>
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-start justify-between gap-8 px-8">
        <div>
          <Link href="/">
            <Image src="/logo.png" alt="Documenso Logo" width={170} height={0}></Image>
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-4 text-[#8D8D8D]">
            {SOCIAL_LINKS.map((link, index) => (
              <Link key={index} href={link.href} target="_blank" className="hover:text-[#6D6D6D]">
                {link.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
          {FOOTER_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target={link.target}
              className="flex-shrink-0 text-sm text-[#8D8D8D] hover:text-[#6D6D6D]"
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-4 w-full max-w-screen-xl px-8 md:mt-12 lg:mt-24">
        <p className="text-sm text-[#8D8D8D]">
          © {new Date().getFullYear()} Documenso, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};
