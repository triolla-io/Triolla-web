import Image from "next/image";

export default function HeroJumpSvgs() {
  return (
    <>
      <div className="portfolio_jump_1">
        <Image
          src="/images/jumping_1-1.svg"
          alt=""
          width={215}
          height={95}
          sizes="(max-width: 640px) 120px, (max-width: 1199px) 48px, 215px"
          priority
          className="max-[640px]:!w-[120px] max-[640px]:!h-[38px] max-[640px]:object-contain min-[641px]:max-[1199px]:!h-[clamp(34px,5vw,45px)] min-[641px]:max-[1199px]:!w-auto lg:!w-auto lg:!h-auto"
        />
      </div>
      <div className="portfolio_jump_2">
        <Image
          src="/images/jumping_2-1.svg"
          alt=""
          width={263}
          height={105}
          sizes="(max-width: 640px) 120px, (max-width: 1199px) 56px, 263px"
          priority
          className="max-[640px]:!w-[120px] max-[640px]:!h-[38px] max-[640px]:object-contain min-[641px]:max-[1199px]:!h-[clamp(34px,5vw,45px)] min-[641px]:max-[1199px]:!w-auto lg:!w-auto lg:!h-auto"
        />
      </div>
      <div className="portfolio_jump_3">
        <Image
          src="/images/jumping_3-1.svg"
          alt=""
          width={116}
          height={107}
          sizes="(max-width: 640px) 120px, (max-width: 1199px) 52px, 116px"
          priority
          className="max-[640px]:!w-[120px] max-[640px]:!h-[38px] max-[640px]:object-contain min-[641px]:max-[1199px]:!h-[clamp(34px,5vw,45px)] min-[641px]:max-[1199px]:!w-auto lg:!w-auto lg:!h-auto"
        />
      </div>
    </>
  );
}
