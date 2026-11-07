import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Flag, X } from 'lucide-react';
import type { Pandal, PandalReport } from '../../types/pandal';
import { pandalService } from '../../services/pandalService';
import { useI18n } from '../../context/I18nContext';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  pandal: Pandal;
}

export const ReportProblemModal: React.FC<ReportProblemModalProps> = ({
  isOpen,
  onClose,
  pandal,
}) => {
  const { t } = useI18n();
  const [issueType, setIssueType] = useState<PandalReport['issueType']>('wrong_timings');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await pandalService.submitReport({
        pandalId: pandal.id,
        pandalName: pandal.name,
        pandalArea: pandal.area,
        issueType,
        description,
        reporterName,
        reporterContact,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch {
      setErrorMsg('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="report-problem-modal"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t.close || 'Close'}
          title={t.close || 'Close'}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              {t.reportSubmitted}
            </h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shrink-0">
                <Flag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {t.reportProblemTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  {pandal.name} ({pandal.area})
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Issue Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                {t.reportIssueType}
              </label>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  { value: 'wrong_timings', label: t.issueWrongTimings },
                  { value: 'wrong_location', label: t.issueWrongLocation },
                  { value: 'crowd_inaccurate', label: t.issueCrowdInaccurate },
                  { value: 'closed', label: t.issueClosed },
                  { value: 'other', label: t.issueOther },
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      issueType === item.value
                        ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="issueType"
                      value={item.value}
                      checked={issueType === item.value}
                      onChange={() => setIssueType(item.value as PandalReport['issueType'])}
                      className="accent-orange-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-1">
              <label htmlFor="report-desc" className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                {t.reportDetails}
              </label>
              <textarea
                id="report-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.reportDetailsPlaceholder}
                className="w-full p-2.5 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Reporter Contact (Optional) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="reporter-name" className="block text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  {t.reporterNameOptional}
                </label>
                <input
                  id="reporter-name"
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Rahul S."
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="reporter-contact" className="block text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  {t.reporterContactOptional}
                </label>
                <input
                  id="reporter-contact"
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="contact@mandal.com"
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? t.submittingReport : t.submitReport}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

