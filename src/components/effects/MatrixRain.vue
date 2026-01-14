<script setup>
    import { onMounted, onUnmounted, ref } from 'vue'
    
    const canvasRef = ref(null)
    let intervalId = null
    
    const startMatrix = () => {
        const canvas = canvasRef.value
        if (!canvas) return
    
        const ctx = canvas.getContext('2d')
        
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%"
        const fontSize = 14
        const columns = canvas.width / fontSize
        
        const drops = []
        for(let x = 0; x < columns; x++) drops[x] = 1
    
        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            ctx.fillStyle = "#0F0"
            ctx.font = fontSize + "px arial"
    
            for(let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length))
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)
    
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
    
                drops[i]++
            }
        }
    
        intervalId = setInterval(draw, 33)
    }
    
    const handleResize = () => {
        if (canvasRef.value) {
            canvasRef.value.width = window.innerWidth
            canvasRef.value.height = window.innerHeight
        }
    }
    
    onMounted(() => {
        startMatrix()
        window.addEventListener('resize', handleResize)
    })
    
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