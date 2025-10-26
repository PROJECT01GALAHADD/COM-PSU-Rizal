'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import YouTubeGrid from './youtube-grid'

const ACCENT = '#C6FF3A'

type ExamplesDialogProps = {
  open: boolean
  // Prefer action-style prop name to satisfy client component serializability rules
  onOpenChangeAction?: (v: boolean) => void
  // Back-compat: keep old name; will be ignored if action is provided
  onOpenChange?: (v: boolean) => void
  planName: string
  price: string
  videoIds: string[]
}

export function ExamplesDialog({
  open,
  onOpenChangeAction,
  onOpenChange,
  planName,
  price,
  videoIds,
}: ExamplesDialogProps) {
  // Choose the action-style handler when present; otherwise fall back
  const handleOpenChange = onOpenChangeAction ?? onOpenChange
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] xl:max-w-[1280px] border-neutral-800 border bg-[#0b0b0b] p-0 text-white sm:rounded-2xl">
        <div className="border-b border-neutral-900 bg-neutral-900/50 px-5 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle
              className="text-base font-semibold"
              style={{ color: ACCENT }}
            >
              {planName}
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-400">
              Pricing: {price}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="max-h-[80vh] overflow-auto px-5 py-5 lg:px-6 lg:py-6">
          <YouTubeGrid videoIds={videoIds} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
