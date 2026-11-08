// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Locate,
  Sparkles,
  Train,
  Upload,
} from 'lucide-react';
import { LocationPickerMap } from '../components/Map/LocationPickerMap';
import { LanguageSwitcher } from '../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../components/Header/ThemeToggle';
import { useI18n } from '../context/I18nContext';
import { pandalService } from '../services/pandalService';
import type { CrowdLevel, PandalSubmission } from '../types/pandal';
import { MUMBAI_CENTER } from '../utils/geoUtils';
import { Footer } from '../components/Footer/Footer';

const DRAFT_STORAGE_KEY = 'ganesh_pandal_submit_draft';

const COMMON_AREAS = [
  'Lalbaug',
  'Girgaon',
  'Chinchpokli',
  'Parel',
  'Andheri West',
  'Andheri East',
  "King's Circle / Sion",
  'Matunga',
  'Wadala',
  'Fort / South Mumbai',
  'Chembur / Tilak Nagar',
  'Vile Parle East',
  'Bandra West',
  'Dadar',
  'Other Area',
];

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const SubmitPandalPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, formatCrowdLevel } = useI18n();

  const initialDraft = React.useMemo(() => loadDraft(), []);

  // Multi-step state: 1 (Basics), 2 (Location & Timings), 3 (Photo & Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [draftRestored, setDraftRestored] = useState<boolean>(Boolean(initialDraft));

  // Form states initialized directly from draft if available
  const [name, setName] = useState(initialDraft?.name || '');
  const [area, setArea] = useState(initialDraft?.area || 'Lalbaug');
  const [customArea, setCustomArea] = useState(initialDraft?.customArea || '');
  const [address, setAddress] = useState(initialDraft?.address || '');
  const [nearestStation, setNearestStation] = useState(initialDraft?.nearestStation || '');
  const [darshanTimings, setDarshanTimings] = useState(initialDraft?.darshanTimings || '6:00 AM - 11:00 PM');
  const [aartiTimings, setAartiTimings] = useState(initialDraft?.aartiTimings || '8:00 AM, 8:00 PM');
  const [visarjanDate, setVisarjanDate] = useState(initialDraft?.visarjanDate || 'Anant Chaturdashi (Day 10)');
  const [description, setDescription] = useState(initialDraft?.description || '');
  const [ecoFriendly, setEcoFriendly] = useState(Boolean(initialDraft?.ecoFriendly));
  const [is24Hours, setIs24Hours] = useState(Boolean(initialDraft?.is24Hours));
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>(initialDraft?.crowdLevel || 'Medium');

  // Coordinates
  const [lat, setLat] = useState<number>(initialDraft?.lat || MUMBAI_CENTER[0]);
  const [lng, setLng] = useState<number>(initialDraft?.lng || MUMBAI_CENTER[1]);
  const [gpsLocating, setGpsLocating] = useState<boolean>(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoUrlInput, setPhotoUrlInput] = useState<string>(initialDraft?.photoUrlInput || '');
  const [useUrlInstead, setUseUrlInstead] = useState<boolean>(Boolean(initialDraft?.photoUrlInput));

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Auto-save draft on changes
  useEffect(() => {
    if (submitted) return;
    try {
      const draft = {
        name,
        area,
        customArea,
        address,
        nearestStation,
        darshanTimings,
        aartiTimings,
        visarjanDate,
        description,
        ecoFriendly,
        is24Hours,
        crowdLevel,
        lat,
        lng,
        photoUrlInput,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // quota or blocked
    }
  }, [
    name,
    area,
    customArea,
    address,
    nearestStation,
    darshanTimings,
    aartiTimings,
    visarjanDate,
    description,
    ecoFriendly,
    is24Hours,
    crowdLevel,
    lat,
    lng,
    photoUrlInput,
    submitted,
  ]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setName('');
    setArea('Lalbaug');
    setCustomArea('');
    setAddress('');
    setNearestStation('');
    setDescription('');
    setPhotoUrlInput('');
    setPhotoFile(null);
    setPhotoPreview('');
    setDraftRestored(false);
  };

  // GPS Pinning
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsNotice('Geolocation not supported by your browser');
      return;
    }
    setGpsLocating(true);
    setGpsNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGpsLocating(false);
        setGpsNotice(t.pinLocationSelected);
        setTimeout(() => setGpsNotice(null), 3000);
      },
      () => {
        setGpsLocating(false);
        setGpsNotice('Could not detect location. Please tap on the map.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Photo File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(t.errImageFormat);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg(t.errImageTooLarge);
      return;
    }

    setErrorMsg(null);
    setPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = t.errNameRequired;
    const effectiveArea = area === 'Other Area' ? customArea.trim() : area.trim();
    if (!effectiveArea) errs.area = t.errAreaRequired;
    if (!address.trim() || address.trim().length < 5) errs.address = t.errAddressRequired;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!nearestStation.trim() || nearestStation.trim().length < 2) errs.nearestStation = t.errStationRequired;
    if (!darshanTimings.trim()) errs.darshanTimings = t.errDarshanTimingsRequired;
    if (!aartiTimings.trim()) errs.aartiTimings = t.errAartiTimingsRequired;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!useUrlInstead && !photoFile && !photoPreview) errs.photo = t.errPhotoRequired;
    if (useUrlInstead && (!photoUrlInput.trim() || !photoUrlInput.startsWith('http'))) {
      errs.photo = t.errPhotoUrlInvalid;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      let finalPhotoUrl = photoUrlInput.trim();

      if (!useUrlInstead && photoFile) {
        finalPhotoUrl = await pandalService.uploadPandalPhoto(photoFile);
      }

      if (!finalPhotoUrl) {
        finalPhotoUrl =
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
      }

      const effectiveArea = area === 'Other Area' ? customArea.trim() : area.trim();

      const newSubmission: PandalSubmission = {
        name: name.trim(),
        area: effectiveArea,
        lat,
        lng,
        address: address.trim(),
        description: description.trim() || `${name} in ${effectiveArea}, Mumbai.`,
        photoUrl: finalPhotoUrl,
        darshanTimings: darshanTimings.trim(),
        aartiTimings: aartiTimings.trim(),
        ecoFriendly,
        crowdLevel,
        nearestStation: nearestStation.trim(),
        visarjanDate: visarjanDate.trim(),
        is24Hours,
      };

      await pandalService.submitPandal(newSubmission);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit pandal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100vh] min-h-[100dvh] bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans pb-20">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-[1000] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs pt-safe">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-orange-600" />
          <span>{t.backToMap}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="nav" />
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Header Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            {t.addPandalHeading}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            {t.addPandalSubtitle}
          </p>
        </div>

        {/* Draft Restored Banner */}
        {draftRestored && !submitted && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600" />
              {t.draftRestoredNotice}
            </span>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-amber-800 dark:text-amber-300 font-bold hover:underline cursor-pointer ml-2"
            >
              {t.clearDraft}
            </button>
          </div>
        )}

        {submitted ? (
          /* Submission Success State */
          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              {t.submissionSuccessTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
              {t.submissionSuccessMsg}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {t.returnToTracker}
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  handleClearDraft();
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs transition-all cursor-pointer"
              >
                {t.submitAnotherPandal}
              </button>
            </div>
          </div>
        ) : (
          /* 3-Step Progressive Submission Form */
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-200 dark:border-stone-800 space-y-6">
            {/* Step Progress Pills */}
            <div className="grid grid-cols-3 gap-2 pb-4 border-b border-stone-100 dark:border-stone-800 text-center">
              {[
                { step: 1, label: t.step1Title },
                { step: 2, label: t.step2Title },
                { step: 3, label: t.step3Title },
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => {
                    if (s.step < currentStep) setCurrentStep(s.step as 1 | 2 | 3);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                    currentStep === s.step
                      ? 'bg-orange-600 text-white shadow-xs'
                      : currentStep > s.step
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 cursor-pointer'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                  }`}
                >
                  <span className="truncate block">{s.label}</span>
                </div>
              ))}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Pandal Name */}
                <div>
                  <label htmlFor="pandal-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.pandalNameLabel} *
                  </label>
                  <input
                    id="pandal-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.pandalNamePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Area Selector */}
                <div>
                  <label htmlFor="area-select-field" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.areaLabel} *
                  </label>
                  <select
                    id="area-select-field"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {COMMON_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {area === 'Other Area' && (
                  <div>
                    <label htmlFor="custom-area-field" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      {t.specifyAreaLabel} *
                    </label>
                    <input
                      id="custom-area-field"
                      type="text"
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      placeholder={t.specifyAreaPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm"
                    />
                    {errors.area && <p className="text-red-600 text-xs mt-1">{errors.area}</p>}
                  </div>
                )}

                {/* Street Address */}
                <div>
                  <label htmlFor="pandal-address" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.address} *
                  </label>
                  <textarea
                    id="pandal-address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.addressPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* Description & History */}
                <div>
                  <label htmlFor="pandal-description" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.historyFeaturesOptional}
                  </label>
                  <textarea
                    id="pandal-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.historyFeaturesPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Location & Timings */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Map Location Picker with "Use My GPS" Button */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      {t.pandalLocationOnMap} *
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={gpsLocating}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 hover:bg-orange-200 cursor-pointer transition-colors"
                    >
                      <Locate className={`w-3.5 h-3.5 ${gpsLocating ? 'animate-spin' : ''}`} />
                      <span>{gpsLocating ? t.detectingLocation : t.useCurrentGps}</span>
                    </button>
                  </div>

                  {gpsNotice && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      {gpsNotice}
                    </p>
                  )}

                  <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-inner">
                    <LocationPickerMap
                      lat={lat}
                      lng={lng}
                      onChange={(newLat, newLng) => {
                        setLat(newLat);
                        setLng(newLng);
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                    {t.tapMapOrDragPin}
                  </p>
                </div>

                {/* Nearest Station */}
                <div>
                  <label htmlFor="nearest-station-field" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.nearestStation} *
                  </label>
                  <div className="relative">
                    <Train className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="nearest-station-field"
                      type="text"
                      value={nearestStation}
                      onChange={(e) => setNearestStation(e.target.value)}
                      placeholder={t.nearestStationPlaceholder}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm"
                    />
                  </div>
                  {errors.nearestStation && (
                    <p className="text-red-600 text-xs mt-1">{errors.nearestStation}</p>
                  )}
                </div>

                {/* Timings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="darshan-timings-field" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      {t.darshanTimings} *
                    </label>
                    <input
                      id="darshan-timings-field"
                      type="text"
                      value={darshanTimings}
                      onChange={(e) => setDarshanTimings(e.target.value)}
                      placeholder={t.darshanTimingsPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm"
                    />
                    {errors.darshanTimings && (
                      <p className="text-red-600 text-xs mt-1">{errors.darshanTimings}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="aarti-timings-field" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      {t.aartiTimings} *
                    </label>
                    <input
                      id="aarti-timings-field"
                      type="text"
                      value={aartiTimings}
                      onChange={(e) => setAartiTimings(e.target.value)}
                      placeholder={t.aartiTimingsPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm"
                    />
                    {errors.aartiTimings && (
                      <p className="text-red-600 text-xs mt-1">{errors.aartiTimings}</p>
                    )}
                  </div>
                </div>

                {/* Visarjan Date */}
                <div>
                  <label htmlFor="visarjan-date-field" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.visarjanDateLabel}
                  </label>
                  <input
                    id="visarjan-date-field"
                    type="text"
                    value={visarjanDate}
                    onChange={(e) => setVisarjanDate(e.target.value)}
                    placeholder={t.visarjanDatePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Photo & Review */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Toggles: Eco-Friendly & 24 Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecoFriendly}
                      onChange={(e) => setEcoFriendly(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-stone-800 dark:text-stone-200">{t.ecoFriendlyBadge}</span>
                      <span className="text-stone-500 dark:text-stone-400">{t.clayShaduIdol}</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={is24Hours}
                      onChange={(e) => setIs24Hours(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-stone-800 dark:text-stone-200">{t.twentyFourHoursBadge}</span>
                      <span className="text-stone-500 dark:text-stone-400">Open non-stop</span>
                    </div>
                  </label>
                </div>

                {/* Crowd Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    {t.typicalRush}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Medium', 'High'] as CrowdLevel[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCrowdLevel(c)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          crowdLevel === c
                            ? c === 'High'
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : c === 'Medium'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {formatCrowdLevel(c)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload / URL */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      {t.pandalPhotoLabel} *
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseUrlInstead((prev) => !prev)}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                    >
                      {useUrlInstead ? t.uploadFileInstead : t.provideImageLinkInstead}
                    </button>
                  </div>

                  {useUrlInstead ? (
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="https://example.com/pandal.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm"
                    />
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-orange-500 rounded-2xl cursor-pointer bg-stone-50 dark:bg-stone-800/50 transition-colors">
                        <Upload className="w-8 h-8 text-stone-400 mb-2" />
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-200">
                          {photoFile ? photoFile.name : t.clickToUploadPhoto}
                        </span>
                        <span className="text-[11px] text-stone-400 mt-1">{t.imageSizeLimit}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {photoPreview && (
                        <div className="mt-3 relative w-full h-36 rounded-2xl overflow-hidden border">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                  {errors.photo && <p className="text-red-600 text-xs mt-1">{errors.photo}</p>}
                </div>

                {/* Review Summary Card */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-2 text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400 block">
                    Review Summary
                  </span>
                  <p><strong>Name:</strong> {name || '—'}</p>
                  <p><strong>Area:</strong> {area === 'Other Area' ? customArea : area}</p>
                  <p><strong>Station:</strong> {nearestStation || '—'}</p>
                  <p><strong>Timings:</strong> {darshanTimings}</p>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                >
                  {t.prevStep}
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.nextStep}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? t.submittingForReview : t.submitForVerification}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SubmitPandalPage;
