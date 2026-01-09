<template>
    <div class="w-full h-full bg-gray-700 flex flex-col">
        <iframe 
            :src="filePath" 
            class="w-full h-full border-none"
        ></iframe>
    </div>
</template>

<script setup>
defineProps(['filePath'])
</script>