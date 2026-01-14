import { ref, onMounted, onUnmounted, computed } from 'vue'

// Composable for detecting screen size (mobile, tablet, or desktop)
export function useBreakpoints() {
    // Track the window size
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    // Figure out what device size we're on
    const isMobile = computed(() => width.value < 768)
    const isTablet = computed(() => width.value >= 768 && width.value < 1024)
    const isDesktop = computed(() => width.value >= 1024)

    // Update sizes when window is resized
    const update = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    // Start listening for resize events when component mounts
    onMounted(() => {
        window.addEventListener('resize', update)
    })

    // Stop listening when component unmounts (cleanup)
    onUnmounted(() => {
        window.removeEventListener('resize', update)
    })

    // Return everything components might need
    return { 
        width, 
        height, 
        isMobile,
        isTablet,
        isDesktop
    }
}
