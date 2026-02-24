<template>
    <!-- Simple image viewer that centers the image -->
    <div class="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
        <img 
            :src="filePath" 
            class="max-w-full max-h-full object-contain" 
            alt="Preview"
        />
    </div>
</template>

<script setup>
// Get the image file path from the parent component
defineProps(['filePath'])
</script>