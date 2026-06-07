import { useMemo, useState } from 'react'
import './App.css'
import { GameTabs } from './components/GameTabs'
import { MafiaPlayPanel } from './components/MafiaPlayPanel'
import { MafiaSetupPanel } from './components/MafiaSetupPanel'
import { PlayPanel } from './components/PlayPanel'
import { SetupPanel } from './components/SetupPanel'
import { Topbar } from './components/Topbar'
import { defaultCategories } from './data/categories'
import { useCategories } from './hooks/useCategories'
import { usePlayers } from './hooks/usePlayers'
import type { GameMode, MafiaGame, SpyGame } from './types'
import { pickRandom } from './utils/game'
import { MIN_MAFIA_PLAYERS, assignMafiaRoles } from './utils/mafia'

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
  const [mode, setMode] = useState<GameMode>('spy')
  const [categoryId, setCategoryId] = useState(defaultCategories[0].id)
  const [spyGame, setSpyGame] = useState<SpyGame | null>(null)
  const [mafiaGame, setMafiaGame] = useState<MafiaGame | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [round, setRound] = useState(1)

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? categories[0],
    [categories, categoryId],
  )

  const activeGame = mode === 'spy' ? spyGame : mafiaGame

  function startSpyGame() {
    const cleanPlayers = cleanupPlayerNames()
    const spy = pickRandom(cleanPlayers)
    const firstSpeaker = pickRandom(cleanPlayers)
    const places = selectedCategory.places.map((place) => place.trim()).filter(Boolean)

    setSpyGame({
      category: selectedCategory,
      place: pickRandom(places),
      spyId: spy.id,
      firstSpeakerId: firstSpeaker.id,
    })
    resetRevealState()
    setRound((current) => current + 1)
  }

  function startMafiaGame() {
    const cleanPlayers = cleanupPlayerNames()

    if (cleanPlayers.length < MIN_MAFIA_PLAYERS) {
      return
    }

    setMafiaGame({
      assignments: assignMafiaRoles(cleanPlayers),
      firstSpeakerId: pickRandom(cleanPlayers).id,
    })
    resetRevealState()
    setRound((current) => current + 1)
  }

  function handleDeleteCustomCategory(categoryIdToDelete: string) {
    deleteCustomCategory(categoryIdToDelete)

    if (categoryId === categoryIdToDelete) {
      setCategoryId(defaultCategories[0].id)
    }
  }

  function handleModeChange(nextMode: GameMode) {
    setMode(nextMode)
    resetRevealState()
  }

  function handleCardClick() {
    if (!activeGame) return

    if (!isCardOpen) {
      setIsCardOpen(true)
      return
    }

    setIsCardOpen(false)
    setActiveIndex((current) => current + 1)
  }

  function resetGame() {
    if (mode === 'spy') {
      setSpyGame(null)
    } else {
      setMafiaGame(null)
    }

    resetRevealState()
  }

  function resetRevealState() {
    setActiveIndex(0)
    setIsCardOpen(false)
  }

  return (
    <main className="app-shell">
      <Topbar round={round} />
      <GameTabs mode={mode} onModeChange={handleModeChange} />

      <section className={activeGame ? 'game-layout playing' : 'game-layout'}>
        {mode === 'spy' ? (
          <SetupPanel
            categories={categories}
            selectedCategoryId={categoryId}
            players={players}
            onCategoryChange={setCategoryId}
            onPlayerCountChange={setPlayerCount}
            onPlayerRename={renamePlayer}
            onStartGame={startSpyGame}
            onResetGame={resetGame}
            onAddCustomCategory={addCustomCategory}
            onDeleteCustomCategory={handleDeleteCustomCategory}
            onRenameCustomCategory={renameCustomCategory}
            onAddPlace={addPlace}
            onUpdatePlace={updatePlace}
            onDeletePlace={deletePlace}
          />
        ) : (
          <MafiaSetupPanel
            players={players}
            onPlayerCountChange={setPlayerCount}
            onPlayerRename={renamePlayer}
            onStartGame={startMafiaGame}
            onResetGame={resetGame}
          />
        )}

        {mode === 'spy' ? (
          <PlayPanel
            game={spyGame}
            players={players}
            activeIndex={activeIndex}
            isCardOpen={isCardOpen}
            onCardClick={handleCardClick}
            onStartGame={startSpyGame}
            onResetGame={resetGame}
          />
        ) : (
          <MafiaPlayPanel
            game={mafiaGame}
            players={players}
            activeIndex={activeIndex}
            isCardOpen={isCardOpen}
            onCardClick={handleCardClick}
            onStartGame={startMafiaGame}
            onResetGame={resetGame}
          />
        )}
      </section>
    </main>
  )
}

export default App
