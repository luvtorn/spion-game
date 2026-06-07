import type { Player } from '../types'
import { MAX_PLAYERS } from '../utils/game'
import { MIN_MAFIA_PLAYERS, getMafiaRoleSummary } from '../utils/mafia'

type MafiaSetupPanelProps = {
  players: Player[]
  onPlayerCountChange: (count: number) => void
  onPlayerRename: (id: string, name: string) => void
  onStartGame: () => void
  onResetGame: () => void
}

export function MafiaSetupPanel({
  players,
  onPlayerCountChange,
  onPlayerRename,
  onStartGame,
  onResetGame,
}: MafiaSetupPanelProps) {
  const canStart = players.length >= MIN_MAFIA_PLAYERS
  const roleSummary = getMafiaRoleSummary(players.length)

  return (
    <aside className="setup-panel mafia-setup" aria-label="Настройки Мафии">
      <div className="panel-head">
        <div>
          <p className="eyebrow">подготовка</p>
          <h2>Мафия</h2>
        </div>
        <button className="ghost-button" type="button" onClick={onResetGame}>
          Сбросить
        </button>
      </div>

      <div className="control-row">
        <div>
          <span className="label">Игроков</span>
          <p className="hint">
            От {MIN_MAFIA_PLAYERS} до {MAX_PLAYERS} человек
          </p>
        </div>
        <div className="stepper" aria-label="Количество игроков">
          <button type="button" onClick={() => onPlayerCountChange(players.length - 1)}>
            -
          </button>
          <strong>{players.length}</strong>
          <button type="button" onClick={() => onPlayerCountChange(players.length + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="mafia-rules-card">
        <span className="label">Как играть</span>
        <p>
          Ведущий раздаёт роли. Ночью мафия выбирает жертву, комиссар проверяет игрока, доктор
          лечит. Днём все обсуждают и голосуют. Мирные побеждают, если нашли всю мафию; мафия
          побеждает, если сравнялась по числу с мирными.
        </p>
      </div>

      <div className="role-preview">
        <div className="list-title">
          <span className="label">Состав ролей</span>
          {!canStart ? <span className="warning-pill">нужно 5+</span> : null}
        </div>
        <div className="role-preview-grid">
          {Object.entries(roleSummary).map(([roleName, count]) => (
            <div className="role-preview-card" key={roleName}>
              <strong>{count}</strong>
              <span>{roleName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="players-list">
        <div className="list-title">
          <span className="label">Имена игроков</span>
          <span className="save-pill">сохраняются</span>
        </div>
        {players.map((player, index) => (
          <label className="player-input" key={player.id}>
            <span>{index + 1}</span>
            <input
              value={player.name}
              onChange={(event) => onPlayerRename(player.id, event.target.value)}
              aria-label={`Имя игрока ${index + 1}`}
            />
          </label>
        ))}
      </div>

      <button className="primary-button" type="button" disabled={!canStart} onClick={onStartGame}>
        Начать Мафию
      </button>
    </aside>
  )
}
