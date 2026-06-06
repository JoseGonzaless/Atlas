import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// NOTE(backend): placeholder pairing codes. The real flow should request a
// short-lived, server-generated code (and ideally poll/subscribe for the bot
// to confirm pairing). "Refresh code" currently just cycles this static list.
const PAIRING_CODES = ['AT7X2Q', 'BP9R3M']

interface Props {
  telegramHandle?: string
  onDisconnect: () => Promise<void>
  isMutating: boolean
}

export function SettingsTelegram({ telegramHandle, onDisconnect, isMutating }: Props) {
  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const [codeIndex, setCodeIndex] = useState(0)

  async function handleDisconnect() {
    await onDisconnect()
    setDisconnectOpen(false)
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Telegram</h2>
        </div>
        {telegramHandle && (
          <span className="rounded-full bg-positive/10 px-2.5 py-0.5 text-xs font-medium text-positive">
            Connected
          </span>
        )}
      </div>

      <Separator />

      <div className="px-6 py-5">
        {telegramHandle ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Connected as
              </span>
              <span className="text-base font-semibold mt-0.5">{telegramHandle}</span>
            </div>

            <AlertDialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
              <AlertDialogTrigger
                render={<Button variant="destructive" size="sm" disabled={isMutating} />}
              >
                Disconnect
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect Telegram?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You won't be able to log expenses via the bot until you reconnect.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDisconnect}
                    disabled={isMutating}
                  >
                    Disconnect
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-muted-foreground">
              Link your Telegram account to log expenses via the Atlas bot.
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Your pairing code
              </span>
              <span className="font-mono text-2xl tracking-widest bg-muted rounded-lg px-5 py-3 self-start">
                {PAIRING_CODES[codeIndex]}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCodeIndex(i => (i + 1) % PAIRING_CODES.length)}
              >
                Refresh code
              </Button>
              <span className="text-sm text-muted-foreground">Waiting for Telegram…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
