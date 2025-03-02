"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Copy, PhoneIcon as WhatsappIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


export function ShareDialog({ open, onOpenChange, username }) {
  const { toast } = useToast()
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (open && username) {
      // Generate share URL
      const baseUrl = window.location.origin
      const url = `${baseUrl}/play?invitedBy=${encodeURIComponent(username)}`
      setShareUrl(url)
    }
  }, [open, username])



  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied!",
      description: "Share it with your friends to challenge them.",
    })
  }

  const shareToWhatsApp = () => {
    const text = `I challenge you to beat my score in Globetrotter! Can you guess these famous destinations? Play here: ${shareUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Challenge your friends</DialogTitle>
          <DialogDescription>Share this link with your friends to challenge them to beat your score.</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center my-4">
          <div
            className="bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-lg text-center w-full max-w-xs"
          >
            <h3 className="text-xl font-bold mb-2">Globetrotter Challenge!</h3>
            <p className="mb-4">
              <span className="font-semibold">{username}</span> has challenged you to a game of Globetrotter!
            </p>
            <div className="bg-background rounded-md p-3 text-sm">
              Can you guess famous destinations from cryptic clues?
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly />
            <Button size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={shareToWhatsApp} className="flex gap-2">
              <WhatsappIcon className="h-4 w-4" />
              Share on WhatsApp
            </Button>
            <Button onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

