"use client";

/**
 * Same contact / “Wanna Chat?” block as {@link PageBottomSection}, but without
 * the parallax grid image — for /services/* detail pages only.
 */
import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import { pageBottomCopy } from "@/messages/pageBottom";

const trustedLogos = [
  { src: "/images/image-740.png", w: 126, h: 35 },
  { src: "/images/image-744.png", w: 87, h: 29 },
  { src: "/images/image-745.png", w: 97, h: 29 },
  { src: "/images/image-741.png", w: 90, h: 22 },
];

export default function PageBottomSectionService() {
  const locale = useLocale();
  const c = pageBottomCopy[locale];

  return (
    <div className="bottom_com_sec bottom_com_sec--service relative z-10">
      <div className="blogmidbot" id="contactus">
        <div className="blogmidbotwrap">
          <div className="blogmidbotlft">
            <h3>{c.chatTitle}</h3>
            <div className="blogmidbotlftin">
              <h4>{c.callTitle}</h4>
              <p>
                {c.tlv} <a href="tel:+972-73-744-3322">+972-73-744-3322</a>
              </p>
              <p>
                {c.nySf} <a href="tel:+14086277350">+1408-627-7350</a>
              </p>
            </div>
            <div className="blogmidbotlftin">
              <h4>{c.mailTitle}</h4>
              <p>
                <a href="mailto:fun@triolla.io">fun@triolla.io</a>
              </p>
              <p>
                <strong>{c.hq}</strong> {c.addressLine}
              </p>
            </div>
            <div className="blogmtrusted blogmtrusteddesk">
              <h5>{c.trustedTitle}</h5>
              <ul>
                {trustedLogos.map((logo, i) => (
                  <li key={i}>
                    <div className="trustedimg">
                      <span>
                        <Image src={logo.src} alt="" width={logo.w} height={logo.h} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="blogmidbotrgt">
            <h4 className="whitespace-normal min-[768px]:whitespace-pre-line">{c.scheduleTitle}</h4>
            <div className="blogmidbotrgmob">
              <h5>{c.mobileCallTitle}</h5>
              <p className="tel">
                {c.tlv} <a href="tel:+972-73-744-3322">+972-73-744-3322</a>
              </p>
            </div>
            <div className="blogmidbotrfrm">
              <form action="#" method="post">
                <div className="blogmidbotrfrm-field">
                  <input type="text" name="fullname" placeholder={c.placeholders.fullName} />
                </div>
                <div className="blogmidbotrfrm-field">
                  <input type="text" name="phone" placeholder={c.placeholders.phone} />
                </div>
                <div className="blogmidbotrfrm-field">
                  <input type="email" name="email" placeholder={c.placeholders.email} />
                </div>
                <div className="submit-btn">
                  <input type="submit" value={c.submit} />
                </div>
              </form>
            </div>
            <div className="blogmtrusted blogmtrustedmob">
              <h5>{c.trustedTitle}</h5>
              <ul>
                {trustedLogos.map((logo, i) => (
                  <li key={i}>
                    <div className="trustedimg">
                      <span>
                        <Image src={logo.src} alt="" width={logo.w} height={logo.h} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ clear: "both" }} />
        </div>
      </div>
    </div>
  );
}
