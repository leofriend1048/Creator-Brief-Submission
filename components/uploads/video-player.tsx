'use client';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  return (
    <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
      <video
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={src}
        poster={poster}
        controls
        preload="metadata"
      />
    </div>
  );
}