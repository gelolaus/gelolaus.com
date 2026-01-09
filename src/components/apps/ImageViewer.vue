<template>
    <div class="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
        <img 
            :src="filePath" 
            class="max-w-full max-h-full object-contain" 
            alt="Preview"
        />
    </div>
</template>

<script setup>
defineProps(['filePath'])
</script>