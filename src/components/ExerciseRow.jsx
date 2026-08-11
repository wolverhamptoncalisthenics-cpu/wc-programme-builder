import { PlayCircle, X } from "lucide-react";
import { getVideoSource } from "../data/programme";

export default function ExerciseRow({ name, prescription, videoKey, expanded, onToggle, extra }) {
  const video = getVideoSource(name);
  return (
    <li className="text-sm text-white/90">
      <div className="flex items-center gap-2">
        {extra}
        <span className="text-brand-orange">•</span>
        <span className="flex-1 font-body">
          {name} {prescription && <span className="text-brand-light">— {prescription}</span>}
        </span>
        {video && (
          <button
            onClick={() => onToggle(videoKey)}
            className="text-brand-orange hover:text-white shrink-0 transition-colors"
            aria-label={expanded ? "Hide demo" : "Watch demo"}
          >
            {expanded ? <X className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
        )}
      </div>
      {video && expanded && (
        <div className="mt-2 ml-4 rounded-sm overflow-hidden border border-white/10 aspect-video">
          {video.type === "youtube" ? (
            <iframe
              className="w-full h-full"
              src={video.src}
              title={`${name} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="w-full h-full" src={video.src} controls />
          )}
        </div>
      )}
    </li>
  );
}
