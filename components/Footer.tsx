'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const sp = useSearchParams();

  const isPilotView = pathname === '/for-lantbrukare' && sp.get('pilot') === 'harparboda';

  return (
    <>
      {/* iOS safe-area overlay – gör remsan högst upp grön */}
      <div
        className="fixed inset-x-0 top-0 z-50 bg-green-800 pointer-events-none"
        style={{ height: 'env(safe-area-inset-top)' }}
        aria-hidden="true"
      />

      {/* Grönt band – höjd LÅST här: mobil h-14, desktop md:h-12 */}
      <header className="w-full bg-green-800 text-white shadow-lg h-14 md:h-12 overflow-hidden flex items-center">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-1 px-3">
          {/* Vänster: logga */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="AgriReg"
              width={256}
              height={256}
              className="h-32 w-auto md:h-32 object-contain"
              priority
            />
          </Link>

          {/* Mitten: badge (GÖMS i pilot) */}
          <div className="flex-1 flex justify-center">
            {!isPilotView ? (
              <span
                className="
                  inline-block
                  bg-green-600 text-white
                  text-[10px] md:text-xs
                  px-3 py-1
                  rounded-full
                  whitespace-nowrap
                "
              >
                Demo-data – ej riktiga gårdar
              </span>
            ) : (
              // tomt för att behålla spacing i headern
              <span aria-hidden="true" className="block h-6" />
            )}
          </div>

          {/* Höger: CTA – Boka pilot (GÖMS i pilot) */}
          <div className="shrink-0">
            {!isPilotView ? (
              <a
                href="mailto:pilot@agrireg.se"
                className="
                  bg-white text-green-800
                  font-semibold
                  px-3 py-1
                  rounded-lg shadow
                  hover:bg-green-100
                  transition
                  text-[10px] md:text-xs
                  whitespace-nowrap
                "
              >
                Boka pilot
              </a>
            ) : (
              // placeholder för att inte layout ska hoppa
              <span aria-hidden="true" className="inline-block w-[78px]" />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
