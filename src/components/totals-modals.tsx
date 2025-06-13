
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TotalsModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export function TotalsModal({ isOpen, onClose, data }: TotalsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Season Totals</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>This modal will display season totals and statistics.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
