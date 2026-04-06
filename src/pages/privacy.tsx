import Head from 'next/head'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Política de Privacidad - BotPyme</title>
        <meta name="description" content="Política de privacidad de BotPyme." />
      </Head>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
            <p className="text-slate-400 text-sm">Última actualización: Abril 2026</p>
          </div>

          <div className="prose prose-invert prose-slate max-w-none space-y-6">
            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">1. Información que recopilamos</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Recopilamos la información que nos proporcionás al registrarte: nombre, email y número de teléfono.
                También recopilamos datos de uso de la plataforma y los mensajes procesados a través de los bots.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">2. Uso de la información</h2>
              <ul className="text-slate-300 text-sm leading-relaxed space-y-1">
                <li>Proveer y mejorar nuestros servicios de chatbot para WhatsApp</li>
                <li>Procesar pagos y gestionar suscripciones</li>
                <li>Comunicarnos con vos sobre tu cuenta</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">3. WhatsApp y Meta</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Nuestra plataforma utiliza la API de WhatsApp Business de Meta para enviar y recibir mensajes.
                Los mensajes procesados están sujetos a las políticas de privacidad de Meta.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">4. Compartición de datos</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario
                para proveer el servicio (procesadores de pago, proveedores de infraestructura) o cuando lo exija la ley.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">5. Seguridad</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
                contra acceso no autorizado, pérdida o divulgación.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">6. Tus derechos</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Tenés derecho a acceder, rectificar o eliminar tu información personal.
                Para ejercer estos derechos, contactanos en <strong className="text-white">gymturones@gmail.com</strong>.
              </p>
            </section>

            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">7. Contacto</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Si tenés preguntas sobre esta política, escribinos a <strong className="text-white">gymturones@gmail.com</strong>.
              </p>
            </section>
          </div>

          <div className="text-center pt-8">
            <a href="/" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
