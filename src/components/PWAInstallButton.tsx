import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { Download, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider rounded-xl transition-colors mb-2 text-sm shadow-[0_0_15px_rgba(251,191,36,0.2)]"
      >
        <Download size={18} strokeWidth={2.5} />
        Instalar App
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase tracking-wider rounded-xl transition-colors mb-2 border border-zinc-700 text-sm"
        >
          <Download size={18} strokeWidth={2.5} />
          Instalar no iPhone
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4" onClick={() => setShowIOSGuide(false)}>
            <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                 <h3 className="text-xl font-black uppercase text-zinc-100 tracking-tight">Instalar ZikaBoard</h3>
                 <p className="mt-2 text-sm text-zinc-400 font-medium">No iPhone e iPad, siga os passos abaixo:</p>
              </div>
              <div className="space-y-4 text-sm font-medium text-zinc-300 bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50">
                <p className="flex items-start gap-3">
                  <span className="bg-amber-500 text-zinc-950 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</span>
                  <span>Toque no botão <strong>Compartilhar</strong> na barra do Safari (ícone de quadrado com seta para cima).</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="bg-amber-500 text-zinc-950 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</span>
                  <span>Role a lista e toque em <strong>Adicionar à Tela de Início</strong>.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-zinc-800 py-3 text-sm font-bold uppercase tracking-wider text-zinc-100 hover:bg-zinc-700 transition-colors"
              >
                Entendi, Manda Bala
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
