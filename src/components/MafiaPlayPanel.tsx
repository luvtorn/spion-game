import { motion } from 'framer-motion'
import type { MafiaAssignment, MafiaGame, Player } from '../types'
import { getMafiaTeammates } from '../utils/mafia'

type MafiaPlayPanelProps = {
  game: MafiaGame | null
  players: Player[]
  activeIndex: number
  isCardOpen: boolean
  onCardClick: () => void
  onStartGame: () => void
  onResetGame: () => void
}

export function MafiaPlayPanel({
  game,
  players,
  activeIndex,
  isCardOpen,
  onCardClick,
  onStartGame,
  onResetGame,
}: MafiaPlayPanelProps) {
  const activePlayer = players[activeIndex]
  const shownEveryone = activeIndex >= players.length
  const assignment = game ? getAssignment(game.assignments, activePlayer?.id) : undefined
  const firstSpeaker = game
    ? players.find((player) => player.id === game.firstSpeakerId)?.name
    : undefined
  const teammates =
    game && assignment?.role.team === 'mafia'
      ? getMafiaTeammates(game.assignments, assignment.playerId, players)
      : []

  return (
    <section className="play-panel mafia-play" aria-live="polite">
      {!game ? (
        <div className="empty-state">
          <div className="signal-ring mafia-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">режим мафии</p>
          <h2>Настройте игроков и раздайте роли по кругу.</h2>
          <p>
            Каждый игрок открывает карточку, запоминает роль и вторым нажатием передаёт телефон
            дальше.
          </p>
        </div>
      ) : shownEveryone ? (
        <div className="finish-state">
          <p className="eyebrow">роли разданы</p>
          <h2>Город засыпает</h2>
          <div className="speaker-card">
            <span>Первое слово днём</span>
            <strong>{firstSpeaker ?? 'Случайный игрок'}</strong>
          </div>
          <div className="mafia-night-order">
            <span>Порядок ночи</span>
            <p>Мафия выбирает жертву → Комиссар проверяет → Доктор лечит</p>
          </div>
          <div className="actions">
            <button className="primary-button" type="button" onClick={onStartGame}>
              Новая партия
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
                роль {activeIndex + 1} из {players.length}
              </p>
              <h2>{activePlayer.name}</h2>
            </div>
            <div className="place-chip">Мафия</div>
          </div>

          <motion.button
            className={isCardOpen ? 'role-card mafia-role revealed' : 'role-card mafia-role'}
            type="button"
            onClick={onCardClick}
            whileHover={{ y: -4, rotateX: 1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <span className="card-shine" />
            {!isCardOpen || !assignment ? (
              <>
                <small>секретная роль</small>
                <strong>Нажми, чтобы открыть</strong>
                <em>После просмотра нажми ещё раз, чтобы передать ход дальше.</em>
              </>
            ) : (
              <>
                <small>{assignment.role.team === 'mafia' ? 'команда мафии' : 'команда города'}</small>
                <strong>{assignment.role.name}</strong>
                <em>{assignment.role.description}</em>
                {teammates.length > 0 ? (
                  <span className="mafia-team">Ваша команда: {teammates.join(', ')}</span>
                ) : null}
              </>
            )}
          </motion.button>

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

function getAssignment(assignments: MafiaAssignment[], playerId?: string) {
  return assignments.find((assignment) => assignment.playerId === playerId)
}
