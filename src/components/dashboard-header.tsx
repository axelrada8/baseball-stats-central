
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  onExportPDF: () => void
  onLogout: () => void
}

export function DashboardHeader({ onExportPDF, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <span className="font-bold">Baseball Stats</span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <Button onClick={onExportPDF} variant="outline">
              Export PDF
            </Button>
            <Button onClick={onLogout} variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
