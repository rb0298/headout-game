import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const usersFilePath = path.join(process.cwd(), "data", "users.json")

// Helper to read users file
function getUsers() {
    try {
        if (!fs.existsSync(usersFilePath)) {
            // Create users file if it doesn't exist
            fs.writeFileSync(usersFilePath, JSON.stringify([]), "utf8")
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
        // Ensure the directory exists
        const dir = path.dirname(usersFilePath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8")
    } catch (error) {
        console.error("Error writing users file:", error)
    }
}

export async function POST(request) {
    try {
        const { username } = await request.json()

        if (!username || typeof username !== "string") {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        const users = getUsers()

        // Check if username already exists
        if (users.some((user) => user.username === username)) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 })
        }

        // Create new user
        const newUser = {
            username,
            score: { correct: 0, incorrect: 0 },
        }

        users.push(newUser)
        saveUsers(users)

        return NextResponse.json({ success: true, user: newUser })
    } catch (error) {
        console.error("Error registering user:", error)
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }
}

