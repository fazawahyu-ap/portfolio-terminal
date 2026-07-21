"use client";

interface AlertDialogProps {
  onAcknowledge: () => void;
}

export default function AlertDialog({ onAcknowledge }: AlertDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="system-notice-title"
    >
      <div className="animate-dialog-in w-full max-w-sm rounded-2xl bg-[#2c2c2e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-5 text-center">
          {/* Warning glyph, styled like a macOS system icon */}
          <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center shadow-inner">
            <span className="text-2xl">⌨️</span>
          </div>
          <h2
            id="system-notice-title"
            className="text-white text-[15px] font-semibold mb-2"
          >
            System Notice
          </h2>
          <p className="text-white/80 text-[13px] leading-relaxed">
            System Notice: For the best interactive experience, please access
            this terminal using a desktop, laptop, or tablet device equipped
            with a physical keyboard.
          </p>
        </div>
        <div className="border-t border-white/10">
          <button
            onClick={onAcknowledge}
            className="w-full py-3 text-[15px] font-medium text-[#0a84ff] hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
