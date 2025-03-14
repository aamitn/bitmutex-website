import { NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
import ogs from "open-graph-scraper";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Regex to check if it's a valid YouTube video or playlist URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|playlist\?list=|[^\/]+)|youtu\.be\/[^\/]+)/;

    if (youtubeRegex.test(url)) {
      const youtube = await Innertube.create();

      // Extract Video ID and Playlist ID if present
      const videoMatch = url.match(/[?&]v=([^&]+)/);
      const playlistMatch = url.match(/[?&]list=([^&]+)/);

      const videoId = videoMatch ? videoMatch[1] : null;
      const playlistId = playlistMatch ? playlistMatch[1] : null;

      let playlistTitle = "";
      let playlistDescription = "";
      let videoTitle = "";
      let videoDescription = "";
      let thumbnailUrl = "";

      // If playlist ID is found, fetch playlist details
      if (playlistId) {
        const playlist = await youtube.getPlaylist(playlistId);
        const info = playlist?.info;

        // Find the current video position in the playlist
        if (videoId && playlist?.videos) {
          const index = playlist.videos.findIndex(video => ('id' in video) && video.id === videoId);
          const videoPosition = index !== -1 ? index + 1 : null; // Convert 0-based index to 1-based

          if (videoPosition) {
            playlistDescription = `🎬 #${videoPosition} out of `;
          }
        }
        
        playlistTitle = info?.title || "Untitled Playlist";
        playlistDescription += `${info?.total_items} 🎬 ${info?.subtitle?.text || ""}`;
        thumbnailUrl = info?.thumbnails?.[0]?.url || "";

      }

      
      // If video ID is found, fetch video details
      if (videoId) {
        const video = await youtube.getBasicInfo(videoId);
        videoTitle = video.basic_info?.title || "Untitled Video";
        videoDescription = video.basic_info?.short_description || "No description available";
        if (!thumbnailUrl) thumbnailUrl = video.basic_info?.thumbnail?.[0]?.url || "";
      }

      return NextResponse.json({
        title: playlistTitle
          ? `[Playlist : ${playlistTitle}] ❂ ${videoTitle}` // Show both if available
          : videoTitle, // Show only video title if no playlist
        description: playlistDescription
          ? `${playlistDescription}\n\n${videoDescription}` // Combine both descriptions
          : videoDescription, // Show only video description if no playlist
        image: thumbnailUrl,
        url: playlistId
          ? `https://www.youtube.com/playlist?list=${playlistId}&v=${videoId || ""}` // Use both if available
          : `https://www.youtube.com/watch?v=${videoId}`, // Fallback to video-only link
      });
    }

    // Use Open Graph Scraper for non-YouTube links
    const { result } = await ogs({ url });
    return NextResponse.json({
      title: result.ogTitle || "No title",
      description: result.ogDescription || "No description available",
      image: result.ogImage?.[0]?.url || "",
      url: result.ogUrl || url,
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}