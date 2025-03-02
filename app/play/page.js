"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, X, RefreshCw, Trophy, MapPin, Plane } from "lucide-react"
import confetti from "canvas-confetti"
import { useToast } from "@/components/ui/use-toast"

export default function PlayGame() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const invitedBy = searchParams.get("invitedBy")
    const { toast } = useToast()

    const [gameState, setGameState] = useState({
        currentDestination: null,
        options: [],
        selectedOption: null,
        answered: false,
        isCorrect: false,
        score: { correct: 0, incorrect: 0 },
        loading: true,
        inviterScore: null,
    })

    useEffect(() => {
        if (invitedBy) {
            fetchInviterScore(invitedBy)
        }
        loadNewDestination()
    }, [invitedBy])

    const fetchInviterScore = async () => {
        try {
            const response = await fetch(`/api/users/${username}`)
            if (response.ok) {
                const data = await response.json()
                setGameState((prev) => ({
                    ...prev,
                    inviterScore: data.score,
                }))

                toast({
                    title: `Playing ${username}'s challenge!`,
                    description: `They have a score of ${data.score.correct} correct answers. Can you beat it?`,
                })
            }
        } catch (error) {
            console.error("Error fetching inviter score:", error)
        }
    }

    const getOptionStyle = (option) => {
        if (gameState.answered) {
            if (option.alias === gameState.currentDestination?.alias) {
                return "default";
            }
            if (option.alias === gameState.selectedOption?.alias) {
                return "destructive";
            }
            return "outline";
        }
        return "outline";
    };

    const loadNewDestination = async () => {
        setGameState((prev) => ({ ...prev, loading: true }))

        try {
            const response = await fetch("/api/destinations/random");
            console.log(response, 'response');
            if (response.ok) {
                const data = await response.json()
                console.log(data, 'destinationdata')

                setGameState((prev) => ({
                    ...prev,
                    currentDestination: data.destination,
                    options: data.options,
                    selectedOption: null,
                    answered: false,
                    isCorrect: false,
                    loading: false,
                }))
            } else {
                throw new Error("Failed to fetch destination")
            }
        } catch (error) {
            console.error("Error loading destination:", error)
            toast({
                title: "Error",
                description: "Failed to load a new destination. Please try again.",
                variant: "destructive",
            })
            setGameState((prev) => ({ ...prev, loading: false }))
        }
    }

    const handleOptionSelect = (option) => {
        if (gameState.answered) return

        const isCorrect = option.alias === gameState.currentDestination?.alias

        setGameState((prev) => ({
            ...prev,
            selectedOption: option,
            answered: true,
            isCorrect,
            score: {
                correct: isCorrect ? prev.score.correct + 1 : prev.score.correct,
                incorrect: !isCorrect ? prev.score.incorrect + 1 : prev.score.incorrect,
            },
        }))

        if (isCorrect) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
        }

        // Update score in backend
        const username = localStorage.getItem("username")
        if (username) {
            fetch("/api/users/update-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, correct: isCorrect }),
            }).catch((err) => console.error("Error updating score:", err))
        }
    }



    const handleNextDestination = () => {
        loadNewDestination()
    }

    if (gameState.loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-100 to-green-100">
                <div className="animate-bounce">
                    <Plane className="h-16 w-16 text-blue-500" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 py-8 px-4">
            <div className="max-w-4xl mx-auto relative z-10">
                {gameState.inviterScore && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-white bg-opacity-80 rounded-lg shadow-lg"
                    >
                        <p className="flex items-center text-lg">
                            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                            <span>Challenge from a friend! Their score: {gameState.inviterScore.correct} correct answers</span>
                        </p>
                    </motion.div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-blue-800">Globetrotter</h1>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-green-600 text-lg p-2">
                            <Check className="mr-1 h-5 w-5" /> {gameState.score.correct}
                        </Badge>
                        <Badge variant="secondary" className="text-red-600 text-lg p-2">
                            <X className="mr-1 h-5 w-5" /> {gameState.score.incorrect}
                        </Badge>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={gameState.currentDestination?.alias}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="mb-8 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center">
                                    <MapPin className="mr-2 h-6 w-6 text-red-500" />
                                    Where am I?
                                </CardTitle>
                                <CardDescription className="text-lg">Guess the destination based on these clues</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {gameState.currentDestination?.clues.map((clue, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                            className="p-3 bg-blue-50 rounded-md text-blue-800 shadow"
                                        >
                                            {clue}
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {gameState.options.map((option) => (
                                <motion.div key={option.alias} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant={getOptionStyle(option)}
                                        className="w-full h-16 text-lg justify-start px-4 bg-opacity-90"
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={gameState.answered}
                                    >
                                        {option.name}
                                        {gameState.answered && option.alias === gameState.currentDestination?.alias && (
                                            <Check className="ml-auto h-6 w-6" />
                                        )}
                                        {gameState.answered &&
                                            option.alias === gameState.selectedOption?.alias &&
                                            option.alias !== gameState.currentDestination?.alias && <X className="ml-auto h-6 w-6" />}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>

                        {gameState.answered && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="mb-8 border-t-4 border-t-primary bg-white bg-opacity-90  shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center text-2xl">
                                            {gameState.isCorrect ? (
                                                <>
                                                    <Check className="mr-2 h-6 w-6 text-green-500" />
                                                    Correct! You guessed it!
                                                </>
                                            ) : (
                                                <>
                                                    <X className="mr-2 h-6 w-6 text-red-500" />
                                                    Oops! That's not right.
                                                </>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <h3 className="font-semibold text-xl mb-3">Fun Facts about {gameState.currentDestination?.name}</h3>
                                        <ul className="space-y-3">
                                            {gameState.currentDestination?.funFacts.map((fact, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.2 }}
                                                    className="p-3 bg-green-50 rounded-md text-green-800 shadow"
                                                >
                                                    {fact}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={handleNextDestination} className="w-full text-lg">
                                            Next Destination <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => router.push("/")} className="bg-white bg-opacity-90">
                                Back to Home
                            </Button>
                            {!gameState.answered && (
                                <Button variant="outline" onClick={handleNextDestination} className="bg-white bg-opacity-90">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Skip This One
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

