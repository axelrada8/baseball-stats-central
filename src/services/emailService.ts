
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_nft5ksc';
const TEMPLATE_ID = 'template_i7l4wad';
const PUBLIC_KEY = 'dXWqxJR0wcUfqxO7Y';

export const sendWelcomeEmail = async (userData: { name: string; email: string }) => {
  try {
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      from_name: 'Baseball Stats Tracker',
      message: `¡Bienvenido ${userData.name}! Tu cuenta ha sido creada exitosamente. Ahora puedes empezar a registrar tus estadísticas de béisbol.`
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email enviado exitosamente:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error };
  }
};
