import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Flag,
  Footprints,
  Leaf,
  MapPin,
  Navigation,
  Share2,
  ShieldCheck,
  Train,
  Users,
} from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import { getGoogleMapsDirectionsUrl } from '../../utils/geoUtils';
import { useI18n } from '../../context/I18nContext';
import { useMyDarshan } from '../../hooks/useMyDarshan';
import { getDarshanStatus, getNextAarti, getTravelEstimate } from '../../utils/timingsUtils';
import { ReportProblemModal } from '../Modal/ReportProblemModal';

interface PandalDetailCardProps {
  pandal: Pandal;
  onClose?: () => void;
  userDistanceKm?: number | null;
}

export const PandalDetailCard: React.FC<PandalDetailCardProps> = ({
  pandal,
  onClose,
  userDistanceKm,
}) => {
  const navigate = useNavigate();
  const { t, formatNumber } = useI18n();
  const { isSaved, toggleSave, isVisited, toggleVisited } = useMyDarshan();
  const [copied, setCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const saved = isSaved(pandal.id);
  const visited = isVisited(pandal.id);

  const fallbackPhoto =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const directionsUrl = getGoogleMapsDirectionsUrl(pandal.lat, pandal.lng, pandal.name);

  // Real-time status
  const darshanStatus = getDarshanStatus(pandal);
  const nextAarti = getNextAarti(pandal);
  const travelEstimate = getTravelEstimate(userDistanceKm);

  const handleShare = async () => {
    const shareText = `Check out ${pandal.name} in ${pandal.area} on Ganesh Pandal Tracker!`;
    const shareUrl = `${window.location.origin}/pandal/${pandal.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: pandal.name,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(`${pandal.name} - ${shareUrl}`);
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
    <div className="flex flex-col h-full bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Image with Overlays */}
      <div className="relative h-44 sm:h-52 w-full bg-stone-800 overflow-hidden shrink-0">
        <img
          src={imageError ? fallbackPhoto : pandal.photoUrl}
          alt={pandal.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {pandal.area}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-emerald-300 backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {pandal.isVerified ? t.verifiedBadge : t.communityBadge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Bookmark / Save to My Darshan */}
            <button
              onClick={() => toggleSave(pandal.id)}
              title={saved ? 'Saved in My Darshan' : 'Save to My Darshan'}
              aria-label={saved ? 'Saved in My Darshan' : 'Save to My Darshan'}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                saved
                  ? 'bg-amber-500 text-white border-amber-300 shadow-md scale-105'
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>

            {/* Mark Visited */}
            <button
              onClick={() => toggleVisited(pandal.id)}
              title={visited ? 'Visited' : 'Mark as Visited'}
              aria-label={visited ? 'Visited' : 'Mark as Visited'}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                visited
                  ? 'bg-emerald-600 text-white border-emerald-300 shadow-md scale-105'
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
            >
              <Check className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title={t.share}
              aria-label={t.share}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 border border-white/20 transition-colors cursor-pointer"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {onClose && (
              <button
                onClick={onClose}
                title={t.close}
                aria-label={t.close || 'Close'}
                className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 border border-white/20 transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight drop-shadow-md text-amber-100 truncate select-text">
              {pandal.name}
            </h2>
            {visited && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow">
                {t.visitedBadge}
              </span>
            )}
          </div>

          {/* Distance & Travel Time Estimate */}
          {userDistanceKm !== null && userDistanceKm !== undefined && (
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mt-0.5">
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3 rotate-45" />
                {formatNumber(Number(userDistanceKm.toFixed(1)))} km
              </span>
              {travelEstimate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-300">
                    <Footprints className="w-3 h-3" />
                    {travelEstimate.walkingText}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-stone-800 dark:text-stone-200">
        {/* Quick Real-Time Status Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Darshan Open/Closed Status */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${badge.dot}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${badge.dot.replace(' animate-ping', '')}`} />
            </span>
            <Users className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>

          {/* Eco Friendly */}
          {pandal.ecoFriendly && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{t.ecoFriendlyBadge}</span>
            </div>
          )}
        </div>

        {/* Next Aarti Callout */}
        {nextAarti && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300 font-medium">
            <Bell className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
            <span>
              <strong>{t.nextAartiLabel}:</strong> {nextAarti.displayText}
            </span>
          </div>
        )}

        {/* Address & Public Transport */}
        <div className="bg-amber-50/60 dark:bg-stone-800/60 p-3 rounded-xl border border-amber-200/60 dark:border-stone-700/60 space-y-2">
          <div className="flex items-start gap-2.5">
            <Train className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] uppercase font-bold text-red-700 dark:text-red-400 tracking-wider">
                {t.nearestStation}
              </p>
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 select-text">
                {pandal.nearestStation}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2.5 pt-2 border-t border-amber-200/40 dark:border-stone-700/40">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                  {t.address}
                </p>
                <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 select-text">
                  {pandal.address}
                </p>
              </div>
            </div>

            <button
              id="card-copy-address-btn"
              onClick={handleCopyAddress}
              type="button"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all cursor-pointer border ${
                addressCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 dark:border-stone-700'
              }`}
              title={addressCopied ? t.addressCopied : t.copyAddress}
              aria-label={addressCopied ? t.addressCopied : t.copyAddress}
            >
              {addressCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{t.addressCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-stone-500 dark:text-stone-400" />
                  <span>{t.copyAddress}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timings Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-orange-50/70 dark:bg-stone-800/80 border border-orange-200/60 dark:border-orange-900/30">
            <div className="flex items-center gap-1 text-orange-800 dark:text-orange-300 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.darshanTimings}</span>
            </div>
            <p className="text-xs font-medium text-stone-800 dark:text-stone-200 select-text">
              {pandal.darshanTimings}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-stone-800/80 border border-rose-200/60 dark:border-rose-900/30">
            <div className="flex items-center gap-1 text-rose-800 dark:text-rose-300 mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.aartiTimings}</span>
            </div>
            <p className="text-xs font-medium text-stone-800 dark:text-stone-200 select-text">
              {pandal.aartiTimings}
            </p>
          </div>
        </div>

        {/* View Full Details Button */}
        <button
          onClick={() => navigate(`/pandal/${pandal.id}`)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-100/70 dark:bg-orange-950/40 hover:bg-orange-200/70 dark:hover:bg-orange-900/50 border border-orange-300 dark:border-orange-800/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{t.viewFullDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Report a Problem shortcut */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 cursor-pointer"
          >
            <Flag className="w-3 h-3" />
            <span>{t.reportProblem}</span>
          </button>
        </div>
      </div>

      {/* Action Footer: Large Get Directions Button */}
      <div className="p-3.5 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:via-amber-700 hover:to-red-700 shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-all text-sm cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>{t.getDirections}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      {/* Report Problem Modal */}
      <ReportProblemModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        pandal={pandal}
      />
    </div>
  );
};
