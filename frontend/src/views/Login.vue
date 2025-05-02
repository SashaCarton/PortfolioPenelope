<template>
  <section class="login">
    <h1>Connexion Administrateur</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();

async function handleLogin() {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    if (!response.ok) throw new Error('Identifiants invalides');

    const data = await response.json();
    localStorage.setItem('adminToken', data.token); // Stocke le token dans le localStorage
    router.push('/admin'); // Redirige vers la page d'administration
  } catch (err) {
    error.value = 'Identifiants invalides';
  }
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background: #6a4b8a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #563d6e;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>