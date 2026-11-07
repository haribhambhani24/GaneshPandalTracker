import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Copy,
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
  Users,
} from 'lucide-react';
import { pandalService } from '../services/pandalService';
import type { Pandal } from '../types/pandal';
import { useI18n } from '../context/I18nContext';
import { LanguageSwitcher } from '../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../components/Header/ThemeToggle';
import { useMyDarshan } from '../hooks/useMyDarshan';
import { getGoogleMapsDirectionsUrl } from '../utils/geoUtils';

export const PandalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, formatNumber } = useI18n();
  const { isSaved, toggleSave, isVisited, toggleVisited } = useMyDarshan();

  const [pandal, setPandal] = useState<Pandal | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    if (id) {
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
      <div className="min-h-[100vh] min-h-[100dvh] flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 p-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
          {t.loadingPandalDetails}
        </p>
      </div>
    );
  }

  if (!pandal) {
    return (
      <div className="min-h-[100vh] min-h-[100dvh] pt-safe pb-safe flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6 text-center text-stone-800 dark:text-stone-200">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-4xl shadow-inner mb-4">
          🕉️
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 mb-3">
          404 - Not Found
        </span>
        <h2 className="text-xl sm:text-2xl font-black mb-2 text-stone-900 dark:text-white">
          {t.pandalNotFoundTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-sm">
          {t.pandalNotFoundMsg}
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-md hover:from-orange-500 hover:to-amber-500 active:scale-95 transition-all cursor-pointer min-h-[44px]"
        >
          {t.backToMap}
        </button>
      </div>
    );
  }

  const saved = isSaved(pandal.id);
  const visited = isVisited(pandal.id);

  const photos = pandal.gallery && pandal.gallery.length > 0 ? pandal.gallery : [pandal.photoUrl];
  const directionsUrl = getGoogleMapsDirectionsUrl(pandal.lat, pandal.lng, pandal.name);

  const handleShare = async () => {
    const shareText = `Check out ${pandal.name} in ${pandal.area} on Ganesh Pandal Tracker!`;
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

  const handleCopyAddress = async () => {
    if (!pandal?.address) return;
    try {
      await navigator.clipboard.writeText(pandal.address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2500);
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = pandal.address;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setAddressCopied(true);
        setTimeout(() => setAddressCopied(false), 2500);
      } catch (err) {
        console.warn('Failed to copy address:', err);
      }
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
    <div className="min-h-[100vh] min-h-[100dvh] bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-safe">
      {/* Sticky Top Header */}
      <nav className="sticky top-0 z-[1000] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 shadow-xs pt-safe">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer min-h-[36px]"
          title={t.backToMap}
        >
          <ArrowLeft className="w-4 h-4 text-orange-600" />
          <span className="hidden min-[360px]:inline">{t.backToMap}</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bookmark Button (Desktop / Tablet, or when space permits) */}
          <button
            onClick={() => toggleSave(pandal.id)}
            title={saved ? t.saveToDarshan : t.myDarshan}
            className={`hidden sm:flex p-2 rounded-xl transition-all cursor-pointer ${
              saved
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>

          {/* Mark Visited Button (Desktop / Tablet) */}
          <button
            onClick={() => toggleVisited(pandal.id)}
            title={visited ? t.visitedBadge : t.markVisited}
            className={`hidden sm:flex p-2 rounded-xl transition-all cursor-pointer ${
              visited
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200'
            }`}
          >
            <Check className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            title={t.share}
            className="p-1.5 sm:p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Standardized Theme Toggle */}
          <ThemeToggle variant="nav" />

          {/* Language Switcher */}
          <LanguageSwitcher />
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

            {/* Area & Visited Badge on Image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {pandal.area}
              </span>
              {visited && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                  {t.visitedBadge}
                </span>
              )}
            </div>

            {/* Counter badge on bottom-right of photo */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg border border-white/20">
                📷 {formatNumber(activePhotoIdx + 1)} / {formatNumber(photos.length)}
              </div>
            )}

            {/* Pandal Title on Image */}
            <div className="absolute bottom-4 left-4 right-16 text-white">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md text-amber-100 select-text">
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
                  aria-label={`${pandal.name} photo ${idx + 1}`}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-orange-500 ring-2 ring-orange-400/50 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt={`${pandal.name} photo thumbnail ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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

        {/* Queue Advisory Card for High-Crowd Pandals */}
        {pandal.crowdLevel === 'High' && (
          <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 rounded-3xl p-5 border border-red-200 dark:border-red-900/50 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{t.queueAdvisoryTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-800/90 border border-red-200/60 dark:border-stone-700 space-y-1">
                <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm block">
                  {t.mukhDarshan}
                </span>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {t.mukhDarshanDesc}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-800/90 border border-red-200/60 dark:border-stone-700 space-y-1">
                <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm block">
                  {t.navasDarshan}
                </span>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {t.navasDarshanDesc}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 italic">
              {t.queueInsiderTip}
            </p>
          </section>
        )}

        {/* Timings Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Darshan */}
          <div className="p-4 rounded-3xl bg-orange-50/80 dark:bg-stone-900 border border-orange-200/80 dark:border-orange-950/60 shadow-sm">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-400 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Clock className="w-4 h-4" />
              <span>{t.darshanTimings}</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug select-text">
              {pandal.darshanTimings}
            </p>
          </div>

          {/* Aarti */}
          <div className="p-4 rounded-3xl bg-rose-50/80 dark:bg-stone-900 border border-rose-200/80 dark:border-rose-950/60 shadow-sm">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Flame className="w-4 h-4" />
              <span>{t.aartiTimings}</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug select-text">
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
              <p className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 mt-0.5 select-text">
                {pandal.nearestStation}
              </p>
            </div>
          </div>

          {/* Full Address with Copy Button */}
          <div className="flex items-start justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                  {t.address}
                </p>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed select-text font-normal">
                  {pandal.address}
                </p>
              </div>
            </div>

            {/* Small Copy Address button */}
            <button
              id="copy-address-button"
              onClick={handleCopyAddress}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border shadow-xs ${
                addressCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 dark:border-stone-700'
              }`}
              title={addressCopied ? t.addressCopied : t.copyAddress}
              aria-label={addressCopied ? t.addressCopied : t.copyAddress}
            >
              {addressCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{t.addressCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>{t.copyAddress}</span>
                </>
              )}
            </button>
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
              <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 mt-0.5 select-text">
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
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 font-medium select-text">
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
          <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 select-text">
            {pandal.description}
          </p>
        </section>
      </main>
    </div>
  );
};

export default PandalDetailPage;
