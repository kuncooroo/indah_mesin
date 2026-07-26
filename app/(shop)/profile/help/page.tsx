import { listPublishedFaqs } from "@/lib/faq-shop";
import { ProfileHelpClient } from "./profile-help-client";

export default async function ProfileHelpPage() {
  const faqs = await listPublishedFaqs();
  return <ProfileHelpClient faqs={faqs} />;
}
