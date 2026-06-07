import type { Player, SpyGame } from '../types'
import { RoleCard } from './RoleCard'

type PlayPanelProps = {
  game: SpyGame | null
  players: Player[]
  activeIndex: number
  isCardOpen: boolean
  onCardClick: () => void
  onStartGame: () => void
  onResetGame: () => void
}

export function PlayPanel({
  game,
  players,
  activeIndex,
  isCardOpen,
  onCardClick,
  onStartGame,
  onResetGame,
}: PlayPanelProps) {
  const activePlayer = players[activeIndex]
  const shownEveryone = activeIndex >= players.length
  const isSpy = game?.spyId === activePlayer?.id
  const firstSpeaker = game
    ? players.find((player) => player.id === game.firstSpeakerId)?.name
    : undefined

  return (
    <section className="play-panel" aria-live="polite">
      {!game ? (
        <div className="empty-state">
          <div className="signal-ring" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">готово к запуску</p>
          <h2>Выберите категорию, проверьте имена и начните раунд.</h2>
          <p>
            Каждый игрок нажимает карточку, смотрит роль и вторым нажатием передаёт ход дальше.
          </p>
        </div>
      ) : shownEveryone ? (
        <div className="finish-state">
          <p className="eyebrow">карты разданы</p>
          <h2>Можно начинать обсуждение</h2>
          <div className="place-chip">Категория: {game.category.name}</div>
          <div className="speaker-card">
            <span>Первое слово</span>
            <strong>{firstSpeaker ?? 'Случайный игрок'}</strong>
          </div>
          <div className="actions">
            <button className="primary-button" type="button" onClick={onStartGame}>
              Новый раунд
            </button>
            <button className="secondary-button" type="button" onClick={onResetGame}>
              К настройкам
            </button>
          </div>
        </div>
      ) : (
        <div className="role-stage">
          <div className="turn-header">
            <div>
              <p className="eyebrow">
                ход {activeIndex + 1} из {players.length}
              </p>
              <h2>{activePlayer.name}</h2>
            </div>
            <div className="place-chip">{game.category.name}</div>
          </div>

          <RoleCard
            isOpen={isCardOpen}
            isSpy={Boolean(isSpy)}
            place={game.place}
            onClick={onCardClick}
          />

          <div className="actions">
            <button className="secondary-button" type="button" onClick={onStartGame}>
              Перераздать
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
