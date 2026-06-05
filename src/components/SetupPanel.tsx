import type { Category, Player } from '../types'
import { MAX_PLAYERS, MIN_PLAYERS } from '../utils/game'
import { CategoryManager } from './CategoryManager'

type SetupPanelProps = {
  categories: Category[]
  selectedCategoryId: string
  players: Player[]
  onCategoryChange: (categoryId: string) => void
  onPlayerCountChange: (count: number) => void
  onPlayerRename: (id: string, name: string) => void
  onStartGame: () => void
  onResetGame: () => void
  onAddCustomCategory: (name: string) => string
  onDeleteCustomCategory: (categoryId: string) => void
  onRenameCustomCategory: (categoryId: string, name: string) => void
  onAddPlace: (categoryId: string) => void
  onUpdatePlace: (categoryId: string, placeIndex: number, place: string) => void
  onDeletePlace: (categoryId: string, placeIndex: number) => void
}

export function SetupPanel({
  categories,
  selectedCategoryId,
  players,
  onCategoryChange,
  onPlayerCountChange,
  onPlayerRename,
  onStartGame,
  onResetGame,
  onAddCustomCategory,
  onDeleteCustomCategory,
  onRenameCustomCategory,
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
}: SetupPanelProps) {
  return (
    <aside className="setup-panel" aria-label="Настройки игры">
      <div className="panel-head">
        <div>
          <p className="eyebrow">подготовка</p>
          <h2>Партия</h2>
        </div>
        <button className="ghost-button" type="button" onClick={onResetGame}>
          Сбросить
        </button>
      </div>

      <div className="control-row">
        <div>
          <span className="label">Игроков</span>
          <p className="hint">
            От {MIN_PLAYERS} до {MAX_PLAYERS} человек
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

      <CategoryManager
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={onCategoryChange}
        onAddCustomCategory={onAddCustomCategory}
        onDeleteCustomCategory={onDeleteCustomCategory}
        onRenameCustomCategory={onRenameCustomCategory}
        onAddPlace={onAddPlace}
        onUpdatePlace={onUpdatePlace}
        onDeletePlace={onDeletePlace}
      />

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

      <button className="primary-button" type="button" onClick={onStartGame}>
        Начать игру
      </button>
    </aside>
  )
}
