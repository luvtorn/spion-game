type RoleCardProps = {
  isOpen: boolean
  isSpy: boolean
  place: string
  onClick: () => void
}

export function RoleCard({ isOpen, isSpy, place, onClick }: RoleCardProps) {
  return (
    <button
      className={isOpen ? 'role-card revealed' : 'role-card'}
      type="button"
      onClick={onClick}
    >
      <span className="card-shine" />
      {!isOpen ? (
        <>
          <small>секретная карта</small>
          <strong>Нажми, чтобы открыть</strong>
          <em>После просмотра нажми на карточку ещё раз, чтобы передать ход дальше.</em>
        </>
      ) : isSpy ? (
        <>
          <small>твоя роль</small>
          <strong>Ты шпион</strong>
          <em>Нажми снова и передай устройство следующему игроку.</em>
        </>
      ) : (
        <>
          <small>локация</small>
          <strong>{place}</strong>
          <em>Запомни место, нажми снова и передай устройство дальше.</em>
        </>
      )}
    </button>
  )
}
