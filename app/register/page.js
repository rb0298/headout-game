"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ShareDialog } from "@/components/share-dialog"

export default function Register() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [userImage, setUserImage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user is already registered
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
      setIsRegistered(true)
    }
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      if (response.ok) {
        localStorage.setItem("username", username)
        setIsRegistered(true)
        toast({
          title: "Registration successful!",
          description: "You can now challenge your friends to play Globetrotter.",
        })
      } else {
        const data = await response.json()
        throw new Error(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "Please try again with a different username",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    setIsShareOpen(true)
  }

  const handlePlay = () => {
    router.push("/play")
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Join Globetrotter</CardTitle>
          <CardDescription>
            {isRegistered
              ? "You're registered! Challenge your friends or start playing."
              : "Register with a username to challenge your friends."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isRegistered ? (
            <form onSubmit={handleRegister}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center p-3 bg-muted rounded-md">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>
                Registered as <strong>{username}</strong>
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!isRegistered ? (
            <Button className="w-full" onClick={handleRegister} disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          ) : (
            <>
              <Button className="w-full" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Challenge a Friend
              </Button>
              <Button variant="outline" className="w-full" onClick={handlePlay}>
                Start Playing
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <ShareDialog open={isShareOpen} onOpenChange={setIsShareOpen} username={username} />
    </div>
  )
}

