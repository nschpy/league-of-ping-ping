import { NavLink } from 'react-router-dom'

export function AuthModeToggle() {
  const itemCls = (isActive: boolean) =>
    `px-[18px] py-2 rounded-[4px] text-[13px] uppercase tracking-[0.12em] cursor-pointer transition-all duration-150 leading-none ${
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground'
    }`
  return (
    <div
      className="inline-flex p-1 rounded-[4px] border border-border self-start mb-9"
      style={{ background: 'var(--color-card)' }}
    >
      {(['/login', '/register'] as const).map((path, i) => (
        <NavLink key={path} to={path}>
          {({ isActive }) => (
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className={itemCls(isActive)}
            >
              {i === 0 ? 'Войти' : 'Регистрация'}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  )
}
