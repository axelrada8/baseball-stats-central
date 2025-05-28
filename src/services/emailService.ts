
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_nft5ksc';
const TEMPLATE_ID = 'template_i7l4wad';
const PUBLIC_KEY = 'dXWqxJR0wcUfqxO7Y';

// Inicializar EmailJS con la clave pública
console.log('Inicializando EmailJS con clave pública:', PUBLIC_KEY);
emailjs.init(PUBLIC_KEY);

export const sendWelcomeEmail = async (userData: { name: string; email: string }) => {
  try {
    console.log('=== INICIO ENVÍO EMAIL ===');
    console.log('Datos del usuario:', userData);
    console.log('Service ID:', SERVICE_ID);
    console.log('Template ID:', TEMPLATE_ID);
    console.log('Public Key:', PUBLIC_KEY);
    
    // Verificar que EmailJS esté disponible
    if (!emailjs) {
      console.error('EmailJS no está disponible');
      return { success: false, error: 'EmailJS not available' };
    }
    
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      from_name: 'Baseball Stats Tracker',
      reply_to: 'noreply@baseballstats.com',
      message: `¡Bienvenido ${userData.name}! Tu cuenta ha sido creada exitosamente en Baseball Stats Tracker. Ahora puedes empezar a registrar tus estadísticas de béisbol y llevar un seguimiento completo de tu rendimiento.`
    };

    console.log('Parámetros del template que se enviarán:', templateParams);
    console.log('Llamando a emailjs.send...');

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('=== RESULTADO EXITOSO ===');
    console.log('Respuesta completa de EmailJS:', result);
    console.log('Status:', result.status);
    console.log('Text:', result.text);
    
    return { success: true, result };
  } catch (error) {
    console.error('=== ERROR DETALLADO ===');
    console.error('Tipo de error:', typeof error);
    console.error('Error completo:', error);
    
    if (error instanceof Error) {
      console.error('Mensaje del error:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
    // Verificar si es un error de EmailJS específico
    if (error && typeof error === 'object' && 'status' in error) {
      console.error('Status del error:', (error as any).status);
      console.error('Text del error:', (error as any).text);
    }
    
    return { success: false, error };
  }
};
