import React, { useState } from "react";
import { User, LogIn, LogOut, Plus, Heart, FolderHeart, Image as ImageIcon } from "lucide-react";

interface UserProfileProps {
  isLoggedIn: boolean;
  userProfile: {
    email: string;
    phone: string;
    username: string;
    savedPostIds: string[];
    uploadedPostIds: string[];
  };
  onLogin: (email: string, phone: string, username: string) => void;
  onLogout: () => void;
  onUpdateUsername: (newUsername: string) => void;
  onPublishPost: (e: React.FormEvent<HTMLFormElement>) => void;
  referenceBoardPosts: any[];
  onLikeOrSave: (postId: string) => void;
  onImportToAlbum: (style: any) => void;
  triggerToast: (msg: string) => void;
}

export function UserProfile({
  isLoggedIn,
  userProfile,
  onLogin,
  onLogout,
  onUpdateUsername,
  onPublishPost,
  referenceBoardPosts,
  onLikeOrSave,
  onImportToAlbum,
  triggerToast
}: UserProfileProps) {
  // Login Inputs State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  
  // Profile settings state
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userProfile.username);

  // Sub tab: Saved vs Uploaded
  const [profileSubTab, setProfileSubTab] = useState<"uploaded" | "saved">("uploaded");

  // Handle local submit of login form
  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      triggerToast("⚠️ Please provide either an Email address or Phone number to login!");
      return;
    }
    const finalUsername = usernameInput.trim() || `nail_artist_${Math.floor(Math.random() * 9000 + 1000)}`;
    onLogin(email || "guest@lamour.com", phone || "+1 (555) 000-0000", finalUsername);
    triggerToast(`🎉 Welcome back, @${finalUsername}! Let's start decorating and saving nails.`);
  };

  const handleUsernameSave = () => {
    if (!newUsername.trim()) return;
    onUpdateUsername(newUsername.trim());
    setEditingUsername(false);
    triggerToast(`✏️ Username updated to @${newUsername.trim()} successfully.`);
  };

  // Filter posts based on user's interactions
  const myUploadedPosts = referenceBoardPosts.filter((post) => post.author === userProfile.username);
  const mySavedPosts = referenceBoardPosts.filter((post) => userProfile.savedPostIds.includes(post.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" id="user-profile-section">
      {!isLoggedIn ? (
        /* PASSWORDLESS REGISTER / LOGIN SCREEN */
        <div className="bg-white rounded-3xl border border-pink-100 p-8 max-w-md mx-auto shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              👑
            </div>
            <h2 className="font-display text-xl font-extrabold text-stone-800">
              Join La'Mour Atelier Suite
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
              Log in with your Email or Phone Number to start uploading your custom reference designs and pinning styles!
            </p>
          </div>

          <form onSubmit={handleLocalLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. princess@lamour.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
              />
            </div>

            <div className="flex items-center justify-center my-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest bg-white px-2">OR</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Phone Number:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 349-2092"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
              />
            </div>

            <div className="border-t border-stone-100 pt-3">
              <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Choose Username:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="coquette_queen"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-7 pr-4 py-3 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-md shadow-pink-100"
            >
              <LogIn className="w-4 h-4" />
              <span>Start Posting References</span>
            </button>
          </form>
        </div>
      ) : (
        /* LOGGED IN ACCOUNT CONTROL PANEL */
        <div className="space-y-6">
          {/* User Profile Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xl font-bold font-mono shadow-inner border border-pink-200">
                💅
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {editingUsername ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-400 text-sm font-bold">@</span>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-0.5 text-xs text-stone-800 font-bold focus:outline-none"
                      />
                      <button
                        onClick={handleUsernameSave}
                        className="text-[10px] bg-pink-600 text-white font-bold px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-display font-extrabold text-stone-800 text-base">
                        @{userProfile.username}
                      </h3>
                      <button
                        onClick={() => {
                          setNewUsername(userProfile.username);
                          setEditingUsername(true);
                        }}
                        className="text-[10px] text-pink-600 hover:underline"
                      >
                        (edit)
                      </button>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-stone-400 font-mono">
                  {userProfile.email} • {userProfile.phone}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-stone-200/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Social references Publisher Form */}
          <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-pink-100/50 pb-3">
              <Plus className="w-5 h-5 text-pink-600" />
              <div>
                <h4 className="font-display font-extrabold text-stone-800 text-sm uppercase tracking-wider">
                  Publish a New Reference Pin
                </h4>
                <p className="text-[10px] text-stone-400 font-mono">
                  Share your DIY nails reference photos directly into our community discovery board!
                </p>
              </div>
            </div>

            <form onSubmit={onPublishPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nail Art Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Strawberry Syrup Ridges"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category Tag:
                  </label>
                  <select
                    name="category"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                  >
                    <option value="Coquette">Coquette 🎀</option>
                    <option value="Y2K">Y2K ⚡</option>
                    <option value="Clean Girl">Clean Girl 🍩</option>
                    <option value="Cottagecore">Cottagecore 🌸</option>
                    <option value="Minimalist">Minimalist 💅</option>
                    <option value="Grunge">Grunge 🌙</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Colors Hex Palette (comma separated):
                  </label>
                  <input
                    type="text"
                    name="colors"
                    placeholder="e.g. #EF4444, #FFFDF9, #FFA8B6"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Visual Vibe Aesthetic:
                  </label>
                  <input
                    type="text"
                    name="vibe"
                    placeholder="e.g. High-Gloss Juicy Strawberry Glaze"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Mockup Photo URL (Optional, defaults to stunning model set):
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    placeholder="e.g. https://images.unsplash.com/..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Art details / layering recipe:
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={2}
                    placeholder="Describe how to recreate (e.g. Sponge translucent base jelly color, add transparent pink bow charms...)"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-400 transition text-stone-800"
                  />
                </div>
              </div>

              <div className="col-span-full pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-extrabold text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Reference Pin</span>
                </button>
              </div>
            </form>
          </div>

          {/* Social Feed Lists Toggle buttons */}
          <div className="space-y-4">
            <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 max-w-sm">
              <button
                onClick={() => setProfileSubTab("uploaded")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  profileSubTab === "uploaded"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>My Uploaded Pins ({myUploadedPosts.length})</span>
              </button>
              <button
                onClick={() => setProfileSubTab("saved")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  profileSubTab === "saved"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>My Saved Pins ({mySavedPosts.length})</span>
              </button>
            </div>

            {/* Profile tab feed grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(profileSubTab === "uploaded" ? myUploadedPosts : mySavedPosts).map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-pink-50 overflow-hidden shadow-xs flex flex-col justify-between group p-3.5"
                >
                  <div className="aspect-square bg-stone-50 rounded-xl overflow-hidden relative mb-2.5">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white"
                        style={{
                          background: `radial-gradient(circle, ${post.colors[0] || "#E9D5C5"}, ${post.colors[1] || "#8E9A8A"})`
                        }}
                      >
                        <span>✨</span>
                      </div>
                    )}

                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-white/95 text-pink-600 text-[8px] font-bold uppercase tracking-wider border border-pink-50">
                      {post.category}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-display font-extrabold text-stone-800 text-xs truncate">
                      {post.name}
                    </h5>
                    <p className="text-[9px] text-stone-400 truncate font-mono mt-0.5 uppercase tracking-wide">
                      {post.vibe}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-3.5">
                    <button
                      onClick={() => onImportToAlbum(post)}
                      className="flex-1 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-[9px] font-bold uppercase transition"
                    >
                      Import to Album
                    </button>
                    <button
                      onClick={() => onLikeOrSave(post.id)}
                      className="p-1.5 bg-stone-50 hover:bg-rose-50 text-stone-500 hover:text-rose-600 rounded-lg border border-stone-200/50 transition shrink-0"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                    </button>
                  </div>
                </div>
              ))}

              {(profileSubTab === "uploaded" ? myUploadedPosts : mySavedPosts).length === 0 && (
                <div className="col-span-full py-12 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-xs">
                  {profileSubTab === "uploaded"
                    ? "You haven't uploaded any reference designs yet. Use the form above to post your first pin!"
                    : "No saved pins found. Pin beautiful reference styles on the Discover tab to build your collection!"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
