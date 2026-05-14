export function initials(nickname: string): string {
  const cleaned = nickname.replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
  return cleaned.slice(0, 2).toUpperCase() || '??'
}

export function playerTileClasses(isP1: boolean): string {
  return isP1 ? 'bg-primary text-primary-foreground' : 'bg-blue-500 text-white'
}

export function playerAccentClasses(isP1: boolean): string {
  return isP1 ? 'text-primary' : 'text-blue-400'
}
