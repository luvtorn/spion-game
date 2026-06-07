import type { MafiaRole } from '../types'

export const mafiaRoles: Record<MafiaRole['id'], MafiaRole> = {
  mafia: {
    id: 'mafia',
    name: 'Мафия',
    team: 'mafia',
    description: 'Просыпается ночью с командой мафии и выбирает жертву.',
  },
  don: {
    id: 'don',
    name: 'Дон мафии',
    team: 'mafia',
    description: 'Играет за мафию. Может руководить ночным выбором команды.',
  },
  commissar: {
    id: 'commissar',
    name: 'Комиссар',
    team: 'city',
    description: 'Каждую ночь проверяет одного игрока и ищет мафию.',
  },
  doctor: {
    id: 'doctor',
    name: 'Доктор',
    team: 'city',
    description: 'Каждую ночь выбирает игрока, которого пытается спасти.',
  },
  civilian: {
    id: 'civilian',
    name: 'Мирный житель',
    team: 'city',
    description: 'Ищет мафию днём через обсуждение и голосование.',
  },
}
