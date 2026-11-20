import { BirthdayApp } from "@/components/BirthdayApp";
import { getContent } from "@/lib/content";

export default function Page() {
  return <BirthdayApp content={getContent()} />;
}
