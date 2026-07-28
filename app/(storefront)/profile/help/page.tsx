import { listPublishedFaqs } from "@/lib/storefront/faq";
import { ProfileHelpClient } from "./profile-help-client";

export default async function ProfileHelpPage() {
  const faqs = await listPublishedFaqs();
  return <ProfileHelpClient faqs={faqs} />;
}
