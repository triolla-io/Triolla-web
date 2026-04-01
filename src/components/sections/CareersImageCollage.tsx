"use client";

import Image from "next/image";

const COLLAGE: { id: string; src: string; w: number; h: number; className: string }[] = [
  { id: "1", src: "/images/career_g_1.png", w: 249, h: 453, className: "careerimgs careerimgs1 grid__item" },
  { id: "2", src: "/images/career_g_2.png", w: 383, h: 383, className: "careerimgs careerimgs2 grid__item" },
  { id: "3", src: "/images/career_g_3.png", w: 256, h: 256, className: "careerimgs careerimgs3 grid__item" },
  { id: "4", src: "/images/career_g_4.png", w: 339, h: 339, className: "careerimgs careerimgs4 grid__item" },
  { id: "5", src: "/images/career_g_5.png", w: 570, h: 285, className: "careerimgs careerimgs5 grid__item" },
  { id: "6", src: "/images/career_g_6.png", w: 326, h: 407, className: "careerimgs careerimgs6 grid__item" },
  { id: "7", src: "/images/career_g_7.png", w: 230, h: 285, className: "careerimgs careerimgs7 grid__item" },
  { id: "8", src: "/images/career_g_8.png", w: 237, h: 285, className: "careerimgs careerimgs8 grid__item" },
  { id: "9", src: "/images/career_g_9.png", w: 697, h: 383, className: "careerimgs careerimgs9 grid__item" },
  { id: "10", src: "/images/career_g_10.png", w: 284, h: 285, className: "careerimgs careerimgs10 grid__item" },
];

export default function CareersImageCollage() {
  return (
    <>
      <div className="career_grid_space" aria-hidden />
      <div className="career_grid1">
        <div
          className="career_gridimage_sec_inner"
          style={{
            backgroundImage: "url(/images/career_gridimage_bg.svg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            backgroundSize: "cover",
          }}
        >
          <div className="career_gridimage_in">
            <div className="cargridmob1 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/caryelomidmobl.svg" alt="" />
            </div>
            <div className="cargridmob2 pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/caryelomidmobr.svg" alt="" />
            </div>
            <div className="grid career-image-grid">
              {COLLAGE.map((item) => (
                <div key={item.id} className={item.className}>
                  <div className="grid__item-img">
                    <Image
                      src={item.src}
                      alt=""
                      width={item.w}
                      height={item.h}
                      className="h-auto max-w-full"
                      sizes="(max-width: 767px) 50vw, 12vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
