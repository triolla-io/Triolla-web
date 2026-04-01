"use client";

import ScrollReveal from "@/components/ScrollReveal";
import ServiceDetailLayout, { serviceDetailBodyPClass, serviceDetailLeadClass } from "@/components/ServiceDetailLayout";
import { useLocale } from "@/components/LocaleProvider";
import { services } from "@/messages/services";

export default function Page() {
  const locale = useLocale();
  const m = services[locale].backEndDev;
  return (
    <ServiceDetailLayout
      title={m.title}
      heroImageSrc="/images/Frame-2147224231.png"
      heroImageAlt="Back End Development"
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <ScrollReveal direction="up">
        <p className={serviceDetailLeadClass}>{m.lead}</p>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.1}>
        {m.paragraphs.map((p, i) => (
          <p key={i} className={serviceDetailBodyPClass}>{p}</p>
        ))}
      </ScrollReveal>
    </ServiceDetailLayout>
  );
}
