import React, { useState } from "react";
import { Search, Heart, Sparkles, User, Trash2 } from "lucide-react";

interface DiscoverBoardProps {
  referenceBoardPosts: any[];
  userProfile: {
    username: string;
    savedPostIds: string[];
    uploadedPostIds: string[];
  };
  onLikeOrSave: (postId: string) => void;
  onImportToAlbum: (style: any) => void;
  onDeletePost: (postId: string) => void;
  isLoggedIn: boolean;
  triggerToast: (msg: string) => void;
}

export function DiscoverBoard({
  referenceBoardPosts,
  userProfile,
  onLikeOrSave,
  onImportToAlbum,
  onDeletePost,
  isLoggedIn,
  triggerToast
}: DiscoverBoardProps) {
  const [referenceSearch, setReferenceSearch] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Filter posts based on searches, category chips, and Saved collection state
  const filteredPosts = referenceBoardPosts.filter((post) => {
    // 1. Saved-only toggle
    if (showSavedOnly && !userProfile.savedPostIds.includes(post.id)) {
      return false;
    }
    // 2. Keyword Search
    if (referenceSearch) {
      const q = referenceSearch.toLowerCase();
      const matchesTitle = post.name.toLowerCase().includes(q);
      const matchesVibe = post.vibe.toLowerCase().includes(q);
      const matchesDesc = post.description.toLowerCase().includes(q);
      if (!matchesTitle && !matchesVibe && !matchesDesc) return false;
    }
    // 3. Username Search
    if (usernameSearch) {
      const u = usernameSearch.toLowerCase();
      if (!post.author.toLowerCase().includes(u)) return false;
    }
    // 4. Category Chip filter
    if (categoryFilter) {
      if (post.category !== categoryFilter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="discover-board-section">
      {/* Editorial Header */}
      <div className="bg-white rounded-2xl p-6 border border-pink-100 text-center max-w-4xl mx-auto space-y-4 shadow-sm">
        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-pink-600 border border-pink-100">
          💅 Pinterest Discovery Board
        </span>
        <h2 className="font-display text-2xl font-extrabold text-stone-800">
          Find Creative Reference Textures &amp; Styles
        </h2>
        <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
          Browse beautiful, high-fashion nail styles published by our community. Click <strong className="text-pink-600">"📥 Import"</strong> to render pattern textures into your atelier, or save them directly to your collection!
        </p>

        {/* Dual Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
          {/* Keywords Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={referenceSearch}
              onChange={(e) => setReferenceSearch(e.target.value)}
              placeholder="Search keywords (e.g. coquette, chrome, glaze)..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
            />
          </div>

          {/* Username Search */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={usernameSearch}
              onChange={(e) => setUsernameSearch(e.target.value)}
              placeholder="Search user accounts by username..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
            />
          </div>
        </div>

        {/* Filter Bar Toggles */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2 border-t border-stone-100 mt-2">
          {/* Board category chips */}
          {["Coquette", "Y2K", "Clean Girl", "Cottagecore", "Minimalist", "Grunge"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                categoryFilter === cat
                  ? "bg-pink-600 border-pink-600 text-white shadow-xs"
                  : "bg-stone-50 hover:bg-pink-50 hover:text-pink-600 border-stone-200/80 text-stone-600"
              }`}
            >
              #{cat}
            </button>
          ))}

          <div className="w-px h-4 bg-stone-200 mx-2 hidden md:block" />

          {/* Pinterest "My Collection" Filter Switch at top! */}
          <button
            onClick={() => {
              setShowSavedOnly(!showSavedOnly);
              triggerToast(showSavedOnly ? "Showing all reference styles" : "Filtering to My Nail Collection!");
            }}
            className={`px-4 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1.5 ${
              showSavedOnly
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow-xs"
                : "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100"
            }`}
          >
            <Heart className={`w-3 h-3 ${showSavedOnly ? "fill-white" : ""}`} />
            <span>My Nail Collection</span>
          </button>
        </div>
      </div>

      {/* Grid Display of Pinterest Pins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredPosts.map((post) => {
          const isSaved = userProfile.savedPostIds.includes(post.id);
          const isOwnPost = post.author === userProfile.username;

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-pink-100 overflow-hidden hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group shadow-sm relative"
              id={`pin-${post.id}`}
            >
              {/* Card visual pin header/media */}
              <div className="aspect-square bg-stone-100 flex items-center justify-center relative overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-white"
                    style={{
                      background: `radial-gradient(circle, ${post.colors[0] || "#E9D5C5"}, ${post.colors[1] || "#8E9A8A"})`
                    }}
                  >
                    <span className="text-xl">✨</span>
                  </div>
                )}

                {/* Heart Toggle Overlay Button */}
                <button
                  onClick={() => onLikeOrSave(post.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md border ${
                    isSaved
                      ? "bg-rose-500 border-rose-500 text-white scale-110"
                      : "bg-white/90 border-pink-100 text-stone-500 hover:text-rose-500 hover:bg-white"
                  }`}
                  title={isSaved ? "Saved to Collection" : "Save to Collection"}
                  id={`save-btn-${post.id}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                </button>

                {/* Category Pill */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-pink-600 font-mono text-[9px] uppercase tracking-wider border border-pink-100 font-bold">
                  {post.category}
                </span>

                {/* Palette representation */}
                <div className="absolute bottom-3 left-3 flex gap-1 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-pink-100 shadow-xs">
                  {post.colors.map((c: string, idx: number) => (
                    <div
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-stone-200 shrink-0"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>

                {/* Author attribution overlay */}
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-stone-900/70 backdrop-blur-xs text-[9px] text-white font-mono flex items-center gap-1">
                  <User className="w-2.5 h-2.5 text-pink-300" />
                  @{post.author}
                </span>
              </div>

              {/* Text Description Box */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <h4 className="font-display font-extrabold text-stone-800 text-sm group-hover:text-pink-600 transition leading-snug">
                      {post.name}
                    </h4>
                    {isOwnPost && (
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="text-stone-400 hover:text-red-500 transition p-1"
                        title="Delete reference"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wide">
                    {post.vibe}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-relaxed min-h-8">
                    {post.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {/* Action 1: Import texture into album */}
                  <button
                    onClick={() => onImportToAlbum(post)}
                    className="flex-1 py-2 bg-pink-50 hover:bg-pink-600 border border-pink-100 text-pink-600 hover:text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <span>📥 Import to Album</span>
                  </button>

                  {/* Likes counter indicator */}
                  <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-50 px-2.5 py-2 rounded-xl border border-stone-100 flex items-center gap-1 shrink-0">
                    💖 {post.likes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-16 text-center text-stone-400 bg-white rounded-2xl border border-dashed border-stone-200">
            No reference pins matched your search filters. Try searching a different keyword or username!
          </div>
        )}
      </div>
    </div>
  );
}
