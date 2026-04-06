import Head from 'next/head'

export default function Terminos() {
  return (
    <>
      <Head>
        <title>Términos y Condiciones - BotPyme</title>
        <meta name="description" content="Términos y condiciones de uso de BotPyme." />
      </Head>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Términos y Condiciones</h1>
            <p className="text-slate-400 text-sm">Última actualización: Abril 2026</p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: '1. Aceptación de los términos',
                body: 'Al registrarte y usar BotPyme, aceptás estos términos y condiciones. Si no estás de acuerdo, no uses el servicio.'
              },
              {
                title: '2. Descripción del servicio',
                body: 'BotPyme es una plataforma SaaS que permite a empresas automatizar respuestas en WhatsApp mediante inteligencia artificial, utilizando la API oficial de WhatsApp Business de Meta.'
              },
              {
                title: '3. Registro y cuenta',
                body: 'Para usar BotPyme debés crear una cuenta con información verídica. Sos responsable de mantener la confidencialidad de tus credenciales y de todas las actividades realizadas bajo tu cuenta.'
              },
              {
                title: '4. Planes y pagos',
                body: 'Los planes de suscripción se cobran mensualmente a través de MercadoPago. Los precios están expresados en pesos argentinos (ARS) e incluyen IVA. Nos reservamos el derecho de modificar los precios con previo aviso de 30 días.'
              },
              {
                title: '5. Prueba gratuita',
                body: 'Los planes pagos incluyen 7 días de prueba gratuita. Al finalizar el período de prueba, se cobrará el plan seleccionado salvo que canceles antes.'
              },
              {
                title: '6. Cancelación',
                body: 'Podés cancelar tu suscripción en cualquier momento desde tu panel. Al cancelar, mantenés el acceso hasta el final del período ya pagado. No realizamos reembolsos por períodos parciales.'
              },
              {
                title: '7. Uso aceptable',
                list: [
                  'Enviar spam o mensajes no solicitados',
                  'Actividades ilegales o que violen las políticas de Meta/WhatsApp',
                  'Acosar, intimidar o dañar a terceros',
                  'Revender el servicio sin autorización expresa',
                ]
              },
              {
                title: '8. Responsabilidad',
                body: 'BotPyme no se responsabiliza por el contenido de las conversaciones generadas por la IA, ni por interrupciones causadas por terceros. El servicio se provee "tal como está" con un objetivo de uptime del 99%.'
              },
              {
                title: '9. Propiedad intelectual',
                body: 'El software, diseño e interfaces de BotPyme son propiedad de GymTurones. Vos retenés la propiedad de los datos de conversaciones de tus clientes.'
              },
              {
                title: '10. Modificaciones',
                body: 'Nos reservamos el derecho de modificar estos términos. Te notificaremos por email ante cambios significativos.'
              },
              {
                title: '11. Ley aplicable',
                body: 'Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se someterá a los tribunales de la Ciudad Autónoma de Buenos Aires.'
              },
              {
                title: '12. Contacto',
                body: 'Consultas: gymturones@gmail.com'
              },
            ].map((section) => (
              <section key={section.title} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
                {section.body && (
                  <p className="text-slate-300 text-sm leading-relaxed">{section.body}</p>
                )}
                {section.list && (
                  <ul className="text-slate-300 text-sm leading-relaxed space-y-1">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5 shrink-0">-</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
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
