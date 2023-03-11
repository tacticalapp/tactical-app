import { AnimationControls } from "framer-motion";

export function shake(controls: AnimationControls, amplitude: number = 3.0, duration: number = 0.3, count: number = 4, decay: boolean = false) {
    let keyframes: number[] = [];
    keyframes.push(0);
    for (let i = 0; i < count; i++) {
        let sign = (i % 2 == 0) ? 1.0 : -1.0;
        let multiplier = decay ? (1.0 / (i + 1)) : 1.0;
        keyframes.push(amplitude * sign * multiplier);
    }
    keyframes.push(0);
    controls.start({
        x: keyframes,
        transition: {
            duration: duration,
        }
    })
}