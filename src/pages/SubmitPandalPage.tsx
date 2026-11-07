import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Info,
  Leaf,
  Sparkles,
  Train,
  Upload,
} from 'lucide-react';
import { LocationPickerMap } from '../components/Map/LocationPickerMap';
import { LanguageSwitcher } from '../components/Header/LanguageSwitcher';
import { useI18n } from '../context/I18nContext';
import { pandalService } from '../services/pandalService';
import type { CrowdLevel, PandalSubmission } from '../types/pandal';
import { MUMBAI_CENTER } from '../utils/geoUtils';

const COMMON_AREAS = [
  'Lalbaug',
  'Girgaon',
  'Chinchpokli',
  'Parel',
  'Andheri West',
  'Andheri East',
  'King\'s Circle / Sion',
  'Matunga',
  'Wadala',
  'Fort / South Mumbai',
  'Chembur / Tilak Nagar',
  'Vile Parle East',
  'Bandra West',
  'Dadar',
  'Other Area',
];

export const SubmitPandalPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, formatCrowdLevel } = useI18n();

  // Form states
  const [name, setName] = useState('');
  const [area, setArea] = useState('Lalbaug');
  const [customArea, setCustomArea] = useState('');
  const [address, setAddress] = useState('');
  const [nearestStation, setNearestStation] = useState('');
  const [darshanTimings, setDarshanTimings] = useState('6:00 AM - 11:00 PM');
  const [aartiTimings, setAartiTimings] = useState('8:00 AM, 8:00 PM');
  const [visarjanDate, setVisarjanDate] = useState('Anant Chaturdashi (Day 10)');
  const [description, setDescription] = useState('');
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [is24Hours, setIs24Hours] = useState(false);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('Medium');

  // Coordinates
  const [lat, setLat] = useState<number>(MUMBAI_CENTER[0]);
  const [lng, setLng] = useState<number>(MUMBAI_CENTER[1]);

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [useUrlInstead, setUseUrlInstead] = useState(false);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle Photo File selection
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

  // Validate form
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 3) {
      errs.name = t.errNameRequired;
    }

    const effectiveArea = area === 'Other Area' ? customArea.trim() : area.trim();
    if (!effectiveArea) {
      errs.area = t.errAreaRequired;
    }

    if (!address.trim() || address.trim().length < 5) {
      errs.address = t.errAddressRequired;
    }

    if (!nearestStation.trim() || nearestStation.trim().length < 2) {
      errs.nearestStation = t.errStationRequired;
    }

    if (!darshanTimings.trim()) {
      errs.darshanTimings = t.errDarshanTimingsRequired;
    }

    if (!aartiTimings.trim()) {
      errs.aartiTimings = t.errAartiTimingsRequired;
    }

    if (!useUrlInstead && !photoFile && !photoPreview) {
      errs.photo = t.errPhotoRequired;
    }

    if (useUrlInstead && (!photoUrlInput.trim() || !photoUrlInput.startsWith('http'))) {
      errs.photo = t.errPhotoUrlInvalid;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      let finalPhotoUrl = photoUrlInput.trim();

      if (!useUrlInstead && photoFile) {
        // Upload to Supabase Storage bucket 'pandal-photos'
        finalPhotoUrl = await pandalService.uploadPandalPhoto(photoFile);
      } else if (!finalPhotoUrl && photoPreview) {
        finalPhotoUrl = photoPreview;
      }

      const effectiveArea = area === 'Other Area' ? customArea.trim() : area.trim();

      const payload: PandalSubmission = {
        name: name.trim(),
        area: effectiveArea,
        lat,
        lng,
        address: address.trim(),
        description: description.trim() || `${name} in ${effectiveArea}`,
        photoUrl: finalPhotoUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        gallery: [finalPhotoUrl],
        darshanTimings: is24Hours ? '24 Hours' : darshanTimings.trim(),
        aartiTimings: aartiTimings.trim(),
        ecoFriendly,
        is24Hours,
        crowdLevel,
        nearestStation: nearestStation.trim(),
        visarjanDate: visarjanDate.trim(),
      };

      const result = await pandalService.submitPandal(payload);

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Failed to submit pandal. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during submission.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-36 overflow-y-visible">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-100 hover:text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToMap}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🕉️</span>
            <h1 className="font-extrabold text-base tracking-tight">{t.submitPandal}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {submitted ? (
          /* Success Screen */
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-emerald-300 dark:border-emerald-800 shadow-xl text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-400 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                {t.submissionSuccessTitle}
              </h2>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {t.submissionSuccessMsg.replace('{name}', name)}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              {t.submissionQueuedMsg}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-md hover:from-orange-500 hover:to-amber-500 transition-all cursor-pointer"
              >
                {t.returnToPandalMap}
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setAddress('');
                  setPhotoPreview('');
                  setPhotoFile(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-sm hover:bg-stone-200 transition-colors"
              >
                {t.submitAnotherPandal}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
              <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{t.addPandalHeading}</span>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {t.addPandalSubtitle}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="pandal-name" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.pandalNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="pandal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.pandalNamePlaceholder}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden transition-all focus:ring-2 focus:ring-orange-500 ${
                    errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300 dark:border-stone-700'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Area & Custom Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pandal-area" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t.areaLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="pandal-area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                  >
                    {COMMON_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a === 'Other Area' ? (t.specifyAreaLabel || a) : a}
                      </option>
                    ))}
                  </select>
                </div>

                {area === 'Other Area' ? (
                  <div>
                    <label htmlFor="custom-area" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {t.specifyAreaLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="custom-area"
                      type="text"
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      placeholder={t.specifyAreaPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="nearest-station" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {t.nearestStation} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Train className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        id="nearest-station"
                        type="text"
                        value={nearestStation}
                        onChange={(e) => setNearestStation(e.target.value)}
                        placeholder={t.nearestStationPlaceholder}
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500 ${
                          errors.nearestStation ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300 dark:border-stone-700'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Full Address */}
              <div>
                <label htmlFor="pandal-address" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.address} <span className="text-red-500">*</span>
                </label>
                <input
                  id="pandal-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.addressPlaceholder}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500 ${
                    errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300 dark:border-stone-700'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.address}</p>}
                {errors.address && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.address}</p>}
              </div>

              {/* Interactive Map Pin Dropper */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.pandalLocationOnMap} <span className="text-red-500">*</span>
                </label>
                <LocationPickerMap
                  lat={lat}
                  lng={lng}
                  onChange={(newLat, newLng) => {
                    setLat(newLat);
                    setLng(newLng);
                  }}
                />
              </div>

              {/* Timings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label htmlFor="darshan-timings" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t.darshanTimings} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      id="darshan-timings"
                      type="text"
                      value={darshanTimings}
                      onChange={(e) => setDarshanTimings(e.target.value)}
                      disabled={is24Hours}
                      placeholder={t.darshanTimingsPlaceholder}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="aarti-timings" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {t.aartiTimings} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="aarti-timings"
                    type="text"
                    value={aartiTimings}
                    onChange={(e) => setAartiTimings(e.target.value)}
                    placeholder={t.aartiTimingsPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Visarjan Date */}
              <div>
                <label htmlFor="visarjan-date" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.visarjanDateLabel}
                </label>
                <input
                  id="visarjan-date"
                  type="text"
                  value={visarjanDate}
                  onChange={(e) => setVisarjanDate(e.target.value)}
                  placeholder={t.visarjanDatePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Toggles & Crowd Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* 24 Hours Toggle */}
                <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={is24Hours}
                    onChange={(e) => setIs24Hours(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                  />
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">{t.twentyFourHours}</span>
                </label>

                {/* Eco-Friendly Toggle */}
                <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ecoFriendly}
                    onChange={(e) => setEcoFriendly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>{t.clayShaduIdol}</span>
                  </div>
                </label>

                {/* Crowd Level */}
                <div className="flex flex-col justify-center px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">{t.typicalRush}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {(['Low', 'Medium', 'High'] as CrowdLevel[]).map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setCrowdLevel(lvl)}
                        className={`flex-1 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          crowdLevel === lvl
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {formatCrowdLevel(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span>{t.pandalPhotoLabel} <span className="text-red-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseUrlInstead(!useUrlInstead)}
                    className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold underline cursor-pointer"
                  >
                    {useUrlInstead ? t.uploadFileInstead : t.provideImageLinkInstead}
                  </button>
                </div>

                {useUrlInstead ? (
                  <div>
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => {
                        setPhotoUrlInput(e.target.value);
                        setPhotoPreview(e.target.value);
                      }}
                      placeholder="https://example.com/pandal-image.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-4 hover:border-orange-500 transition-colors bg-stone-50/50 dark:bg-stone-800/30">
                    {photoPreview ? (
                      <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden shadow">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        <label
                          htmlFor="photo-file"
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-opacity"
                        >
                          Change Photo
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="photo-file" className="cursor-pointer text-center space-y-2 p-2">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-stone-800 text-orange-600 mx-auto flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                            {t.clickToUploadPhoto}
                          </p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">
                            {t.imageSizeLimit}
                          </p>
                        </div>
                      </label>
                    )}
                    <input
                      id="photo-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
                {errors.photo && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.photo}</p>}
              </div>

              {/* Description / Story */}
              <div>
                <label htmlFor="pandal-desc" className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.historyFeaturesOptional}
                </label>
                <textarea
                  id="pandal-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.historyFeaturesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-4 pb-6">
                <button
                  id="submit-pandal-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-base tracking-wide shadow-xl shadow-orange-600/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.submittingForReview}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.submitForVerification}</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-stone-500 dark:text-stone-400 mt-2">
                  {t.submissionVerificationNote}
                </p>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmitPandalPage;
