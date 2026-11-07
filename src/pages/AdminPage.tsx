import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Clock,
  Edit2,
  ExternalLink,
  Eye,
  KeyRound,
  Leaf,
  Lock,
  LogOut,
  MapPin,
  RefreshCw,
  Shield,
  Train,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { pandalService } from '../services/pandalService';
import { useI18n } from '../context/I18nContext';
import { LanguageSwitcher } from '../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../components/Header/ThemeToggle';
import type { CrowdLevel, Pandal, PandalStatus } from '../types/pandal';

interface AdminSessionUser {
  email?: string;
}

interface AdminSession {
  user?: AdminSessionUser;
}

export const AdminPage: React.FC = () => {
  const { t, formatStatus, formatCrowdLevel, formatNumber } = useI18n();

  // Auth states
  const [session, setSession] = useState<AdminSession | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Moderation states
  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<PandalStatus>('pending');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // Edit Modal state
  const [editingPandal, setEditingPandal] = useState<Pandal | null>(null);
  const [editForm, setEditForm] = useState<Partial<Pandal>>({});
  const [editSaving, setEditSaving] = useState<boolean>(false);

  // Fetch admin pandals
  const fetchAdminPandals = React.useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await pandalService.getAdminPandals();
      setPandals(data);
    } catch (err) {
      console.error('Failed to load admin pandals:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // 1. Check Auth Session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setAuthChecking(false);
      if (currentSession) {
        fetchAdminPandals();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        fetchAdminPandals();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAdminPandals]);

  // 3. Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setLoginLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setSession(data.session);
        fetchAdminPandals();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setAuthError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // 4. Handle Admin Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setPandals([]);
  };

  // 5. Update Status (Approve or Reject)
  const handleStatusChange = async (id: string, newStatus: PandalStatus) => {
    setActionInProgressId(id);
    try {
      await pandalService.updatePandalStatus(id, newStatus);
      setPandals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert(`Status update failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setActionInProgressId(null);
    }
  };

  // 6. Delete Pandal
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    setActionInProgressId(id);
    try {
      await pandalService.deletePandal(id);
      setPandals((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setActionInProgressId(null);
    }
  };

  // 7. Save Edited Pandal
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPandal) return;

    setEditSaving(true);
    try {
      await pandalService.updatePandal(editingPandal.id, editForm);
      setPandals((prev) =>
        prev.map((p) =>
          p.id === editingPandal.id ? ({ ...p, ...editForm } as Pandal) : p
        )
      );
      setEditingPandal(null);
    } catch (err) {
      alert(`Save failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setEditSaving(false);
    }
  };

  // Counts
  const pendingList = pandals.filter((p) => p.status === 'pending');
  const approvedList = pandals.filter((p) => p.status === 'approved');
  const rejectedList = pandals.filter((p) => p.status === 'rejected');

  const currentList =
    activeTab === 'pending'
      ? pendingList
      : activeTab === 'approved'
      ? approvedList
      : rejectedList;

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] min-h-[100dvh] bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-safe pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 dark:from-stone-900 dark:via-orange-950 dark:to-red-950 text-white border-b border-amber-500/20 dark:border-orange-900/50 shadow-md pt-safe">
        <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              title={t.backToMap}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-amber-400" />
              <h1 className="font-extrabold text-base tracking-tight text-white">
                {t.adminPortalTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <ThemeToggle variant="header" />

            {session && (
              <>
                <span className="hidden sm:inline-block text-xs font-mono text-stone-300 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700">
                  {session?.user?.email || 'admin'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs shadow transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        {!session ? (
          /* ==============================================================
             AUTH LOGIN SCREEN
             ============================================================== */
          <div className="max-w-md mx-auto my-12 bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 text-white mx-auto flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
                {t.adminAuthHeading}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t.adminAuthSubtitle}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                {authError}
              </div>
            )}

            {!isSupabaseConfigured && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                {t.supabaseLocalFallbackNote}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.adminEmailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  {t.adminPasswordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-sm bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loginLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{t.logInAsAdmin}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ==============================================================
             AUTHENTICATED ADMIN DASHBOARD
             ============================================================== */
          <div className="space-y-6">
            {/* Moderation Tabs & Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {/* Pending Tab */}
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-amber-500 text-white shadow'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  <span>{t.pendingSubmissions}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">
                    {formatNumber(pendingList.length)}
                  </span>
                </button>

                {/* Approved Tab */}
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  <span>{t.approvedLivePandals}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">
                    {formatNumber(approvedList.length)}
                  </span>
                </button>

                {/* Rejected Tab */}
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'rejected'
                      ? 'bg-red-600 text-white shadow'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  <span>{t.rejected}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20 text-white">
                    {formatNumber(rejectedList.length)}
                  </span>
                </button>
              </div>

              <button
                onClick={fetchAdminPandals}
                disabled={loadingData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                <span>{t.refresh}</span>
              </button>
            </div>

            {/* List of pandals in active tab */}
            {currentList.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
                <div className="text-3xl">🕉️</div>
                <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                  {activeTab === 'pending'
                    ? t.noPendingPandals
                    : activeTab === 'approved'
                    ? t.noApprovedPandals
                    : t.noRejectedPandals}
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentList.map((pandal) => {
                  const googleMapsUrl = `https://www.google.com/maps?q=${pandal.lat},${pandal.lng}`;
                  const isProcessing = actionInProgressId === pandal.id;

                  return (
                    <div
                      key={pandal.id}
                      className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Image + Quick Info Header */}
                        <div className="relative h-44 bg-stone-800">
                          <img
                            src={pandal.photoUrl}
                            alt={pandal.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Status Badge */}
                          <span
                            className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow ${
                              pandal.status === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : pandal.status === 'pending'
                                ? 'bg-amber-500 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {formatStatus(pandal.status)}
                          </span>

                          {/* External link to Google Maps */}
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1 border border-white/20 hover:bg-black"
                            title={t.verifyGps}
                          >
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>{t.verifyGps}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <div className="absolute bottom-2.5 left-3 right-3 text-white">
                            <h3 className="font-extrabold text-base leading-tight truncate text-amber-100">
                              {pandal.name}
                            </h3>
                            <p className="text-xs text-stone-200 truncate">{pandal.area}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2.5 text-xs text-stone-700 dark:text-stone-300">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{pandal.address}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                              <Train className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span className="truncate">{pandal.nearestStation}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{pandal.darshanTimings}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {pandal.ecoFriendly && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                                <Leaf className="w-2.5 h-2.5" /> {t.ecoFriendly}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              <Users className="w-2.5 h-2.5" /> {formatCrowdLevel(pandal.crowdLevel)}
                            </span>
                            <span className="font-mono text-[10px] text-stone-500">
                              [{pandal.lat.toFixed(4)}, {pandal.lng.toFixed(4)}]
                            </span>
                          </div>

                          {pandal.description && (
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 pt-1">
                              {pandal.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Moderation Action Buttons Footer */}
                      <div className="p-3 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {pandal.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(pandal.id, 'approved')}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{t.approve}</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setEditingPandal(pandal);
                              setEditForm({
                                name: pandal.name,
                                area: pandal.area,
                                address: pandal.address,
                                lat: pandal.lat,
                                lng: pandal.lng,
                                nearestStation: pandal.nearestStation,
                                darshanTimings: pandal.darshanTimings,
                                aartiTimings: pandal.aartiTimings,
                                crowdLevel: pandal.crowdLevel,
                                ecoFriendly: pandal.ecoFriendly,
                                is24Hours: pandal.is24Hours,
                                description: pandal.description,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-semibold text-xs cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>{t.edit}</span>
                          </button>

                          {pandal.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(pandal.id, 'rejected')}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 font-semibold text-xs cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>{t.reject}</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {pandal.status === 'approved' && (
                            <Link
                              to={`/pandal/${pandal.id}`}
                              className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 hover:bg-orange-200"
                              title={t.viewFullDetails}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          <button
                            onClick={() => handleDelete(pandal.id, pandal.name)}
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-600 hover:text-red-600 transition-colors"
                            title={t.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================================================================
          EDIT PANDAL MODAL
          ================================================================== */}
      {editingPandal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                {t.editPandalDetails}
              </h3>
              <button
                onClick={() => setEditingPandal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="edit-pandal-name" className="block font-bold mb-1">{t.pandalNameLabel}</label>
                <input
                  id="edit-pandal-name"
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="edit-area" className="block font-bold mb-1">{t.areaLabel}</label>
                  <input
                    id="edit-area"
                    type="text"
                    value={editForm.area || ''}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label htmlFor="edit-nearest-station" className="block font-bold mb-1">{t.nearestStation}</label>
                  <input
                    id="edit-nearest-station"
                    type="text"
                    value={editForm.nearestStation || ''}
                    onChange={(e) => setEditForm({ ...editForm, nearestStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-address" className="block font-bold mb-1">{t.address}</label>
                <input
                  id="edit-address"
                  type="text"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="edit-lat" className="block font-bold mb-1">Latitude</label>
                  <input
                    id="edit-lat"
                    type="number"
                    step="0.000001"
                    value={editForm.lat ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, lat: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label htmlFor="edit-lng" className="block font-bold mb-1">Longitude</label>
                  <input
                    id="edit-lng"
                    type="number"
                    step="0.000001"
                    value={editForm.lng ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, lng: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="edit-darshan-timings" className="block font-bold mb-1">{t.darshanTimings}</label>
                  <input
                    id="edit-darshan-timings"
                    type="text"
                    value={editForm.darshanTimings || ''}
                    onChange={(e) => setEditForm({ ...editForm, darshanTimings: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label htmlFor="edit-crowd-level" className="block font-bold mb-1">{t.crowdLevel}</label>
                  <select
                    id="edit-crowd-level"
                    aria-label={t.crowdLevel}
                    value={editForm.crowdLevel || 'Medium'}
                    onChange={(e) => setEditForm({ ...editForm, crowdLevel: e.target.value as CrowdLevel })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Low" className="bg-white dark:bg-stone-800 text-stone-900 dark:text-white">{t.crowdLow}</option>
                    <option value="Medium" className="bg-white dark:bg-stone-800 text-stone-900 dark:text-white">{t.crowdMedium}</option>
                    <option value="High" className="bg-white dark:bg-stone-800 text-stone-900 dark:text-white">{t.crowdHigh}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.ecoFriendly || false}
                    onChange={(e) => setEditForm({ ...editForm, ecoFriendly: e.target.checked })}
                  />
                  <span>{t.ecoFriendly}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is24Hours || false}
                    onChange={(e) => setEditForm({ ...editForm, is24Hours: e.target.checked })}
                  />
                  <span>{t.twentyFourHours}</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPandal(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
                >
                  {editSaving ? '...' : t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
