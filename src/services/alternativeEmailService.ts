
export const sendWelcomeEmailAlternative = (userData: { name: string; email: string }) => {
  const subject = encodeURIComponent('¡Bienvenido a Baseball Stats Tracker!');
  const body = encodeURIComponent(
    `¡Hola ${userData.name}!\n\n` +
    `¡Bienvenido a Baseball Stats Tracker!\n\n` +
    `Tu cuenta ha sido creada exitosamente. Ahora puedes empezar a registrar tus estadísticas de béisbol y llevar un seguimiento completo de tu rendimiento.\n\n` +
    `¡Que tengas un gran día!\n\n` +
    `El equipo de Baseball Stats Tracker`
  );
  
  const mailtoUrl = `mailto:${userData.email}?subject=${subject}&body=${body}`;
  
  try {
    window.open(mailtoUrl, '_blank');
    return { success: true, method: 'mailto' };
  } catch (error) {
    console.error('Error opening mailto:', error);
    return { success: false, error };
  }
};
