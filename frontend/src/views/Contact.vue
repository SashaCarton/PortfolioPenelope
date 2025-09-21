<!-- src/components/Contact.vue -->
<template>
  <section class="contact">
    <h1>Contact</h1>
    <p>Vous avez une question, une opportunité ou simplement envie de dire bonjour ?</p>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nom</label>
        <input
        v-model="form.name"
        type="text"
        id="name"
        aria-label="Nom"
        required
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input
        v-model="form.email"
        type="email"
        id="email"
        aria-label="Email"
        required
        />
      </div>
      
      <div class="form-group">
        <label for="message">Message</label>
        <textarea
        v-model="form.message"
        id="message"
        rows="5"
        aria-label="Message"
        required
        ></textarea>
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? "Envoi..." : "Envoyer" }}
      </button>
      
      <p v-if="success" class="success-message">
        Merci pour votre message ! Je vous répondrai bientôt.
      </p>
      <p v-if="error" class="error-message">
        {{ errorMessage }}
      </p>
    </form>
  </section>
  <div class="social-links">
    <a href="https://www.linkedin.com/in/penelopeletienne/" target="_blank" rel="noopener" aria-label="LinkedIn">
      <img src="/assets/linkedin.svg" alt="LinkedIn" />
    </a>
    <a href="https://github.com/Penny0507" target="_blank" rel="noopener" aria-label="GitHub">
      <img src="/assets/github.svg" alt="GitHub" />
    </a>
    <a href="https://www.instagram.com/penny_things/" target="_blank" rel="noopener" aria-label="Instagram">
      <img src="/assets/insta.png" alt="Insta" />
    </a>
    <a href="mailto:penelope.letienne@ensaama.net" target="_blank" rel="noopener" aria-label="Email">
      <img src="/assets/email.svg" alt="Email" />
    </a>
  </div>
</template>

<style scoped>
/* ...existing styles... */

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.social-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, transform 0.2s;
  border: 1px solid #e0e0e0;
}

.social-links a:hover {
  background: #e0e0e0;
  transform: translateY(-4px) scale(1.08);
}

.social-links img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: grayscale(0.2) brightness(0.95);
  transition: filter 0.2s;
}

.social-links a:hover img {
  filter: grayscale(0) brightness(1.1);
}

@media (max-width: 480px) {
  .social-links {
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  .social-links a {
    width: 38px;
    height: 38px;
  }
  .social-links img {
    width: 20px;
    height: 20px;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({
  name: '',
  email: '',
  message: '',
});

const loading = ref(false);
const success = ref(false);
const error = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    error.value = true;
    errorMessage.value = 'Tous les champs sont requis.';
    console.error(errorMessage.value);
    return;
  }
  
  loading.value = true;
  success.value = false;
  error.value = false;
  errorMessage.value = '';
  
  try {
    const response = await fetch('https://api.penelopeletienne.ovh/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          Nom: form.value.name,
          Email: form.value.email,
          Message: form.value.message,
        },
      }),
      
    });
    
    if (!response.ok) {
      const details = await response.json();
      console.error('Détails de l’erreur :', details);
      throw new Error(
      `Erreur ${response.status}: ${details.error?.message || response.statusText}`
      );
    }
    
    const result = await response.json();
    console.log('Envoi réussi:', result);
    success.value = true;
    form.value = { name: '', email: '', message: '' };
  } catch (err) {
    error.value = true;
    errorMessage.value = err.message;
    console.error('Erreur lors de l’envoi:', err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

.contact {
  animation: fadeIn 0.8s ease-in-out;
  padding: 1px 32px;
  max-width: 600px;
  width: 70%;
  margin: auto;
  color: #333;
  text-align: center;
  font-family: 'Inter', sans-serif;
  border-radius: 12px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  margin-bottom: 2rem;
  margin-top: 90px;
}

.contact h1 {
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  color: #2f2f2f;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
}

form {
  padding: 2rem;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #000;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}

button {
  background: #000;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.3s;
  font-family: 'Inter', sans-serif;
  border: 1px solid #f2eee9;
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #fff;
  color: #000;
  transition: all 0.3s ease;
  border: 1px solid #000;
}

.success-message {
  margin-top: 1rem;
  color: green;
  font-size: 1rem;
}

.error-message {
  margin-top: 1rem;
  color: red;
  font-size: 1rem;
}

@media (max-width: 480px) {
  .contact {
    padding: 1rem;
    width: 80%;
  }

  .contact h1 {
    font-size: 1.8rem;
  }

  .contact p {
    font-size: 0.9rem;
  }

  form {
    padding: 1rem;
  }

  input, textarea {
    font-size: 0.9rem;
    padding: 0.5rem;
    width: 90%;
  }

  button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .success-message, .error-message {
    font-size: 0.9rem;
  }
}
</style>
