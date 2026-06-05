import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Category } from '../types'

type CategoryManagerProps = {
  categories: Category[]
  selectedCategoryId: string
  onCategoryChange: (categoryId: string) => void
  onAddCustomCategory: (name: string) => string
  onDeleteCustomCategory: (categoryId: string) => void
  onRenameCustomCategory: (categoryId: string, name: string) => void
  onAddPlace: (categoryId: string) => void
  onUpdatePlace: (categoryId: string, placeIndex: number, place: string) => void
  onDeletePlace: (categoryId: string, placeIndex: number) => void
}

type ModalMode = 'create' | 'edit'

export function CategoryManager({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onAddCustomCategory,
  onDeleteCustomCategory,
  onRenameCustomCategory,
  onAddPlace,
  onUpdatePlace,
  onDeletePlace,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId)
  const selectedCustomCategory = selectedCategory?.isCustom ? selectedCategory : undefined

  function openCreateModal() {
    setModalMode('create')
    setIsModalOpen(true)
  }

  function openEditModal() {
    setModalMode('edit')
    setIsModalOpen(true)
  }

  function handleAddCategory() {
    const categoryId = onAddCustomCategory(newCategoryName)
    setNewCategoryName('')
    onCategoryChange(categoryId)
    setModalMode('edit')
  }

  function handleDeleteCategory(categoryId: string) {
    onDeleteCustomCategory(categoryId)
    setIsModalOpen(false)
  }

  return (
    <div className="category-manager">
      <div className="category-toolbar">
        <div>
          <span className="label">Категории</span>
          <p className="hint">Базовые и ваши собственные наборы слов</p>
        </div>
        <div className="category-toolbar-actions">
          <button className="mini-button" type="button" onClick={openCreateModal}>
            Создать
          </button>
          {selectedCustomCategory ? (
            <button className="secondary-mini-button" type="button" onClick={openEditModal}>
              Редактировать
            </button>
          ) : null}
        </div>
      </div>

      <div className="category-grid" aria-label="Категории">
        {categories.map((category, index) => (
          <motion.button
            className={category.id === selectedCategoryId ? 'category-card active' : 'category-card'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025, duration: 0.22 }}
            key={category.id}
            style={{ '--category-accent': category.accent } as CSSProperties}
            type="button"
            onClick={() => onCategoryChange(category.id)}
          >
            <span>{category.name}</span>
            <small>
              {category.places.filter((place) => place.trim()).length} мест
              {category.isCustom ? ' · своя' : ''}
            </small>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="category-modal"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: 'spring', stiffness: 330, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Управление категориями"
            >
              <div className="modal-head">
                <div>
                  <p className="eyebrow">свои категории</p>
                  <h2>{modalMode === 'create' ? 'Новая категория' : 'Редактор категории'}</h2>
                </div>
                <button
                  className="modal-close"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Закрыть окно"
                >
                  Закрыть
                </button>
              </div>

              <div className="custom-category-form">
                <label>
                  <span className="field-label">Название новой категории</span>
                  <input
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Например: Школа"
                  />
                </label>
                <button className="mini-button" type="button" onClick={handleAddCategory}>
                  Создать
                </button>
              </div>

              {selectedCustomCategory ? (
                <div className="category-editor">
                  <div className="editor-head">
                    <label>
                      <span className="field-label">Название выбранной категории</span>
                      <input
                        value={selectedCustomCategory.name}
                        onChange={(event) =>
                          onRenameCustomCategory(selectedCustomCategory.id, event.target.value)
                        }
                      />
                    </label>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDeleteCategory(selectedCustomCategory.id)}
                    >
                      Удалить категорию
                    </button>
                  </div>

                  <div className="word-list">
                    <div className="list-title">
                      <span className="label">Слова внутри</span>
                      <button
                        className="mini-button"
                        type="button"
                        onClick={() => onAddPlace(selectedCustomCategory.id)}
                      >
                        Добавить слово
                      </button>
                    </div>

                    {selectedCustomCategory.places.map((place, index) => (
                      <label className="word-input" key={`${selectedCustomCategory.id}-${index}`}>
                        <input
                          value={place}
                          onChange={(event) =>
                            onUpdatePlace(selectedCustomCategory.id, index, event.target.value)
                          }
                          aria-label={`Слово ${index + 1}`}
                        />
                        <button
                          className="word-delete-button"
                          type="button"
                          disabled={selectedCustomCategory.places.length <= 1}
                          onClick={() => onDeletePlace(selectedCustomCategory.id, index)}
                        >
                          Удалить
                        </button>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="modal-empty">
                  Создайте категорию, и здесь появится редактор слов.
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
