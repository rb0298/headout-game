import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const usersFilePath = path.join(process.cwd(), "data", "users.json")

// Helper to read users file
function getUsers() {
    try {
        if (!fs.existsSync(usersFilePath)) {
            return []
        }

        const data = fs.readFileSync(usersFilePath, "utf8")
        return JSON.parse(data)
    } catch (error) {
        console.error("Error reading users file:", error)
        return []
    }
}

// Helper to write users file
function saveUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8")
    } catch (error) {
        console.error("Error writing users file:", error)
    }
}

export async function POST(request) {
    try {
        const { username, correct } = await request.json()

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        const users = getUsers()
        const userIndex = users.findIndex((user) => user.username === username)

        if (userIndex === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Update user score
        if (correct) {
            users[userIndex].score.correct += 1
        } else {
            users[userIndex].score.incorrect += 1
        }

        saveUsers(users)

        return NextResponse.json({
            success: true,
            user: users[userIndex],
        })
    } catch (error) {
        console.error("Error updating user score:", error)
        return NextResponse.json({ error: "Failed to update user score" }, { status: 500 })
    }
}

