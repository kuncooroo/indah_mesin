import type { Metadata } from "next";

import { ProfileTermsClient } from "./terms-client";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using MesinBagus by Indah Mesin — marketplace mesin industri dan alur Purchase Order.",
};

export default function ProfileTermsPage() {
  return <ProfileTermsClient />;
}
