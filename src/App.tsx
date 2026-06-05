import { useMemo, useState } from 'react'
import './App.css'
import { PlayPanel } from './components/PlayPanel'
import { SetupPanel } from './components/SetupPanel'
import { Topbar } from './components/Topbar'
import { categories } from './data/categories'
import { usePlayers } from './hooks/usePlayers'
import type { Game } from './types'
import { pickRandom } from './utils/game'

function App() {
  const { players, setPlayerCount, renamePlayer, cleanupPlayerNames } = usePlayers()
  const [categoryId, setCategoryId] = useState(categories[0].id)
  const [game, setGame] = useState<Game | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [round, setRound] = useState(1)

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? categories[0],
    [categoryId],
  )

  function startGame() {
    const cleanPlayers = cleanupPlayerNames()
    const spy = pickRandom(cleanPlayers)
    const firstSpeaker = pickRandom(cleanPlayers)

    setGame({
      category: selectedCategory,
      place: pickRandom(selectedCategory.places),
      spyId: spy.id,
      firstSpeakerId: firstSpeaker.id,
      startedAt: Date.now(),
    })
    setActiveIndex(0)
    setIsCardOpen(false)
    setRound((current) => current + 1)
  }

  function handleCardClick() {
    if (!game) return

    if (!isCardOpen) {
      setIsCardOpen(true)
      return
    }

    setIsCardOpen(false)
    setActiveIndex((current) => current + 1)
  }

  function resetGame() {
    setGame(null)
    setActiveIndex(0)
    setIsCardOpen(false)
  }

  return (
    <main className="app-shell">
      <Topbar round={round} />

      <section className={game ? 'game-layout playing' : 'game-layout'}>
        <SetupPanel
          categories={categories}
          selectedCategoryId={categoryId}
          players={players}
          onCategoryChange={setCategoryId}
          onPlayerCountChange={setPlayerCount}
          onPlayerRename={renamePlayer}
          onStartGame={startGame}
          onResetGame={resetGame}
        />

        <PlayPanel
          game={game}
          players={players}
          activeIndex={activeIndex}
          isCardOpen={isCardOpen}
          onCardClick={handleCardClick}
          onStartGame={startGame}
          onResetGame={resetGame}
        />
      </section>
    </main>
  )
}

export default App
