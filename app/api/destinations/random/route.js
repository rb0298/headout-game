import { NextResponse } from "next/server"
import destinations from "@/data/destinations.json"

// Get 3 random destinations for multiple choice options
function getRandomDestinations(exclude, count) {
    const availableDestinations = destinations.filter((dest) => dest.alias !== exclude)

    const shuffled = [...availableDestinations].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

export async function GET() {
    try {
        // Get a random destination
        const allDestinations = destinations;
        console.log(allDestinations, 'allDestinations')
        const randomIndex = Math.floor(Math.random() * allDestinations.length)
        const destination = allDestinations[randomIndex]
        console.log(destination, 'destination')

        // Get 3 random wrong options
        const wrongOptions = getRandomDestinations(destination.alias, 3)

        // Combine correct and wrong options and shuffle
        const options = [destination, ...wrongOptions].sort(() => 0.5 - Math.random())

        return NextResponse.json({
            destination,
            options,
        })
    } catch (error) {
        console.error("Error fetching random destination:", error)
        return NextResponse.json({ error: "Failed to fetch random destination" }, { status: 500 })
    }
}

