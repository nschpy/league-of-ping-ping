import { NavLink } from 'react-router-dom'

export function AuthModeToggle() {
  return (
    <div
      className="inline-flex p-1 rounded-[4px] border border-border self-start mb-9"
      style={{ background: 'var(--color-card)' }}
    >
      {(['/login', '/register'] as const).map((path, i) => (
        <NavLink
          key={path}
          to={path}
          style={{ fontFamily: 'var(--font-display)' }}
          className={({ isActive }) =>
            `px-[18px] py-2 flex items-center rounded-[4px] text-[13px] uppercase tracking-[0.12em] cursor-pointer transition-all duration-150 leading-none ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          {i === 0 ? 'Войти' : 'Регистрация'}
        </NavLink>
      ))}
    </div>
  )
}
