
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_nft5ksc';
const TEMPLATE_ID = 'template_i7l4wad';
const PUBLIC_KEY = 'dXWqxJR0wcUfqxO7Y';

// Inicializar EmailJS con la clave pública
emailjs.init(PUBLIC_KEY);

export const sendWelcomeEmail = async (userData: { name: string; email: string }) => {
  try {
    console.log('Intentando enviar email a:', userData.email);
    
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      from_name: 'Baseball Stats Tracker',
      reply_to: 'noreply@baseballstats.com',
      message: `¡Bienvenido ${userData.name}! Tu cuenta ha sido creada exitosamente en Baseball Stats Tracker. Ahora puedes empezar a registrar tus estadísticas de béisbol y llevar un seguimiento completo de tu rendimiento.`
    };

    console.log('Parámetros del template:', templateParams);

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('Email enviado exitosamente:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error detallado enviando email:', error);
    return { success: false, error };
  }
};
