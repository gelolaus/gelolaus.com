const clickAudio = new Audio('/assets/sounds/click.mp3')
const keyAudio = new Audio('/assets/sounds/keypress.wav')

clickAudio.volume = 0.4
keyAudio.volume = 0.2

export const playClick = () => {
    const sound = clickAudio.cloneNode()
    sound.volume = 0.4
    sound.play().catch(() => {})
}

export const playKey = () => {
    const sound = keyAudio.cloneNode()
    sound.volume = 0.2
    sound.play().catch(() => {})
}