<template>
  <div :class="['model-thumb', { selected } ]" @click="$emit('select', model)">
    <img :src="model.thumb" :alt="model.title" />
    <div class="meta">
      <h4>{{ model.title }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ model: { id: string; title: string; thumb: string; modelUrl: string }, selected?: boolean }>();
const selected = !!props.selected;
</script>

<style scoped>
.model-thumb {
  background: #0e0e0e;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(255,255,255,0.03);
}
.model-thumb:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
}
.model-thumb.selected {
  border: 1px solid #ffffff;
  background: linear-gradient(180deg, #111 0%, #0b0b0b 100%);
}
.model-thumb img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
}
.model-thumb .meta h4 {
  margin: 0;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
}
</style>