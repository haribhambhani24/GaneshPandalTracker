// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useState } from 'react';
import { Crosshair, MapPin, Navigation, Search, Train, X } from 'lucide-react';
import type { Coordinates } from '../../services/routing';
import type { Pandal } from '../../types/pandal';
import { useI18n } from '../../context/I18nContext';

interface StartPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGps: () => void;
  onSelectMapTap: () => void;
  onSelectCoordinates: (coords: Coordinates, name: string) => void;
  pandals: Pandal[];
}

const MAJOR_STATIONS: { name: string; area: string; coords: Coordinates }[] = [
  { name: 'Dadar Station (Central & Western)', area: 'Dadar', coords: { lat: 19.0183, lng: 72.8434 } },
  { name: 'CSMT Station (Terminus)', area: 'Fort', coords: { lat: 18.9401, lng: 72.8354 } },
  { name: 'Churchgate Station', area: 'Churchgate', coords: { lat: 18.9322, lng: 72.8264 } },
  { name: 'Chinchpokli / Currey Road', area: 'Lalbaug', coords: { lat: 18.9902, lng: 72.8335 } },
  { name: 'Byculla Station', area: 'Byculla', coords: { lat: 18.9774, lng: 72.8332 } },
  { name: 'Andheri Station & Metro', area: 'Andheri', coords: { lat: 19.1197, lng: 72.8468 } },
  { name: 'Ghatkopar Station & Metro', area: 'Ghatkopar', coords: { lat: 19.0864, lng: 72.9082 } },
  { name: 'King’s Circle / Sion Station', area: 'Sion', coords: { lat: 19.0305, lng: 72.8596 } },
  { name: 'Grant Road / Charni Road', area: 'Girgaon', coords: { lat: 18.9567, lng: 72.8189 } },
];

export const StartPointModal: React.FC<StartPointModalProps> = ({
  isOpen,
  onClose,
  onSelectGps,
  onSelectMapTap,
  onSelectCoordinates,
  pandals,
}) => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredStations = MAJOR_STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPandals = pandals
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nearestStation.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 6);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.chooseStartPoint}
      className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[85vh] text-stone-900 dark:text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-base leading-tight">
              {t.chooseStartPoint}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, area or pandal..."
              className="w-full pl-9 pr-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Options */}
        <div className="p-3 border-b border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectGps();
            }}
            className="p-3 rounded-2xl bg-emerald-50 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-stone-750 border border-emerald-200 dark:border-stone-700 text-left transition-all cursor-pointer flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.useCurrentLocation}</span>
            </div>
            <span className="text-[10px] text-stone-500">Live GPS sensor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectMapTap();
            }}
            className="p-3 rounded-2xl bg-orange-50 dark:bg-stone-800 hover:bg-orange-100 dark:hover:bg-stone-750 border border-orange-200 dark:border-stone-700 text-left transition-all cursor-pointer flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold text-xs">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{t.tapMapToSetStart}</span>
            </div>
            <span className="text-[10px] text-stone-500">Pick any point on map</span>
          </button>
        </div>

        {/* List of Major Stations / Pandals */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Station Hubs */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Popular Railway & Metro Hubs
            </p>
            {filteredStations.map((station, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectCoordinates(station.coords, station.name);
                  onClose();
                }}
                className="w-full p-2 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-750 text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0">
                    <Train className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100 truncate">
                      {station.name}
                    </p>
                    <p className="text-[10px] text-stone-400">{station.area}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
                  Select
                </span>
              </button>
            ))}
          </div>

          {/* Pandals as origin */}
          {filteredPandals.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
                From Another Pandal
              </p>
              {filteredPandals.map((pandal) => (
                <button
                  key={pandal.id}
                  type="button"
                  onClick={() => {
                    onSelectCoordinates({ lat: pandal.lat, lng: pandal.lng }, pandal.name);
                    onClose();
                  }}
                  className="w-full p-2 rounded-xl text-left hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-stone-750 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-stone-900 dark:text-stone-100 truncate">
                        {pandal.name}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">{pandal.area}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 shrink-0 ml-2">
                    Select
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

