import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Flag,
  Image as ImageIcon,
  Info,
  MapPin,
  Navigation,
  Share2,
  ShieldCheck,
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
import { getDarshanStatus, getNextAarti } from '../utils/timingsUtils';
import { ReportProblemModal } from '../components/Modal/ReportProblemModal';

export const PandalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { isSaved, toggleSave, isVisited, toggleVisited } = useMyDarshan();

  const [pandal, setPandal] = useState<Pandal | null>(null);
  const [allPandals, setAllPandals] = useState<Pandal[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(id));
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    pandalService.getPandals().then((list) => {
      if (mounted) setAllPandals(list);
    });

    if (id) {
      pandalService.getPandalById(id).then((data) => {
        if (mounted) {
          setPandal(data || null);
          setLoading(false);
          setActivePhotoIdx(0);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
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

  // Real-time status computations
  const darshanStatus = getDarshanStatus(pandal);
  const nextAarti = getNextAarti(pandal);

  // Previous and Next Pandals
  const currentIndex = allPandals.findIndex((p) => p.id === pandal.id);
  const prevPandal = currentIndex > 0 ? allPandals[currentIndex - 1] : allPandals[allPandals.length - 1];
  const nextPandal = currentIndex < allPandals.length - 1 ? allPandals[currentIndex + 1] : allPandals[0];

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
    <div className="min-h-[100vh] min-h-[100dvh] bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-16">
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
          {/* Bookmark Button */}
          <button
            onClick={() => toggleSave(pandal.id)}
            title={saved ? t.saveToDarshan : t.myDarshan}
            className={`p-2 rounded-xl transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
              saved
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>

          {/* Mark Visited Button */}
          <button
            onClick={() => toggleVisited(pandal.id)}
            title={visited ? t.visitedBadge : t.markVisited}
            className={`hidden sm:flex p-2 rounded-xl transition-all cursor-pointer min-h-[36px] min-w-[36px] items-center justify-center ${
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

          {/* Theme Toggle & Language Switcher */}
          <ThemeToggle variant="nav" />
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 space-y-4 sm:space-y-6">
        {/* TOP CARD: Answer All Key Questions Without Scrolling */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 dark:border-stone-800">
          {/* Featured Photo with Header Overlay */}
          <div className="relative h-60 sm:h-80 w-full bg-stone-800 overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent pointer-events-none" />

            {/* Top Area & Verification Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {pandal.area}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-emerald-300 backdrop-blur-md border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {pandal.isVerified ? t.verifiedBadge : t.communityBadge}
              </span>
            </div>

            {/* Title & Status on Image */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md text-amber-100 select-text">
                {pandal.name}
              </h1>
              <p className="text-xs text-stone-300 mt-0.5 flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-amber-400" />
                <span>{pandal.nearestStation}</span>
                {pandal.stationDistance && (
                  <span className="text-amber-200">({pandal.stationDistance})</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick-Scan Status Strip: Darshan Status & Crowd Level */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Live Darshan Status */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  darshanStatus.isOpen
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    darshanStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                  }`}
                />
                <span>{darshanStatus.statusText}</span>
              </div>

              {/* Crowd Level */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                <Users className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>
            </div>

            {/* Next Aarti Callout */}
            {nextAarti && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300">
                <Bell className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                <span>{t.nextAartiLabel}: {nextAarti.displayText}</span>
              </div>
            )}
          </div>

          {/* Primary Action Button: LARGE DIRECTIONS BUTTON */}
          <div className="p-4 sm:p-5">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 shadow-xl shadow-orange-600/30 active:scale-[0.98] transition-all text-base sm:text-lg cursor-pointer"
            >
              <Navigation className="w-6 h-6" />
              <span>{t.getDirections}</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </section>

        {/* Road Closure Notice (if present) */}
        {pandal.roadClosureNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">{t.roadClosureNotice}</p>
              <p className="mt-0.5">{pandal.roadClosureNotice}</p>
            </div>
          </div>
        )}

        {/* Queue Advisory Card for High-Crowd Pandals */}
        {pandal.crowdLevel === 'High' && (
          <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 rounded-3xl p-4 sm:p-5 border border-red-200 dark:border-red-900/50 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
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
          <div className="p-4 rounded-3xl bg-orange-50/80 dark:bg-stone-900 border border-orange-200/80 dark:border-orange-950/60 shadow-sm">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-400 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Clock className="w-4 h-4" />
              <span>{t.darshanTimings}</span>
            </div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug select-text">
              {pandal.darshanTimings}
            </p>
          </div>

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

        {/* Public Transport & Address */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl p-5 shadow-lg border border-stone-200/80 dark:border-stone-800 space-y-3.5">
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

          {/* Full Address with Copy Address Button */}
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

        {/* History & Story */}
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

        {/* Trust & Moderation Footer */}
        <section className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.lastUpdatedLabel}: {pandal.lastUpdated || 'September 2027'}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 dark:text-orange-400 hover:underline cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{t.reportProblem}</span>
          </button>
        </section>

        {/* PREVIOUS / NEXT PANDAL NAVIGATION */}
        {allPandals.length > 1 && (
          <section className="pt-2 pb-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            {prevPandal && (
              <button
                type="button"
                onClick={() => navigate(`/pandal/${prevPandal.id}`)}
                className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-orange-400 transition-colors cursor-pointer text-left flex-1 min-w-0"
              >
                <ArrowLeft className="w-4 h-4 text-orange-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.previousPandal}</span>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{prevPandal.name}</p>
                </div>
              </button>
            )}

            {nextPandal && (
              <button
                type="button"
                onClick={() => navigate(`/pandal/${nextPandal.id}`)}
                className="flex items-center justify-end gap-2 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-orange-400 transition-colors cursor-pointer text-right flex-1 min-w-0"
              >
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.nextPandal}</span>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">{nextPandal.name}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-orange-600 shrink-0" />
              </button>
            )}
          </section>
        )}
      </main>

      {/* Crowdsourced Report Problem Modal */}
      <ReportProblemModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        pandal={pandal}
      />
    </div>
  );
};

export default PandalDetailPage;
