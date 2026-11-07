import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Leaf, MapPin, Navigation, Train, Users } from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import { getGoogleMapsDirectionsUrl, formatDistance } from '../../utils/geoUtils';
import { useI18n } from '../../context/I18nContext';
import { EmptyState } from '../EmptyState/EmptyState';

interface PandalListViewProps {
  pandals: Pandal[];
  onSelectPandal: (pandal: Pandal) => void;
  selectedPandal: Pandal | null;
  distancesMap?: Map<string, number>;
  onClearFilters?: () => void;
  searchQuery?: string;
}

export const PandalListView: React.FC<PandalListViewProps> = ({
  pandals,
  onSelectPandal,
  selectedPandal,
  distancesMap,
  onClearFilters,
  searchQuery,
}) => {
  const navigate = useNavigate();
  const { t, locale } = useI18n();

  if (pandals.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <EmptyState
          onClearFilters={onClearFilters || (() => {})}
          searchQuery={searchQuery}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
      {pandals.map((pandal) => {
        const isSelected = selectedPandal?.id === pandal.id;
        const directionsUrl = getGoogleMapsDirectionsUrl(pandal.lat, pandal.lng, pandal.name);
        const distanceKm = distancesMap?.get(pandal.id);

        return (
          <div
            key={pandal.id}
            onClick={() => onSelectPandal(pandal)}
            className={`group cursor-pointer flex flex-col bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
              isSelected
                ? 'border-orange-500 ring-2 ring-orange-400/40 shadow-lg'
                : 'border-stone-200/80 dark:border-stone-800 shadow-md'
            }`}
          >
            {/* Card Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-stone-800">
              <img
                src={pandal.photoUrl}
                alt={pandal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Area Badge */}
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1 border border-white/20">
                <MapPin className="w-3 h-3 text-amber-400" />
                {pandal.area}
              </span>

              {/* Badges on right */}
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                {distanceKm !== undefined && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white flex items-center gap-1 shadow-md">
                    <Navigation className="w-2.5 h-2.5 rotate-45" />
                    {formatDistance(distanceKm, locale)}
                  </span>
                )}
                {pandal.ecoFriendly && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                    <Leaf className="w-2.5 h-2.5" />
                    {t.ecoFriendly}
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="font-extrabold text-base leading-tight drop-shadow truncate text-amber-100">
                  {pandal.name}
                </h3>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                {/* Station */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <Train className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="font-medium truncate">{pandal.nearestStation}</span>
                </div>

                {/* 24-hours or timing snippet */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{pandal.darshanTimings}</span>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {pandal.description}
                </p>
              </div>

              {/* Bottom Info & Action */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                    pandal.crowdLevel === 'High'
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                      : pandal.crowdLevel === 'Medium'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  {pandal.crowdLevel === 'High'
                    ? t.crowdHigh
                    : pandal.crowdLevel === 'Medium'
                    ? t.crowdMedium
                    : t.crowdLow}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pandal/${pandal.id}`);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700"
                  >
                    <span>{t.details}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-orange-50 dark:bg-stone-800 text-orange-600 hover:bg-orange-100 transition-colors"
                    title={t.getDirections}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
