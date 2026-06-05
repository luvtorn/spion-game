import type { Player } from '../types'

export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 12

export const defaultPlayers: Player[] = [
  { id: 'player-1', name: 'Игрок 1' },
  { id: 'player-2', name: 'Игрок 2' },
  { id: 'player-3', name: 'Игрок 3' },
  { id: 'player-4', name: 'Игрок 4' },
]

export function clampPlayerCount(count: number) {
  return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count))
}

export function createPlayer(index: number): Player {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `player-${Date.now()}-${index}`,
    name: `Игрок ${index + 1}`,
  }
}

export function normalizePlayers(players: Player[]) {
  return players.map((player, index) => ({
    ...player,
    name: player.name.trim() || `Игрок ${index + 1}`,
  }))
}

export function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}
