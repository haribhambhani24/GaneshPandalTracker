import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Flame, 
  Image as ImageIcon, 
  Info, 
  Leaf, 
  MapPin, 
  Navigation, 
  Share2, 
  Sparkles, 
  Train, 
  Users 
} from 'lucide-react';
import { pandalService } from '../services/pandalService';
import type { Pandal } from '../types/pandal';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';
import { getGoogleMapsDirectionsUrl } from '../utils/geoUtils';

export const PandalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isDark, toggleTheme } = useTheme();

  const [pandal, setPandal] = useState<Pandal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    if (id) {
      setLoading(true);
      pandalService.getPandalById(id).then((data) => {
        if (mounted) {
          setPandal(data || null);
          setLoading(false);
          setActivePhotoIdx(0);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
          Loading pandal details...
        </p>
      </div>
    );
  }

  if (!pandal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6 text-center text-stone-800 dark:text-stone-200">
        <div className="text-5xl mb-4">🕉️</div>
        <h2 className="text-xl font-bold mb-2">Pandal Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">The pandal you are looking for could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-sm shadow-md cursor-pointer hover:bg-orange-700"
        >
          {t.backToMap}
        </button>
      </div>
    );
  }

  const photos = pandal.gallery && pandal.gallery.length > 0 ? pandal.gallery : [pandal.photoUrl];
  const directionsUrl = getGoogleMapsDirectionsUrl(pandal.lat, pandal.lng, pandal.name);

  const handleShare = async () => {
    const shareText = `Check out ${pandal.name} in ${pandal.area} on Pandal Map!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pandal.name,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const crowdBadge = () => {
    switch (pandal.crowdLevel) {
      case 'High':
        return {
          bg: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/70 dark:text-red-300',
          dot: 'bg-red-500 animate-ping',
          label: t.crowdHigh,
        };
      case 'Medium':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300',
          dot: 'bg-amber-500',
          label: t.crowdMedium,
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300',
          dot: 'bg-emerald-500',
          label: t.crowdLow,
        };
    }
  };

  const badge = crowdBadge();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-16">
      {/* Sticky Top Header */}
      <nav className="sticky top-0 z-[1000] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-600" />
          <span>{t.backToMap}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            title={t.share}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 space-y-6">
        {/* Photo Gallery Card */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 dark:border-stone-800">
          {/* Main Featured Photo */}
          <div className="relative h-64 sm:h-96 w-full bg-stone-800 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-stone-800 animate-pulse flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-stone-600 animate-spin" />
              </div>
            )}
            <img
              src={photos[activePhotoIdx]}
              alt={`${pandal.name} photo ${activePhotoIdx + 1}`}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Area Badge on Image */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {pandal.area}
              </span>
            </div>

            {/* Counter badge on bottom-right of photo */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg border border-white/20">
                📷 {activePhotoIdx + 1} / {photos.length}
              </div>
            )}

            {/* Pandal Title on Image */}
            <div className="absolute bottom-4 left-4 right-16 text-white">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md text-amber-100">
                {pandal.name}
              </h1>
            </div>
          </div>

          {/* Gallery Thumbnails Strip */}
          {photos.length > 1 && (
            <div className="p-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePhotoIdx(idx);
                    setImageLoaded(false);
                  }}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-orange-500 ring-2 ring-orange-400/50 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Status Badges & Quick Action */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-lg border border-stone-200/80 dark:border-stone-800 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Crowd Level */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dot.replace(' animate-ping', '')}`} />
              </span>
              <Users className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </div>

            {/* Eco Friendly */}
            {pandal.ecoFriendly ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.ecoFriendlyBadge}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-normal text-stone-500 bg-stone-100 border border-stone-200 dark:bg-stone-800 dark:text-stone-400">
                <span>{t.traditionalIdol}</span>
              </div>
            )}

            {/* 24-Hours badge */}
            {(pandal.is24Hours || pandal.darshanTimings.toLowerCase().includes('24')) && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.twentyFourHoursBadge}</span>
              </div>
            )}
          </div>

          {/* Primary Action Button: Get Directions */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 shadow-xl shadow-orange-600/30 active:scale-[0.98] transition-all text-sm sm:text-base cursor-pointer"
          >
            <Navigation className="w-5 h-5" />
            <span>{t.getDirections}</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
        </section>

        {/* Timings Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Darshan */}
          <div className="p-4 rounded-3xl bg-orange-50/80 dark:bg-stone-900 border border-orange-200/80 dark:border-orange-950/60 shadow-sm">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-400 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Clock className="w-4 h-4" />
              <span>{t.darshanTimings}</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug">
              {pandal.darshanTimings}
            </p>
          </div>

          {/* Aarti */}
          <div className="p-4 rounded-3xl bg-rose-50/80 dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950/60 shadow-sm">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4" />
              <span>{t.aartiTimings}</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug">
              {pandal.aartiTimings}
            </p>
          </div>
        </section>

        {/* Transit & Immersion Info */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-lg border border-stone-200/80 dark:border-stone-800 space-y-3.5">
          {/* Railway Station */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                {t.nearestStation}
              </p>
              <p className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                {pandal.nearestStation}
              </p>
            </div>
          </div>

          {/* Full Address */}
          <div className="flex items-start gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                {t.address}
              </p>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed">
                {pandal.address}
              </p>
            </div>
          </div>

          {/* Visarjan Date */}
          <div className="flex items-start gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                {t.visarjanDate}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                {pandal.visarjanDate}
              </p>
            </div>
          </div>
        </section>

        {/* History & Cultural Story */}
        {pandal.history && (
          <section className="bg-amber-50/70 dark:bg-stone-900/90 rounded-3xl p-5 sm:p-6 shadow-md border border-amber-200/80 dark:border-amber-900/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider">
                {t.historyAndStory}
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 font-medium">
              {pandal.history}
            </p>
          </section>
        )}

        {/* Description & Overview */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-lg border border-stone-200/80 dark:border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
            <Info className="w-4 h-4 text-orange-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t.aboutPandal}
            </h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {pandal.description}
          </p>
        </section>
      </main>
    </div>
  );
};

export default PandalDetailPage;
