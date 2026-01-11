import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useBreakpoints() {
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    // Derived state
    const isMobile = computed(() => width.value < 768)
    const isTablet = computed(() => width.value >= 768 && width.value < 1024)
    const isDesktop = computed(() => width.value >= 1024)

    const update = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    onMounted(() => {
        window.addEventListener('resize', update)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', update)
    })

    return { 
        width, 
        height, 
        isMobile,
        isTablet,
        isDesktop
    }
}