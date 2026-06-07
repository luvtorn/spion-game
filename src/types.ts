export type Category = {
  id: string
  name: string
  accent: string
  places: string[]
  isCustom?: boolean
}

export type Player = {
  id: string
  name: string
}

export type GameMode = 'spy' | 'mafia'

export type SpyGame = {
  category: Category
  place: string
  spyId: string
  firstSpeakerId: string
}

export type MafiaRoleId = 'mafia' | 'don' | 'commissar' | 'doctor' | 'civilian'

export type MafiaRole = {
  id: MafiaRoleId
  name: string
  team: 'mafia' | 'city'
  description: string
}

export type MafiaAssignment = {
  playerId: string
  role: MafiaRole
}

export type MafiaGame = {
  assignments: MafiaAssignment[]
  firstSpeakerId: string
}
