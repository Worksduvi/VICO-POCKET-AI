
import React, { useState, useEffect } from 'react';
import { NEWS_CATEGORIES, GENERATE_MOCK_NEWS, TRANSLATIONS, RSS_SOURCES } from '../constants';
import { RefreshCw, Globe, Rss, Share2, Heart, BarChart2, ExternalLink, Bookmark, X, BookOpen, Plus, Save } from 'lucide-react';
import { Note, NewsItem, AppSettings } from '../types';

interface DiscoveryViewProps {
  addNote: (note: Partial<Note>) => void;
  sendToAnalysis: (text: string) => void;
  isCyber: boolean;
  settings: AppSettings;
  setSettings?: (s: AppSettings) => void;
}

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ addNote, sendToAnalysis, isCyber, settings, setSettings }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Actualidad IA');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readingItem, setReadingItem] = useState<NewsItem | null>(null);
  
  // RSS Modal State
  const [showAddRss, setShowAddRss] = useState(false);
  const [newRssTitle, setNewRssTitle] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');

  const t = TRANSLATIONS[settings.language as keyof typeof TRANSLATIONS] || TRANSLATIONS.es;

  useEffect(() => {
    loadNews();
  }, [settings.language]);

  const loadNews = () => {
      setLoading(true);
      setTimeout(() => {
          setNews(GENERATE_MOCK_NEWS(settings.language));
          setLoading(false);
      }, 800);
  };

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(n => n.category === selectedCategory || (Math.random() > 0.7)); 

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(favorites.includes(id)) setFavorites(favorites.filter(fav => fav !== id));
    else setFavorites([...favorites, id]);
  };

  const handleShare = async (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.summary,
          url: item.url
        });
      } else {
        throw new Error('Share API not supported');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        alert(t.share_error);
      }
    }
  };

  const handleSaveToLinks = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    addNote({
        title: item.title,
        content: item.summary,
        url: item.url,
        folder: 'Links',
        tags: [item.category, 'News']
    });
    alert('Guardado en Links (Pocket)');
  };

  const saveRss = () => {
      if(!newRssTitle || !newRssUrl || !setSettings) return;
      const currentFeeds = settings.customRssFeeds || RSS_SOURCES;
      const newFeed = { title: newRssTitle, url: newRssUrl };
      setSettings({
          ...settings,
          customRssFeeds: [...currentFeeds, newFeed]
      });
      setNewRssTitle('');
      setNewRssUrl('');
      setShowAddRss(false);
      alert('RSS Añadido con éxito');
  };

  return (
    <div className="h-full flex flex-col pb-20 relative">
      {/* Header */}
      <div className="p-4 bg-slate-900/90 backdrop-blur border-b border-slate-700 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Rss className={isCyber ? "text-blue-500" : "text-yellow-500"} />
                Discovery
            </h2>
            <div className="flex gap-2">
                 <button onClick={() => setShowAddRss(true)} className="p-1.5 rounded-full bg-slate-800 text-green-400 border border-slate-600 hover:bg-slate-700">
                    <Plus size={14} />
                 </button>
                 <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-600">
                    {settings.language.toUpperCase()}
                 </span>
                <button onClick={loadNews} className={`p-1.5 rounded-full bg-slate-800 text-white ${loading ? 'animate-spin' : ''}`}>
                    <RefreshCw size={14} />
                </button>
            </div>
        </div>
        
        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
            {NEWS_CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                        selectedCategory === cat
                        ? (isCyber ? 'bg-blue-600 border-blue-400 text-white' : 'bg-yellow-600 border-yellow-400 text-white')
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Add RSS Modal */}
      {showAddRss && (
          <div className="p-4 bg-slate-800 border-b border-slate-700 animate-in fade-in space-y-3">
              <div className="flex justify-between text-white text-sm font-bold">
                  <span>Añadir Fuente RSS Manual</span>
                  <button onClick={() => setShowAddRss(false)}><X size={16}/></button>
              </div>
              <input 
                value={newRssTitle} 
                onChange={e => setNewRssTitle(e.target.value)} 
                placeholder="Título de la fuente (ej: The Verge)" 
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" 
              />
              <input 
                value={newRssUrl} 
                onChange={e => setNewRssUrl(e.target.value)} 
                placeholder="URL del Feed RSS" 
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm" 
              />
              <button onClick={saveRss} className="w-full bg-green-600 py-2 rounded text-white font-bold text-sm flex items-center justify-center gap-2">
                  <Save size={14}/> Guardar Fuente
              </button>
          </div>
      )}

      {/* News List (Google News Style) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-400 animate-pulse text-xs">{t.processing}</p>
            </div>
        ) : (
            filteredNews.map(item => (
                <div 
                    key={item.id} 
                    onClick={() => setReadingItem(item)}
                    className="flex bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                    {/* Image Left */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                         <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-[8px] text-white truncate text-center">
                            {item.source}
                        </div>
                    </div>
                    
                    {/* Content Right */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] text-blue-400 font-bold mb-1 block uppercase tracking-wide">{item.category}</span>
                                <span className="text-[9px] text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-slate-400 text-xs line-clamp-2">{item.summary}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-2 mt-2 border-t border-slate-800">
                             <button onClick={(e) => handleSaveToLinks(e, item)} className="text-slate-500 hover:text-green-400" title="Pocket / Links">
                                <Bookmark size={14} />
                             </button>
                             <button onClick={(e) => toggleFavorite(e, item.id)} className={`${favorites.includes(item.id) ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}>
                                <Heart size={14} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                             </button>
                             <button onClick={(e) => handleShare(e, item)} className="text-slate-500 hover:text-white">
                                <Share2 size={14} />
                             </button>
                             <button onClick={(e) => {
                                 e.stopPropagation();
                                 sendToAnalysis(item.summary + " " + item.title);
                             }} className="text-slate-500 hover:text-blue-400">
                                <BarChart2 size={14} />
                             </button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Reader Modal */}
      {readingItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex flex-col animate-in fade-in">
              <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-white truncate w-3/4">{readingItem.title}</h3>
                  <div className="flex gap-4">
                      <a href={readingItem.url} target="_blank" rel="noreferrer" className="text-blue-400 text-xs flex items-center gap-1">
                          <ExternalLink size={14}/> Abrir Web
                      </a>
                      <button onClick={() => setReadingItem(null)} className="text-white">
                          <X size={20} />
                      </button>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                  <img src={readingItem.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg" />
                  <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
                      <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded">{readingItem.source}</span>
                      <span>{new Date(readingItem.date).toLocaleDateString()}</span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                      <p className="text-lg text-white font-medium mb-4">{readingItem.summary}</p>
                      <p className="text-slate-300 leading-relaxed">
                          (Simulación de contenido completo) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                          <br/><br/>
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                      <button 
                        onClick={() => {
                            handleSaveToLinks({ stopPropagation: () => {} } as any, readingItem);
                            setReadingItem(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2"
                      >
                          <Bookmark size={16} /> Guardar en Links
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DiscoveryView;
