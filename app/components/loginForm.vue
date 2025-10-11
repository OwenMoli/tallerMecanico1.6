<template>
  <div class="login-page-wrapper">
    <div class="login-container">
      <div class="background-section">
        <div class="overlay">
          <h1>MECASAAS.</h1>
          <p>
            La solución integral para la gestión de talleres mecánicos.
            Accede a tu panel para supervisar tus operaciones con precisión
            y tomar decisiones informadas.
          </p>
          <div class="by-logo-container">
            <p class="by-text">By</p>
            <a href="http://grtecnologiahn.com/" target="_blank"><img src="/images/Orange-White.png" alt="By GrTecnologia" class="company-logo"  /></a>
          </div>
        </div>
      </div>
      <div class="form-section">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="input-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="input-group password-container">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input :type="passwordFieldType" id="password" v-model="password" required />
              <span class="toggle-password" @click="togglePasswordVisibility">
                <U-Icon :name="passwordFieldType === 'password' ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'" />
              </span>
            </div>
          </div>
          <button type="submit" class="submit-button">Enviar</button>
          <p class="forgot-password">
            <a href="/LogComp/recuperarContrasena">¿Olvidaste tu contraseña?</a>
          </p>
        </form>
        <p class="signup-link">¿No tienes cuenta? <a href="/LogComp/register">Regístrate</a></p>
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

// Esto es lo que deshabilita el layout y oculta el menú.
definePageMeta({
  layout: false
});

const email = ref('');
const password = ref('');
const passwordFieldType = ref('password');

const toast = useToast();
const router = useRouter();

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const login = () => {
  if (email.value !== 'oowen9999@gmail.com' || password.value !== '12345') {
    toast.add({
      title: 'Error de credenciales',
      description: 'El correo electrónico o la contraseña son incorrectos.',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      color: 'red',
      position: 'bottom-left',
      timeout: 5000
    });
    return;
  }

  toast.add({
    title: '¡Login exitoso!',
    description: `Bienvenido, ${email.value}.`,
    icon: 'i-heroicons-check-circle-20-solid',
    color: 'green',
    position: 'bottom-left',
    timeout: 5000
  });

  router.push('/');
};
</script>

<style scoped>
/* Contenedor del campo de contraseña y el ícono */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* El ícono se alinea con el campo de texto */
.password-input-wrapper input {
  flex-grow: 1;
  padding-right: 30px;
}

/* Posiciona el ícono dentro del wrapper */
.toggle-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #999;
}

.toggle-password:hover {
  color: #333;
}

/* Estilos para la imagen del logo */
.company-logo {
  width: 150px;
  height: auto;
}

/* Estilos para el enlace de "Olvidaste tu contraseña?" */
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

/* Contenedor para "By" y el logo */
.by-logo-container {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

/* Espacio entre "By" y la imagen */
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