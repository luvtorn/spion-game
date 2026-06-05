type TopbarProps = {
  round: number
}

export function Topbar({ round }: TopbarProps) {
  return (
    <section className="topbar" aria-label="Информация об игре">
      <div>
        <p className="eyebrow">настольная игра</p>
        <h1>Шпион</h1>
      </div>
      <div className="round-badge">
        <span>Раунд</span>
        <strong>{round}</strong>
      </div>
    </section>
  )
}
