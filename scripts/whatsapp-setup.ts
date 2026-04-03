/**
 * Script de configuración del WhatsApp Business API
 * Ejecutar: npx ts-node scripts/whatsapp-setup.ts
 */

import * as crypto from 'crypto';
import * as https from 'https';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

// Generar verify token único y seguro
const VERIFY_TOKEN = crypto.randomBytes(32).toString('hex');

function checkEnvVars() {
  const required = [
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_BUSINESS_ACCOUNT_ID',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ Faltan variables de entorno:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nAgregá estas variables a tu .env.local y Vercel antes de continuar.\n');
    process.exit(1);
  }
}

async function verifyPhoneNumber(): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v18.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=display_phone_number,verified_name,quality_rating&access_token=${WHATSAPP_ACCESS_TOKEN}`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            console.error('\n❌ Error verificando número:', json.error.message);
            reject(new Error(json.error.message));
            return;
          }
          console.log('\n✅ Número de WhatsApp verificado:');
          console.log(`   Número: ${json.display_phone_number}`);
          console.log(`   Nombre: ${json.verified_name}`);
          console.log(`   Calidad: ${json.quality_rating}`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('\n========================================');
  console.log('   WhatsApp Business API - Setup Tool   ');
  console.log('========================================\n');

  // 1. Verificar variables
  console.log('🔍 Verificando variables de entorno...');
  checkEnvVars();
  console.log('✅ Variables de entorno OK\n');

  // 2. Verificar conexión con Meta
  console.log('🔍 Verificando conexión con Meta API...');
  await verifyPhoneNumber();

  // 3. Mostrar instrucciones del webhook
  const webhookUrl = `${APP_URL}/api/webhooks/whatsapp`;

  console.log('\n========================================');
  console.log('   CONFIGURACIÓN DEL WEBHOOK EN META    ');
  console.log('========================================\n');
  console.log('Seguí estos pasos en https://developers.facebook.com:\n');
  console.log('1. Entrá a tu App → WhatsApp → Configuración');
  console.log('2. En "Webhooks", hacé clic en "Editar"\n');
  console.log('📋 DATOS PARA COPIAR:');
  console.log('─────────────────────────────────────────');
  console.log(`Webhook URL:    ${webhookUrl}`);
  console.log(`Verify Token:   ${VERIFY_TOKEN}`);
  console.log('─────────────────────────────────────────\n');
  console.log('3. Guardá esos valores en Meta Developers');
  console.log('4. Suscribite a estos eventos:');
  console.log('   ✓ messages');
  console.log('   ✓ message_deliveries');
  console.log('   ✓ message_reads\n');

  // 4. Guardar verify token en .env.local
  console.log('⚠️  IMPORTANTE: Agregá esta línea a tu .env.local Y a Vercel:');
  console.log(`\n   WHATSAPP_VERIFY_TOKEN=${VERIFY_TOKEN}\n`);
  console.log('   → En Vercel: npx vercel env add WHATSAPP_VERIFY_TOKEN production');
  console.log(`   → Valor: ${VERIFY_TOKEN}\n`);

  console.log('========================================');
  console.log('   Setup completado. Seguí los pasos    ');
  console.log('========================================\n');
}

main().catch(err => {
  console.error('\n❌ Error inesperado:', err.message);
  process.exit(1);
});
