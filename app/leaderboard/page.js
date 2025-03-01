"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"


export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const mockData = [
          { username: "TravelMaster", score: 42, rank: 1 },
          { username: "GlobeTrotter99", score: 38, rank: 2 },
          { username: "WorldExplorer", score: 35, rank: 3 },
          { username: "AdventureSeeker", score: 31, rank: 4 },
          { username: "WanderlustSpirit", score: 29, rank: 5 },
          { username: "DestinationHunter", score: 27, rank: 6 },
          { username: "JourneyJunkie", score: 25, rank: 7 },
          { username: "MapReader", score: 22, rank: 8 },
          { username: "CompassFollower", score: 19, rank: 9 },
          { username: "AtlasNavigator", score: 17, rank: 10 },
        ]

        const username = localStorage.getItem("globetrotter_username")
        const scoreData = localStorage.getItem("globetrotter_score")

        if (username && scoreData) {
          const userScore = JSON.parse(scoreData).correct

          const userRank = mockData.findIndex((entry) => userScore > entry.score) + 1

          if (userRank > 0 && userRank <= 10) {
            mockData.splice(userRank - 1, 0, {
              username,
              score: userScore,
              rank: userRank,
            })

            mockData.forEach((entry, index) => {
              entry.rank = index + 1
            })

            mockData.length = Math.min(mockData.length, 10)
          }
        }

        setLeaderboard(mockData)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <Award className="h-5 w-5 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Global Leaderboard</CardTitle>
            <CardDescription>The top Globetrotter players from around the world</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.username === localStorage.getItem("globetrotter_username")

                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center p-3 rounded-lg ${isCurrentUser
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : entry.rank <= 3
                        ? "bg-amber-50/50 dark:bg-amber-900/10"
                        : ""
                      }`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">
                        {entry.username}
                        {isCurrentUser && <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>}
                      </p>
                    </div>
                    <div className="font-bold text-lg">{entry.score}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

