import Image from 'next/image'

type Media = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null }

type Props = {
  headline: string
  sub?: string | null
  image?: Media | string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  variant?: 'default' | 'services' | 'portfolio' | 'blog' | null
}

export default function HeroBlock({ headline, sub, image, ctaLabel, ctaHref }: Props) {
  const src = image && typeof image === 'object' ? image.url : null
  return (
    <section className="homemaintopone portfolio_text show">
      <div className="container">
        <h1>{headline}</h1>
        {sub && <p>{sub}</p>}
        {ctaLabel && ctaHref && (
          <a href={ctaHref} className="postfolio_banner_but show">
            {ctaLabel}
          </a>
        )}
      </div>
      {src && (
        <div className="hometopimages show">
          <Image src={src} alt={headline} fill style={{ objectFit: 'cover' }} priority />
        </div>
      )}
    </section>
  )
}
