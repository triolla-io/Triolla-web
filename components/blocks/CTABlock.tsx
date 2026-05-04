type Props = {
  headline: string
  sub?: string | null
  buttonLabel: string
  buttonHref: string
}

export default function CTABlock({ headline, sub, buttonLabel, buttonHref }: Props) {
  return (
    <section className="homecta_sec">
      <div className="container">
        <h2>{headline}</h2>
        {sub && <p>{sub}</p>}
        <a href={buttonHref} className="postfolio_banner_but show">
          {buttonLabel}
        </a>
      </div>
    </section>
  )
}
