import Typewriter from 'typewriter-effect/dist/core'

console.log("Hello")

let tw = new Typewriter(".catchpraise", {
    strings: [
        "Plan, Organize, and Cheer.",
        "Plan immediately.",
        "Organize your projects.",
        "Cheer to your friends with powerful emojis."
    ],
    autoStart: true,
    loop: true,
    delay: 100,
})