import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession } from "iron-session";

// Define the session type
interface SessionData {
  viewedPosts: string[]; // Array of viewed post IDs
}

// Configure Iron Session
const sessionOptions = {
  cookieName: "blog_session",
  password: "EAGBQWxJXczk5yvse7FwZbLaKV2dTCSPN6vtw3DXPd2Q5BWZnJeFb4jMcu9YGxk7VuKyahcJtDYv3E4pQH2TwUkbWBdXRzS8CvaQBkHc7XNUjAREmg5K9Wpz6YfSVueyceXzuQqVTvCndSBs5WFYxr9hbytDmHMj", // Change this to a secure value in .env
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  },
};

export async function POST(req: NextRequest) {
  // Get session with defined type
  const session: IronSession<SessionData> = await getIronSession(req, NextResponse.next(), sessionOptions);
  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ message: "Missing postId" }, { status: 400 });
  }

  // Ensure viewedPosts exists in the session
  session.viewedPosts = session.viewedPosts || [];

  // If user already viewed the post, don't increment again
  if (session.viewedPosts.includes(postId)) {
    return NextResponse.json({ message: "Already viewed" });
  }

  try {
    // 🔥 Increment the views in Strapi
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/posts/${postId}`, {
      method: "GET",
    });

    // Store viewed post in the session and save it
    session.viewedPosts.push(postId);
    await session.save();

    return NextResponse.json({ message: "View counted" });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json({ message: "Error incrementing views" }, { status: 500 });
  }
}
