<script setup>
import { ref } from 'vue';
import { useToast } from '#imports';
import { useRouter } from 'vue-router';

// Desactiva el layout para esta página
definePageMeta({
  layout: false
});

const name = ref('');
const email = ref('');
const password = ref('');
const passwordFieldType = ref('password');

const toast = useToast();
const router = useRouter();

// Función para mostrar/ocultar la contraseña
const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

// Lógica de registro (simulada)
const register = () => {
  if (email.value === '') {
    toast.add({
      title: 'Error',
      description: 'Por favor, ingresa un correo electrónico.',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      color: 'red'
    });
    return;
  }

  // Aquí iría la lógica para enviar los datos al backend
  // Por ahora, solo mostramos un mensaje de éxito simulado
  console.log('Datos de registro:', {
    name: name.value,
    email: email.value,
    password: password.value
  });

  toast.add({
    title: '¡Registro exitoso!',
    description: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
    icon: 'i-heroicons-check-circle-20-solid',
    color: 'green'
  });

  // Redirige al usuario a la página de login después de un registro exitoso
  router.push('/login');
};
</script>


<template>
  <div class="register-page-wrapper">
    <div class="register-container">
      <div class="background-section">
        <div class="overlay">
          <h1>MECASAAS.</h1>
          <p>
            ¡Bienvenido! Únete a nuestra plataforma y empieza a gestionar tu taller
            mecánico de manera eficiente. Controla tu negocio desde un solo lugar.
          </p>
          <div class="by-logo-container">
            <p class="by-text">By</p>
            <a href="http://grtecnologiahn.com/" target="_blank"><img src="/images/Orange-White.png" alt="By GrTecnologia" class="company-logo" /></a>
          </div>
        </div>
      </div>
      <div class="form-section">
        <h2>Crear Cuenta</h2>
        <form @submit.prevent="register">
          <div class="input-group">
            <label for="name">Nombre Completo</label>
            <input type="text" id="name" v-model="name" required />
          </div>
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
          <button type="submit" class="submit-button">Registrarse</button>
        </form>
        <p class="login-link">
          ¿Ya tienes una cuenta?
          <NuxtLink to="/login">Inicia Sesión</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>



<style scoped>
/* Estilos duplicados y adaptados del login para mantener la consistencia */
.register-page-wrapper {
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

.register-container {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #000;
  text-decoration: none;
}

.login-link:hover a {
  color: #f36b23;
  transition: 0.3s;
  text-decoration: none;
}

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
</style>s