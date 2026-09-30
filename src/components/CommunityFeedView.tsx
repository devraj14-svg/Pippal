import React, { useState } from 'react';
import { FeedPost, TraderProfile } from '../types';
import {
  Flame,
  Heart,
  MessageSquare,
  Plus,
  Shield,
  Send,
  X,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface CommunityFeedViewProps {
  posts: FeedPost[];
  currentUser: TraderProfile;
  onAddPost: (post: FeedPost) => void;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({
  posts,
  currentUser,
  onAddPost,
}) => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(posts);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState<FeedPost['topic']>('Discipline');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const filteredPosts = feedPosts.filter((p) => {
    if (selectedTopic !== 'All' && p.topic !== selectedTopic) return false;
    return true;
  });

  const handleToggleLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComments = [
            ...(post.comments || []),
            {
              id: `c_${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              text: commentInput.trim(),
              timestamp: 'Just now',
            },
          ];
          return {
            ...post,
            commentsCount: newComments.length,
            comments: newComments,
          };
        }
        return post;
      })
    );
    setCommentInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      author: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        experience: currentUser.experience,
        location: currentUser.location,
        primaryMarket: currentUser.markets[0] || 'NIFTY',
      },
      content: newContent.trim(),
      topic: newTopic,
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      timestamp: 'Just now',
      comments: [],
    };

    onAddPost(newPost);
    setFeedPosts([newPost, ...feedPosts]);
    setShowCreateModal(false);
    setNewContent('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 space-y-6">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>COMMUNITY FEED</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>SUPPORT & PSYCHOLOGY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trader Stories & Mindset ☀️
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            A cheerful and supportive space to celebrate patience, discipline milestones, and mental clarity rather than profit flexing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/30 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Share Reflection</span>
        </button>
      </div>

      {/* Filter Tabs by Topic */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'Discipline', 'Psychology', 'Milestone', 'Setups', 'Beginner Help'].map(
          (topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 whitespace-nowrap shadow-xs ${
                selectedTopic === topic
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {topic === 'Discipline' && '🛡️ '}
              {topic === 'Psychology' && '🧠 '}
              {topic === 'Milestone' && '🎯 '}
              {topic === 'Setups' && '📈 '}
              {topic}
            </button>
          )
        )}
      </div>

      {/* Community Ethos Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-600 shrink-0" />
          <span className="font-medium">
            Supportive Ethos: We value risk management and discipline over bragging. Zero signal ads or spam.
          </span>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentsOpen = activeCommentPostId === post.id;

          return (
            <div
              key={post.id}
              className="rounded-3xl bg-white border border-stone-200/90 p-5 space-y-4 shadow-md shadow-stone-200/40 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300 transition-all duration-200"
            >
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full object-cover border border-stone-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {post.author.name}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        @{post.author.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                      <span>{post.author.experience}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-emerald-700 font-bold">
                        {post.author.primaryMarket}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                  {post.topic}
                </span>
              </div>

              {/* Post Body */}
              <p className="text-sm text-slate-800 leading-relaxed font-normal">
                "{post.content}"
              </p>

              {/* Action row: Likes & Comments */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 font-medium transition-all duration-150 hover:scale-110 active:scale-125 ${
                      post.isLiked
                        ? 'text-rose-600 font-bold'
                        : 'text-stone-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 transition-transform duration-150 ${post.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
                    />
                    <span className="font-mono tabular-nums">{post.likes}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(isCommentsOpen ? null : post.id)
                    }
                    className="flex items-center gap-1.5 text-stone-500 hover:text-slate-800 hover:scale-105 active:scale-95 transition-all duration-150 font-medium"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-mono tabular-nums">
                      {post.commentsCount}
                    </span>
                    <span>Replies</span>
                  </button>
                </div>

                <div className="text-[11px] text-stone-400 font-medium">
                  PipPal Peer Support
                </div>
              </div>

              {/* Expandable Comments Drawer */}
              {isCommentsOpen && (
                <div className="pt-3 border-t border-stone-100 space-y-3 bg-stone-50/70 p-3 rounded-2xl">
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-2.5">
                      {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5 text-xs">
                          <img
                            src={c.authorAvatar}
                            alt={c.authorName}
                            className="h-6 w-6 rounded-full object-cover shrink-0 mt-0.5 border border-stone-200"
                          />
                          <div className="flex-1 bg-white p-3 rounded-xl border border-stone-200/90 shadow-xs">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-bold text-slate-800">
                                {c.authorName}
                              </span>
                              <span className="text-stone-400 font-mono text-[10px]">
                                {c.timestamp}
                              </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs text-stone-500">
                      No replies yet. Be the first to share constructive thoughts!
                    </div>
                  )}

                  {/* Add reply input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a supportive reply..."
                      className="flex-1 h-9 px-3 rounded-xl bg-white border border-stone-200 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInput.trim()}
                      className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold transition-colors flex items-center justify-center shrink-0 shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Create Post */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-stone-200 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="h-4 w-4 text-emerald-600" />
                <span>Share with the Community</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Topic Category
                </label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 focus:border-emerald-500 focus:outline-none font-medium"
                >
                  <option value="Discipline">Discipline (Skipping bad setups, sticking to plan)</option>
                  <option value="Psychology">Psychology (Handling tilt, greed, FOMO)</option>
                  <option value="Milestone">Milestone (Consistent execution, completed rules)</option>
                  <option value="Setups">Setups (Observations, market structure)</option>
                  <option value="Beginner Help">Beginner Help (Questions & guidance)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Reflection or Question
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Skipped trading today because my setup wasn't there..."
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Encouraging honesty: We celebrate discipline and risk management over reckless gains.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                >
                  Post Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
