import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext.tsx';
import { StaggerGrid, StaggerItem, EASE_OUT_EXPO } from '../components/MotionPrimitives.tsx';
import { Heart, Eye, MessageSquare, Plus, Clock, Send } from 'lucide-react';

export const ArticlesPage: React.FC = () => {
  const { articles, comments, currentUser, theme, authFetch, refreshData, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Article State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tutoriels');
  const [readTime, setReadTime] = useState('5 min');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const isLight = theme === 'light';

  const categories = [
    'Tous',
    'Articles',
    'Tutoriels',
    'Astuces',
    'Actualités technologiques',
    'Retours d’expérience',
    'Ressources',
    'Guides',
  ];

  const publishedArticles = articles.filter((a) => a.isPublished);
  const filteredArticles = publishedArticles.filter(
    (a) => selectedCategory === 'Tous' || a.category === selectedCategory
  );

  const selectedArticle =
    filteredArticles.find((a) => a.id === activeArticleId) || filteredArticles[0] || null;

  const handleLikeArticle = async (id: number) => {
    const res = await authFetch(`/api/articles/${id}/like`, { method: 'POST' });
    if (res.ok) {
      await refreshData();
      showToast('Merci pour votre soutien à cet article !');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !commentText.trim()) return;
    const res = await authFetch(`/api/articles/${selectedArticle.id}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        userId: currentUser?.id || 1,
        userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Membre AFRIKDEV',
        userAvatar: currentUser?.avatar,
        content: commentText,
      }),
    });
    if (res.ok) {
      setCommentText('');
      await refreshData();
      showToast('Commentaire publié !');
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify({
        title,
        category,
        readTime,
        excerpt,
        content,
        authorId: currentUser?.id || 1,
        authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Amina Diallo',
        authorAvatar: currentUser?.avatar,
      }),
    });
    if (res.ok) {
      await refreshData();
      setShowCreateModal(false);
      setTitle('');
      setExcerpt('');
      setContent('');
      showToast('Article publié avec succès !');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-mono text-emerald-500">PARTAGE DE CONNAISSANCES & VEILLE TECH</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
            Actualités, Tutoriels & Guides
          </h1>
          <p className={`text-sm max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Explorez les retours d’expérience, astuces d’architecture et tutoriels rédigés par les
            développeurs et ingénieurs de la communauté AFRIKDEV.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Publier un article</span>
        </button>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Master-Detail Articles View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List */}
        <StaggerGrid className="lg:col-span-5 space-y-4">
          {filteredArticles.map((art) => {
            const isSelected = selectedArticle?.id === art.id;
            return (
              <StaggerItem
                key={art.id}
                className={`pro-max-card p-5 rounded-2xl border cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div onClick={() => setActiveArticleId(art.id)} className="space-y-3">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-emerald-500 font-semibold">{art.category}</span>
                    <span>·</span>
                    <span>{art.authorName}</span>
                    <span>·</span>
                    <span>{new Date(art.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-display">{art.title}</h2>
                  <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {art.viewsCount} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> {art.likesCount} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> {art.commentsCount} comm.
                    </span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Right Full Reader & Comments */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedArticle && (
              <motion.div
                key={selectedArticle.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                className={`p-8 rounded-2xl border space-y-6 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
              <img
                src={selectedArticle.coverImage}
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover rounded-xl"
              />

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedArticle.authorAvatar}
                    alt={selectedArticle.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold">{selectedArticle.authorName}</p>
                    <p className="text-xs text-slate-400">
                      {selectedArticle.category} · Publié le{' '}
                      {new Date(selectedArticle.createdAt).toLocaleDateString('fr-FR')} ·{' '}
                      {selectedArticle.readTime} de lecture
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLikeArticle(selectedArticle.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>Soutenir ({selectedArticle.likesCount})</span>
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                {selectedArticle.title}
              </h2>

              <div className={`space-y-4 text-sm leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                {selectedArticle.content}
              </div>

              {/* Comments Section */}
              <div className="pt-6 border-t border-slate-800/60 space-y-4">
                <h3 className="text-base font-bold font-display">
                  Commentaires de la communauté (
                  {comments.filter((c) => c.articleId === selectedArticle.id).length})
                </h3>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Partagez votre avis ou posez une question technique..."
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Commenter</span>
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {comments
                    .filter((c) => c.articleId === selectedArticle.id)
                    .map((c) => (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400">{c.userName}</span>
                          <span className="text-slate-500 font-mono">
                            {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>{c.content}</p>
                      </div>
                    ))}
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <h3 className="text-xl font-bold font-display">Publier un article ou tutoriel</h3>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  >
                    {categories.filter((c) => c !== 'Tous').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Résumé (Excerpt)</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contenu complet de l’article</label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
