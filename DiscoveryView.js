import React, { useState } from 'react';
import { Compass, RefreshCw, Rss, Heart, Share2 } from 'lucide-react';

const DiscoveryView = ({ isCyber, settings }) => {
  return (
    <div className="h-full flex flex-col bg-[#0b0f1a]">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="text-orange-500" /> Discovery Feed
        </h2>
      </div>
      <div className="p-10 text-center text-slate-500">
        <Rss size={48} className="mx-auto mb-4 opacity-20" />
        <p>No hay noticias nuevas en este momento.</p>
      </div>
    </div>
  );
};

export default DiscoveryView;
