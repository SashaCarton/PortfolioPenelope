<template>
  <section class="admin">
    <iframe 
      src="http://localhost:1337/admin" 
      title="Admin Interface"
      class="admin-iframe"
      frameborder="0">
    </iframe>
  </section>
</template>

<script setup>
// Pas de logique spécifique nécessaire pour cette vue
</script>

<style scoped>
.admin {
  text-align: center;
  padding: 2rem;
}

.admin h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.admin p {
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.admin-iframe {
  width: 100%;
  height: 80vh; /* Ajustez la hauteur selon vos besoins */
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>