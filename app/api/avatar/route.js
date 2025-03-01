import { NextResponse } from "next/server"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Generate a random avatar URL using DiceBear API
    const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${encodeURIComponent(username)}`

    // Fetch the avatar image
    const avatarResponse = await fetch(avatarUrl)
    const avatarBuffer = await avatarResponse.arrayBuffer()

    // Return the avatar image with appropriate headers
    return new NextResponse(avatarBuffer, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400",
        },
    })
}

