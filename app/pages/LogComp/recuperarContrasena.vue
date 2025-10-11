<template>
  <div class="login-page-wrapper">
    <div class="login-container">
      <div class="background-section">
        <div class="overlay">
          <h1>MECASAAS.</h1>
          <p>
            Recupera tu acceso de manera segura. Ingresa tu correo electrónico y te enviaremos
            instrucciones para restablecer tu contraseña.
          </p>
          <div class="by-logo-container">
            <p class="by-text">By</p>
            <a href="http://grtecnologiahn.com/" target="_blank"><img src="/images/Orange-White.png" alt="By GrTecnologia" class="company-logo" /></a>
          </div>
        </div>
      </div>
      <div class="form-section">
        <h2>Recuperar Contraseña</h2>
        <form @submit.prevent="handleForgotPassword">
          <div class="input-group">
            <label for="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              :class="{ 'input-error': emailError }" 
            />
            <div v-if="emailError" class="validation-message">
              {{ emailError }}
            </div>
          </div>
          <button type="submit" class="submit-button">Enviar</button>
          <p class="forgot-password">
            <NuxtLink to="/login">Volver al login</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from '#imports';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: false
});

const email = ref('');
const emailError = ref('');
const toast = useToast();
const router = useRouter();

const handleForgotPassword = () => {
  // Simple validación de correo electrónico
  if (!email.value) {
    emailError.value = 'El correo electrónico es requerido.';
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'El formato del correo electrónico no es válido.';
    return;
  }
  
  // Limpia cualquier error previo si la validación es exitosa
  emailError.value = '';

  // Simulación de una llamada a una API exitosa
  toast.add({
    title: 'Solicitud enviada',
    description: 'Se han enviado las instrucciones a tu correo electrónico.',
    icon: 'i-heroicons-check-circle-20-solid',
    color: 'green',
    position: 'bottom-left',
    timeout: 5000
  });

  // Redirecciona al usuario después de un breve retraso
  setTimeout(() => {
    router.push('/LogComp/login');
  }, 3000); 
};
</script>

<style scoped>
/* Estilos adicionales para el mensaje de validación */
.input-error {
  border-bottom-color: #dc3545 !important;
}

.validation-message {
  color: #dc3545; /* Color rojo de error */
  font-size: 0.85rem;
  margin-top: 5px;
}
/* Tu código CSS ya tiene la mayoría de los estilos necesarios. 
   Aquí solo se han añadido los estilos para el error. */

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.password-input-wrapper input {
  flex-grow: 1;
  padding-right: 30px;
}
.toggle-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #999;
}
.toggle-password:hover {
  color: #333;
}
.company-logo {
  width: 150px;
  height: auto;
}
.forgot-password {
  text-align: center;
  margin-top: 10px;
}
.forgot-password a {
  color: #000;
  text-decoration: none;
  font-size: 0.9rem;
}
.forgot-password a:hover {
  color: #f36b23;
  text-decoration: underline;
}
.by-logo-container {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}
.by-text {
  margin-right: 10px;
  color: #fff;
  font-size: 1rem;
}
.login-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://images.pexels.com/photos/4488650/pexels-photo-4488650.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
}
.login-container {
  display: flex;
  width: 900px;
  max-width: 95%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 500px;
}
.background-section {
  flex: 1;
  background-image: url('URL_DE_LA_IMAGEN_DE_FONDO_DEL_LADO_IZQUIERDO');
  background-size: cover;
  background-position: center;
  position: relative;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 40px;
}
.background-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right,
              rgba(255, 255, 255, 0.1),
              rgba(0, 0, 0, 0.5));
  z-index: 1;
}
.overlay {
  z-index: 2;
}
.background-section h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #fff;
}
.social-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.social-button {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  color: #fff;
  cursor: pointer;
}
.social-button.facebook {
  background-color: #3b5998;
}
.social-button.twitter {
  background-color: #1da1f2;
}
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background-color: #fff;
}
.form-section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}
.input-group {
  margin-bottom: 15px;
}
.input-group label {
  display: block;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  font-size: 0.8rem;
}
.input-group input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  transition: border-bottom-color 0.3s;
}
.input-group input:focus {
  border-bottom-color: #f36b23;
}
.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #f36b23;
}
.signup-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
.signup-link a {
  color: #000;
  text-decoration: none;
}
.signup-link:hover a {
  color: #f36b23;
  transition: 0.3s;
  text-decoration: none;
}
</style>