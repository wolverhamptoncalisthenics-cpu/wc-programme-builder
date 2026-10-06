import { useState, Fragment } from "react";
import { PlayCircle, X } from "lucide-react";
import { extractYouTubeId } from "../data/programme";

export default function WorkoutTable({ exercises }) {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div className="overflow-x-auto rounded-sm border border-white/10">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-brand-orange text-brand-dark font-display font-bold uppercase text-xs tracking-wide">
            <th className="px-3 py-2 whitespace-nowrap">Order</th>
            <th className="px-3 py-2">Exercise</th>
            <th className="px-3 py-2 whitespace-nowrap">Sets</th>
            <th className="px-3 py-2 whitespace-nowrap">Reps</th>
            <th className="px-3 py-2 whitespace-nowrap">Tempo</th>
            <th className="px-3 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => {
            const youtubeId = extractYouTubeId(ex.videoUrl);
            const expanded = expandedRow === i;
            return (
              <Fragment key={i}>
                <tr className="border-t border-white/10 text-white/90 font-body">
                  <td className="px-3 py-2 whitespace-nowrap text-brand-light">{ex.order}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span>{ex.name}</span>
                      {youtubeId && (
                        <button
                          onClick={() => setExpandedRow(expanded ? null : i)}
                          className="text-brand-orange hover:text-white transition-colors shrink-0"
                          aria-label={expanded ? "Hide demo" : "Watch demo"}
                        >
                          {expanded ? <X className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{ex.sets}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{ex.reps}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{ex.tempo}</td>
                  <td className="px-3 py-2 text-brand-light">{ex.notes}</td>
                </tr>
                {youtubeId && expanded && (
                  <tr className="border-t border-white/10">
                    <td colSpan={6} className="p-3">
                      <div className="aspect-video rounded-sm overflow-hidden border border-white/10 max-w-md">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                          title={`${ex.name} demo`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
