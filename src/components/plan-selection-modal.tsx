
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PlanSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onPlanSelect: (plan: { type: "starter" | "premium"; billing: "monthly" | "annual" }) => void
}

export function PlanSelectionModal({ isOpen, onClose, onPlanSelect }: PlanSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Your Plan</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Starter Plan</h3>
              <p className="text-2xl font-bold mb-4">Free</p>
              <Button 
                onClick={() => onPlanSelect({ type: "starter", billing: "monthly" })}
                className="w-full"
              >
                Select Starter
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Premium Plan</h3>
              <p className="text-2xl font-bold mb-4">$2.99/month</p>
              <Button 
                onClick={() => onPlanSelect({ type: "premium", billing: "monthly" })}
                className="w-full"
              >
                Select Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
