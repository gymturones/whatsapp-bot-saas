// src/pages/dashboard/onboarding.tsx

import React from 'react'
import { useRouter } from 'next/router'

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mx-auto shadow-lg shadow-green-500/25">
          <img src="/logo-casco.svg" alt="BotPyme" className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold text-white">Bienvenido a BotPyme</h1>
        <p className="text-slate-400">
          Tu cuenta está lista. Para empezar, creá tu primer bot de WhatsApp con inteligencia artificial.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard/bots/new')}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
          >
            Crear mi primer bot
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors border border-slate-700"
          >
            Ir al dashboard
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-white text-sm font-medium">Creá tu bot</p>
            <p className="text-slate-500 text-xs mt-1">Configurá mensajes y respuestas automaticas</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl mb-2">🧠</div>
            <p className="text-white text-sm font-medium">Conectá IA</p>
            <p className="text-slate-500 text-xs mt-1">OpenAI responde lo que el bot no sabe</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-white text-sm font-medium">Automatizá</p>
            <p className="text-slate-500 text-xs mt-1">Tu bot atiende 24/7 por WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  )
}
