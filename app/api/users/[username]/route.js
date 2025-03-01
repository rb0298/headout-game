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

export async function GET(request, { params }) {
    try {
        const username = params.username

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 })
        }

        const users = getUsers()
        const user = users.find((user) => user.username === username)

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }
}

