import { useMemo, useState } from 'react'
import { defaultCategories } from '../data/categories'
import type { Category } from '../types'
import { pickRandom } from '../utils/game'

const STORAGE_KEY = 'spy-game-custom-categories-v1'
const defaultCustomPlaces = ['Новое место']
const customAccents = ['#2dd4bf', '#f59e0b', '#60a5fa', '#fb7185', '#a78bfa', '#34d399']

function createId() {
  return crypto.randomUUID ? crypto.randomUUID() : `custom-category-${Date.now()}`
}

function normalizeCustomCategory(category: Category): Category {
  const places = category.places.length > 0 ? category.places : defaultCustomPlaces
  const hasFilledPlace = places.some((place) => place.trim())

  return {
    id: category.id || createId(),
    name: category.name.trim() || 'Своя категория',
    accent: category.accent || pickRandom(customAccents),
    places: hasFilledPlace ? places : defaultCustomPlaces,
    isCustom: true,
  }
}

function readCustomCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as Category[]
    return parsed
      .filter((category) => category.id && typeof category.name === 'string')
      .map(normalizeCustomCategory)
  } catch {
    return []
  }
}

function saveCustomCategories(categories: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.map(normalizeCustomCategory)))
}

export function useCategories() {
  const [customCategories, setCustomCategories] = useState<Category[]>(readCustomCategories)

  const categories = useMemo(
    () => [...defaultCategories, ...customCategories],
    [customCategories],
  )

  function updateCustomCategories(updater: (categories: Category[]) => Category[]) {
    setCustomCategories((current) => {
      const nextCategories = updater(current).map(normalizeCustomCategory)
      saveCustomCategories(nextCategories)
      return nextCategories
    })
  }

  function addCustomCategory(name: string) {
    const category: Category = {
      id: createId(),
      name: name.trim() || `Своя категория ${customCategories.length + 1}`,
      accent: customAccents[customCategories.length % customAccents.length],
      places: defaultCustomPlaces,
      isCustom: true,
    }

    updateCustomCategories((current) => [...current, category])
    return category.id
  }

  function deleteCustomCategory(categoryId: string) {
    updateCustomCategories((current) => current.filter((category) => category.id !== categoryId))
  }

  function renameCustomCategory(categoryId: string, name: string) {
    updateCustomCategories((current) =>
      current.map((category) => (category.id === categoryId ? { ...category, name } : category)),
    )
  }

  function addPlace(categoryId: string) {
    updateCustomCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? { ...category, places: [...category.places, `Место ${category.places.length + 1}`] }
          : category,
      ),
    )
  }

  function updatePlace(categoryId: string, placeIndex: number, place: string) {
    updateCustomCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              places: category.places.map((currentPlace, index) =>
                index === placeIndex ? place : currentPlace,
              ),
            }
          : category,
      ),
    )
  }

  function deletePlace(categoryId: string, placeIndex: number) {
    updateCustomCategories((current) =>
      current.map((category) => {
        if (category.id !== categoryId || category.places.length <= 1) {
          return category
        }

        return {
          ...category,
          places: category.places.filter((_, index) => index !== placeIndex),
        }
      }),
    )
  }

  return {
    categories,
    addCustomCategory,
    deleteCustomCategory,
    renameCustomCategory,
    addPlace,
    updatePlace,
    deletePlace,
  }
}
