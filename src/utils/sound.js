import { useWindowStore } from '@/stores/windowManager'

// Load sound effects
const clickAudio = new Audio('/assets/sounds/click.mp3')
const keyAudio = new Audio('/assets/sounds/keypress.wav')

// Set volumes
clickAudio.volume = 0.4
keyAudio.volume = 0.2

// Play a click sound
export const playClick = () => {
    // Access the store to check settings
    // We do this inside the function to ensure Pinia is ready
    const store = useWindowStore()

    // If sound is disabled in settings, stop here
    if (!store.soundEnabled) return

    // Clone the audio so multiple clicks can play at once
    const sound = clickAudio.cloneNode()
    sound.volume = 0.4
    sound.play().catch(() => {}) // Catch errors if sound fails
}

// Play a keyboard typing sound
export const playKey = () => {
    const store = useWindowStore()

    if (!store.soundEnabled) return

    const sound = keyAudio.cloneNode()
    sound.volume = 0.2
    sound.play().catch(() => {})
}