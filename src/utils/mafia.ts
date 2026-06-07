import { mafiaRoles } from '../data/mafiaRoles'
import type { MafiaAssignment, MafiaRole, Player } from '../types'

export const MIN_MAFIA_PLAYERS = 5

export function getMafiaRoleSet(playerCount: number): MafiaRole[] {
  const roles: MafiaRole[] = []

  if (playerCount >= 9) {
    roles.push(mafiaRoles.don)
  }

  roles.push(mafiaRoles.mafia)

  if (playerCount >= 7) {
    roles.push(mafiaRoles.mafia)
  }

  if (playerCount >= 10) {
    roles.push(mafiaRoles.mafia)
  }

  roles.push(mafiaRoles.commissar)

  if (playerCount >= 6) {
    roles.push(mafiaRoles.doctor)
  }

  while (roles.length < playerCount) {
    roles.push(mafiaRoles.civilian)
  }

  return roles.slice(0, playerCount)
}

export function getMafiaRoleSummary(playerCount: number) {
  return getMafiaRoleSet(playerCount).reduce<Record<string, number>>((summary, role) => {
    summary[role.name] = (summary[role.name] ?? 0) + 1
    return summary
  }, {})
}

export function assignMafiaRoles(players: Player[]) {
  const shuffledPlayers = shuffle(players)
  const shuffledRoles = shuffle(getMafiaRoleSet(players.length))

  return shuffledPlayers.map<MafiaAssignment>((player, index) => ({
    playerId: player.id,
    role: shuffledRoles[index],
  }))
}

export function getMafiaTeammates(assignments: MafiaAssignment[], playerId: string, players: Player[]) {
  const playerById = new Map(players.map((player) => [player.id, player.name]))

  return assignments
    .filter((assignment) => assignment.role.team === 'mafia' && assignment.playerId !== playerId)
    .map((assignment) => playerById.get(assignment.playerId))
    .filter(Boolean)
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}
