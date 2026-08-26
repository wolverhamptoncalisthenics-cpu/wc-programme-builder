import { PlayCircle, X } from "lucide-react";

// Accepts a full YouTube URL in any common format (watch?v=, youtu.be/,
// shorts/) and pulls out just the video ID needed for embedding.
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function ExerciseRow({ name, prescription, videoUrl, notes, videoKey, expanded, onToggle, extra }) {
  const youtubeId = extractYouTubeId(videoUrl);
  const hasVideo = Boolean(youtubeId);

  return (
    <li className="text-sm text-white/90">
      <div className="flex items-center gap-2">
        {extra}
        <span className="text-brand-orange">•</span>
        <span className="flex-1 font-body">
          {name} {prescription && <span className="text-brand-light">— {prescription}</span>}
        </span>
        {hasVideo && (
          <button
            onClick={() => onToggle(videoKey)}
            className="text-brand-orange hover:text-white shrink-0 transition-colors"
            aria-label={expanded ? "Hide demo" : "Watch demo"}
          >
            {expanded ? <X className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
        )}
      </div>

      {notes && <p className="ml-4 mt-0.5 text-xs text-brand-light italic font-body">{notes}</p>}

      {hasVideo && expanded && (
        <div className="mt-2 ml-4 rounded-sm overflow-hidden border border-white/10 aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title={`${name} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </li>
  );
}
