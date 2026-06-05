import { useMemo, useState } from 'react'
import './App.css'
import { PlayPanel } from './components/PlayPanel'
import { SetupPanel } from './components/SetupPanel'
import { Topbar } from './components/Topbar'
import { defaultCategories } from './data/categories'
import { useCategories } from './hooks/useCategories'
import { usePlayers } from './hooks/usePlayers'
import type { Game } from './types'
import { pickRandom } from './utils/game'

function App() {
  const {
    categories,
    addCustomCategory,
    deleteCustomCategory,
    renameCustomCategory,
    addPlace,
    updatePlace,
    deletePlace,
  } = useCategories()
  const { players, setPlayerCount, renamePlayer, cleanupPlayerNames } = usePlayers()
  const [categoryId, setCategoryId] = useState(defaultCategories[0].id)
  const [game, setGame] = useState<Game | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [round, setRound] = useState(1)

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? categories[0],
    [categories, categoryId],
  )

  function startGame() {
    const cleanPlayers = cleanupPlayerNames()
    const spy = pickRandom(cleanPlayers)
    const firstSpeaker = pickRandom(cleanPlayers)
    const places = selectedCategory.places.map((place) => place.trim()).filter(Boolean)

    setGame({
      category: selectedCategory,
      place: pickRandom(places),
      spyId: spy.id,
      firstSpeakerId: firstSpeaker.id,
      startedAt: Date.now(),
    })
    setActiveIndex(0)
    setIsCardOpen(false)
    setRound((current) => current + 1)
  }

  function handleDeleteCustomCategory(categoryIdToDelete: string) {
    deleteCustomCategory(categoryIdToDelete)

    if (categoryId === categoryIdToDelete) {
      setCategoryId(defaultCategories[0].id)
    }
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
          onAddCustomCategory={addCustomCategory}
          onDeleteCustomCategory={handleDeleteCustomCategory}
          onRenameCustomCategory={renameCustomCategory}
          onAddPlace={addPlace}
          onUpdatePlace={updatePlace}
          onDeletePlace={deletePlace}
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
