import { useEffect, useState } from 'react'
import type { Player } from '../types'
import {
  clampPlayerCount,
  createPlayer,
  defaultPlayers,
  MIN_PLAYERS,
  normalizePlayers,
} from '../utils/game'

const STORAGE_KEY = 'spy-game-players-v1'

function readSavedPlayers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPlayers

    const parsed = JSON.parse(raw) as Player[]
    const players = parsed
      .filter((player) => player.id && typeof player.name === 'string')
      .map((player, index) => ({
        id: player.id,
        name: player.name.trim() || `Игрок ${index + 1}`,
      }))

    return players.length >= MIN_PLAYERS ? players : defaultPlayers
  } catch {
    return defaultPlayers
  }
}

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>(readSavedPlayers)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
  }, [players])

  function setPlayerCount(count: number) {
    const nextCount = clampPlayerCount(count)

    setPlayers((current) => {
      if (nextCount > current.length) {
        return [
          ...current,
          ...Array.from({ length: nextCount - current.length }, (_, index) =>
            createPlayer(current.length + index),
          ),
        ]
      }

      return current.slice(0, nextCount)
    })
  }

  function renamePlayer(id: string, name: string) {
    setPlayers((current) =>
      current.map((player) => (player.id === id ? { ...player, name } : player)),
    )
  }

  function cleanupPlayerNames() {
    const cleanPlayers = normalizePlayers(players)
    setPlayers(cleanPlayers)
    return cleanPlayers
  }

  return {
    players,
    setPlayerCount,
    renamePlayer,
    cleanupPlayerNames,
  }
}
