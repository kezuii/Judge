"use client";

import { useState, useEffect } from "react";

// Test URLs - replace with your 900 URLs
const IMAGE_URLS = [
  "https://www.artfol-image.me/60749959d3d65841407249b0/2e0e3bbf3176422db78aa05967b73531.jpg",
  "https://www.artfol-image.me/607cc0cdd34ad16c39c24f12/88d5607d3e6c480fa40ec49525fcd8c7.jpg",
  "https://www.artfol-image.me/5f63c3bc6ae1c811d50e8bfc/27ec76740ba340e397f2d5d844a35790.jpg",
  "https://www.artfol-image.me/66bad6e7141da83377531271/9de714438a8444559fd36b4de0d45244.jpg",
  "https://www.artfol-image.me/607ce667d34ad16c39c54865/7aac95752f9947c1b98a439d762b8bd6.jpg",
  "https://www.artfol-image.me/62aeafa400d5510eeee638ae/364f6ba2c0a04a0f88f175b28f3bb423.jpg",
  "https://www.artfol-image.me/5fa92b1fe83c2f1b6f658dda/111458f74d624a44ad609b270eb5b312.jpg",
  "https://www.artfol-image.me/66c4042a141da83377a0cc6e/130cf6d5c8fa40559a684751b8a90036.jpg",
  "https://www.artfol-image.me/6079f67fddd78103d6cb539e/f5933ce9d93e413a8423c67c6b80cae2.jpg",
  "https://www.artfol-image.me/628488aaf4d0282c1d4302c2/87d97e4bac4b44179561dc46f032969f.jpg",
  "https://www.artfol-image.me/62c084de5a3663675815dfbd/e937dc7cdac646f08d5381aa39214928.jpg",
  "https://www.artfol-image.me/607623cb7d89be338c761070/f50ee9e0137e447aa9d53516f3f23b3b.jpg",
  "https://www.artfol-image.me/60794fd9a277502327ead70c/77de47749f21454d907a68960fd76059.jpg",
  "https://www.artfol-image.me/66b4af21141da83377628e61/b9a271db802140bab4658407a428aa5d.jpg",
];

const STORAGE_KEY = "image-ratings";

type Ratings = Record<string, number>;

function StarRating({
  rating,
  onRate,
  size = "normal",
}: {
  rating: number;
  onRate: (rating: number) => void;
  size?: "normal" | "large";
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayRating = hovered !== null ? hovered : rating;

  const starSize = size === "large" ? "text-3xl" : "text-xl";

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${starSize} transition-all duration-150 hover:scale-110 ${
            star <= displayRating
              ? "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
              : "text-zinc-600"
          }`}
          onMouseEnter={() => setHovered(star)}
          onClick={(e) => {
            e.stopPropagation();
            onRate(star);
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

type FilterOption = "all" | "unrated" | 1 | 2 | 3 | 4 | 5;

export default function Home() {
  const [ratings, setRatings] = useState<Ratings>({});
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("all");

  // Load ratings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRatings(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored ratings:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save ratings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    }
  }, [ratings, isLoaded]);

  const handleRate = (url: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [url]: rating }));
  };

  const ratedCount = Object.keys(ratings).length;
  const totalCount = IMAGE_URLS.length;
  const progress = Math.round((ratedCount / totalCount) * 100);

  // Filter images based on selected filter
  const filteredImages = IMAGE_URLS.map((url, index) => ({ url, originalIndex: index })).filter(
    ({ url }) => {
      if (filter === "all") return true;
      if (filter === "unrated") return ratings[url] === undefined;
      return ratings[url] === filter;
    }
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Left Panel - URL List with Ratings */}
      <div className="flex w-1/2 flex-col border-r border-zinc-800">
        {/* Header with Progress */}
        <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 p-4 backdrop-blur">
          <h1 className="mb-3 text-xl font-bold tracking-tight text-zinc-100">
            Image Rater
          </h1>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="min-w-[80px] text-right text-sm font-medium text-zinc-400">
              {ratedCount}/{totalCount} rated
            </span>
          </div>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-zinc-700 text-zinc-100"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter("unrated")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === "unrated"
                  ? "bg-zinc-700 text-zinc-100"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
            >
              Unrated ({totalCount - ratedCount})
            </button>
            {[1, 2, 3, 4, 5].map((stars) => {
              const count = IMAGE_URLS.filter((url) => ratings[url] === stars).length;
              return (
                <button
                  key={stars}
                  onClick={() => setFilter(stars as FilterOption)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1 ${
                    filter === stars
                      ? "bg-zinc-700 text-zinc-100"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <span className="text-amber-400">{stars}★</span>
                  <span>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto">
          {filteredImages.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-zinc-500">
              No images match this filter
            </div>
          ) : (
            filteredImages.map(({ url, originalIndex }) => {
              const isSelected = selectedUrl === url;
              const isRated = ratings[url] !== undefined;

              return (
                <div
                  key={url}
                  onClick={() => setSelectedUrl(url)}
                  className={`flex cursor-pointer items-center gap-3 border-b border-zinc-800/50 px-4 py-3 transition-all duration-150 ${
                    isSelected
                      ? "bg-zinc-800"
                      : isRated
                      ? "bg-zinc-900/50 hover:bg-zinc-800/50"
                      : "hover:bg-zinc-900"
                  }`}
                >
                  {/* Index Number */}
                  <span className="w-8 text-right text-sm font-mono text-zinc-500">
                    {originalIndex + 1}
                  </span>

                  {/* URL (truncated) */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`truncate font-mono text-sm ${
                        isSelected ? "text-zinc-100" : "text-zinc-400"
                      }`}
                      title={url}
                    >
                      {url.split("/").pop()}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <StarRating
                    rating={ratings[url] || 0}
                    onRate={(rating) => handleRate(url, rating)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel - Image Preview */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-zinc-900 p-8">
        {selectedUrl ? (
          (() => {
            const currentFilteredIndex = filteredImages.findIndex(
              (img) => img.url === selectedUrl
            );
            const originalIndex = IMAGE_URLS.indexOf(selectedUrl);

            return (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-full max-w-lg overflow-hidden rounded-lg bg-zinc-800 shadow-2xl">
                  <img
                    src={selectedUrl}
                    alt={`Image ${originalIndex + 1}`}
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-zinc-500">
                    Image {originalIndex + 1} of {totalCount}
                    {filter !== "all" && (
                      <span className="text-zinc-600">
                        {" "}
                        ({currentFilteredIndex + 1}/{filteredImages.length} in filter)
                      </span>
                    )}
                  </p>
                  <StarRating
                    rating={ratings[selectedUrl] || 0}
                    onRate={(rating) => handleRate(selectedUrl, rating)}
                    size="large"
                  />
                  {ratings[selectedUrl] && (
                    <p className="text-sm font-medium text-amber-400">
                      Rated {ratings[selectedUrl]} star
                      {ratings[selectedUrl] !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (currentFilteredIndex > 0) {
                        setSelectedUrl(filteredImages[currentFilteredIndex - 1].url);
                      }
                    }}
                    disabled={currentFilteredIndex <= 0}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentFilteredIndex < filteredImages.length - 1) {
                        setSelectedUrl(filteredImages[currentFilteredIndex + 1].url);
                      }
                    }}
                    disabled={currentFilteredIndex >= filteredImages.length - 1}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-4xl">
              🖼️
            </div>
            <p className="text-lg font-medium text-zinc-400">
              Select an image to preview
            </p>
            <p className="text-sm text-zinc-600">
              Click on any item in the list to view the image
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
