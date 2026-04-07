import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/logo-casco.svg" />
        <meta name="description" content="BotPyme - Chatbots de WhatsApp con IA para pymes" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
