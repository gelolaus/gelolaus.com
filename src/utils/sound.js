// Load sound effects
const clickAudio = new Audio('/assets/sounds/click.mp3')
const keyAudio = new Audio('/assets/sounds/keypress.wav')

// Set volumes
clickAudio.volume = 0.4
keyAudio.volume = 0.2

// Play a click sound
export const playClick = () => {
    // Clone the audio so multiple clicks can play at once
    const sound = clickAudio.cloneNode()
    sound.volume = 0.4
    sound.play().catch(() => {}) // Catch errors if sound fails
}

// Play a keyboard typing sound
export const playKey = () => {
    const sound = keyAudio.cloneNode()
    sound.volume = 0.2
    sound.play().catch(() => {})
}
