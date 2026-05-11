import Link from "next/link";
// Saya lihat kamu import icon ini sebelumnya, mari kita gunakan untuk overlay-nya!
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";

export function BillingButton() {
  

  return (
    <div className="relative inline-block w-max rounded-xl overflow-hidden group cursor-pointer">
      
      <div className={`transition-opacity duration-300 opacity-100 hover:opacity-80`}>
        <Link
          href={"https://trakteer.id/yqh3vvbszxdhvq5epsb0/tip"}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          <img
            id="wse-buttons-preview"
            src="https://edge-cdn.trakteer.id/images/embed/trbtn-red-1.png?v=14-05-2025"
            height={40}
            style={{ border: 0, height: '40px' }}
            alt="Trakteer Saya"
          />
        </Link>
      </div>
      
    </div>
  );
}