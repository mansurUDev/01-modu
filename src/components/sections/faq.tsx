import { Accordion } from "@/components/ui/accordion";
import { Container, Eyebrow, Section } from "./section-shell";

/**
 * Five questions from TZ.md Часть C §7, verbatim. The last one is the
 * honest "this is not a real store" disclaimer — TZ.md flags it as
 * deliberate: on a portfolio piece it works harder than any feature copy.
 */

const FAQ_ITEMS = [
  {
    title: "How fast is shipping?",
    content:
      "Orders ship within 2 business days. Delivery takes 3–7 days worldwide. Shipping is free over $99.",
  },
  {
    title: "Can I return it?",
    content:
      "Yes. 30 days, no questions. If the deck is not for you, send it back for a full refund.",
  },
  {
    title: "Will it work with my apps?",
    content:
      "MODU works with macOS 12+ and Windows 10+. It ships with profiles for popular apps, and you can map any module to any shortcut yourself.",
  },
  {
    title: "What about warranty?",
    content:
      "Two years on every module. The aluminum will outlive the warranty. The magnets will outlive you.",
  },
  {
    title: "Is this a real store?",
    content:
      "No. MODU is a design concept and this site is a frontend demo. You can go through the whole checkout — nothing will be charged and nothing will arrive. Sorry.",
  },
];

export function Faq() {
  return (
    <Section id="faq">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow index="05" label="FAQ" />
          <h2 className="font-display text-h2 tracking-[-0.02em] text-heading">
            Questions, answered.
          </h2>
        </div>

        <div className="max-w-[46rem]">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </Container>
    </Section>
  );
}
