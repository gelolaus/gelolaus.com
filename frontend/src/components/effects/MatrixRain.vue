<script setup>
    import { onMounted, onUnmounted, ref } from 'vue'
    
    const canvasRef = ref(null)
    let intervalId = null
    
    // Start the Matrix rain animation
    const startMatrix = () => {
        const canvas = canvasRef.value
        if (!canvas) return
    
        const ctx = canvas.getContext('2d')
        
        // Make canvas fill the screen
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    
        // Characters that can appear
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%"
        const fontSize = 14
        const columns = canvas.width / fontSize
        
        // Track each column's position
        const drops = []
        for(let x = 0; x < columns; x++) drops[x] = 1
    
        // Draw one frame of animation
        const draw = () => {
            // Add semi-transparent black (creates trail effect)
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // Draw green text
            ctx.fillStyle = "#0F0"
            ctx.font = fontSize + "px arial"
    
            // Draw a character in each column
            for(let i = 0; i < drops.length; i++) {
                // Pick random character
                const text = letters.charAt(Math.floor(Math.random() * letters.length))
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)
    
                // Reset drop to top if it went off screen
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
    
                // Move drop down
                drops[i]++
            }
        }
    
        // Run animation at 30fps
        intervalId = setInterval(draw, 33)
    }
    
    // Update canvas size when window resizes
    const handleResize = () => {
        if (canvasRef.value) {
            canvasRef.value.width = window.innerWidth
            canvasRef.value.height = window.innerHeight
        }
    }
    
    // Start animation when component loads
    onMounted(() => {
        startMatrix()
        window.addEventListener('resize', handleResize)
    })
    
    // Clean up when component is destroyed
    onUnmounted(() => {
        clearInterval(intervalId)
        window.removeEventListener('resize', handleResize)
    })
</script>
    
<template>
    <canvas 
        ref="canvasRef" 
        class="fixed inset-0 z-0 pointer-events-none opacity-20"
    ></canvas>
</template>