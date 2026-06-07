import { motion } from 'framer-motion'
import type { GameMode } from '../types'

type GameTabsProps = {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
}

const tabs: Array<{ id: GameMode; label: string; hint: string }> = [
  { id: 'spy', label: 'Шпион', hint: 'локации и один тайный игрок' },
  { id: 'mafia', label: 'Мафия', hint: 'роли, ночь и голосование' },
]

export function GameTabs({ mode, onModeChange }: GameTabsProps) {
  return (
    <div className="game-tabs" role="tablist" aria-label="Выбор игры">
      {tabs.map((tab) => (
        <button
          className={mode === tab.id ? 'game-tab active' : 'game-tab'}
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          onClick={() => onModeChange(tab.id)}
        >
          {mode === tab.id ? (
            <motion.span
              className="tab-glow"
              layoutId="active-tab-glow"
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            />
          ) : null}
          <strong>{tab.label}</strong>
          <small>{tab.hint}</small>
        </button>
      ))}
    </div>
  )
}
