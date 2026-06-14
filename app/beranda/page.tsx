/**
 * Beranda Page — Redirect to first provider slug (/drama)
 *
 * Real content lives at /drama, /animes1, /movies1, etc.
 */

import { redirect } from "next/navigation";
import { getAllProvidersFromAPI } from "@/app/actions/drama";
import { getProviderPageSlug } from "@/components/beranda/utils/constants";
import type { Provider } from "@/components/beranda/types";

export default async function BerandaPage() {
  const providers: Provider[] = await getAllProvidersFromAPI().catch(() => []);

  if (providers.length === 0) {
    redirect("/drama");
  }

  const firstSlug = getProviderPageSlug(providers[0], providers, 0);
  redirect(`/${firstSlug}`);
}
