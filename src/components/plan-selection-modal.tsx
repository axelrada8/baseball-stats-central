
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface PlanSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onPlanSelect: (plan: { type: "starter" | "premium"; billing: "monthly" | "annual" }) => void
}

export function PlanSelectionModal({ isOpen, onClose, onPlanSelect }: PlanSelectionModalProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-wider text-center">CHOOSE YOUR PLAN</DialogTitle>
          <button onClick={onClose} className="absolute right-4 top-4 text-white/60 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>

        <div className="space-y-8 p-6">
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-light ${!isAnnual ? "text-white" : "text-white/40"}`}>MONTHLY</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-white" />
            <span className={`text-sm font-light ${isAnnual ? "text-white" : "text-white/40"}`}>
              ANNUAL <span className="text-green-400">(SAVE 20%)</span>
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white/[0.02] border-white/5 hover:border-white/10 transition-all duration-500">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-light tracking-wider text-white">STARTER</h3>
                  <div className="space-y-2">
                    <div className="text-3xl font-extralight text-white">$0</div>
                    <div className="text-sm font-light text-white/40 tracking-wider">7-DAY FREE TRIAL</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <span className="font-light text-white/80 text-sm">Basic statistics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <span className="font-light text-white/80 text-sm">Live scores</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <span className="font-light text-white/80 text-sm">Limited access</span>
                  </div>
                </div>

                <Button
                  onClick={() => onPlanSelect({ type: "starter", billing: "monthly" })}
                  variant="outline"
                  className="w-full border-white/20 hover:bg-white/5 font-light tracking-wider"
                >
                  Select Starter
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white text-black font-light tracking-wider px-3 py-1">POPULAR</Badge>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-light tracking-wider text-white">PREMIUM</h3>
                  <div className="space-y-2">
                    <div className="text-3xl font-extralight text-white">
                      {isAnnual ? "$29.99" : "$2.99"}
                      <span className="text-lg font-light text-white/40 ml-1">{isAnnual ? "/year" : "/month"}</span>
                    </div>
                    {isAnnual && (
                      <div className="text-xs font-light text-green-400 tracking-wider">SAVE $5.89 ANNUALLY</div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="font-light text-white/80 text-sm">Advanced metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="font-light text-white/80 text-sm">3D visualizations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="font-light text-white/80 text-sm">Player comparisons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="font-light text-white/80 text-sm">Data export</span>
                  </div>
                </div>

                <Button
                  onClick={() => onPlanSelect({ type: "premium", billing: isAnnual ? "annual" : "monthly" })}
                  className="w-full bg-white text-black hover:bg-white/90 font-light tracking-wider"
                >
                  Select Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
