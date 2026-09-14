import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function registerGreenFlowGsap() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
  registered = true
}

export { gsap, ScrollTrigger, MotionPathPlugin }
