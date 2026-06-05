export type Category = {
  id: string
  name: string
  accent: string
  places: string[]
}

export type Player = {
  id: string
  name: string
}

export type Game = {
  category: Category
  place: string
  spyId: string
  firstSpeakerId: string
  startedAt: number
}
