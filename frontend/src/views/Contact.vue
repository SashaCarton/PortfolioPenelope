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
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    name: '',
    email: '',
    message: '',
  })
  
  const loading = ref(false)
  const success = ref(false)
  const error = ref(false)
  const errorMessage = ref('')
  
  const handleSubmit = async () => {
    if (!form.value.name || !form.value.email || !form.value.message) {
      error.value = true
      errorMessage.value = 'Tous les champs sont requis.'
      console.error(errorMessage.value)
      return
    }
  
    loading.value = true
    success.value = false
    error.value = false
    errorMessage.value = ''
  
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',                // bien POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
  
      if (!response.ok) {
        const details = await response.json()
        throw new Error(
          `Erreur ${response.status}: ${details.error || response.statusText}`
        )
      }
  
      const result = await response.json()
      console.log('Envoi réussi:', result)
      success.value = true
      form.value = { name: '', email: '', message: '' }
    } catch (err) {
      error.value = true
      errorMessage.value = err.message
      console.error('Erreur lors de l’envoi:', err.message)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact {
    animation: fadeIn 0.8s ease-in-out;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    color: #6a4b8a;
    text-align: center;
  }
  
  .contact h1 { margin-bottom: 0.5rem; }
  .contact p { margin-bottom: 2rem; }
  
  form {
    background: #fafafa;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }
  
  .form-group { margin-bottom: 1.5rem; text-align: left; }
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #6a4b8a;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  button {
    background: #6a4b8a;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.3s;
  }
  
  button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
  
  .success-message { margin-top: 1rem; color: green; }
  .error-message   { margin-top: 1rem; color: red; }
  </style>
