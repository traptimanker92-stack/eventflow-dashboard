import React from 'react';
import { useEventContext } from '../context/EventContext';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = () => {
  const { confirmDialog, closeConfirmModal } = useEventContext();

  if (!confirmDialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-6 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeConfirmModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{confirmDialog.title}</h3>
            <p className="text-xs text-gray-400">Please confirm your action</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          {confirmDialog.message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-800/80">
          <button
            type="button"
            onClick={closeConfirmModal}
            className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/60 hover:bg-gray-800 text-sm font-medium text-gray-300 transition-all hover:border-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDialog.onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
              confirmDialog.isDanger
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {confirmDialog.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
