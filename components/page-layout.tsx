"use client"

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageLayout({ children, title, description, actions }: PageLayoutProps) {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter text-foreground uppercase">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground font-medium italic tracking-tight opacity-70">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0">{actions}</div>}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </div>
    </div>
  )
}
