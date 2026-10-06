import React, { useEffect, useRef, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import styles from '../styles/LandingPage.module.css'

// The hero content and CSS fallback work independently of the WebGL chunk.
export default function CyberScene({ paused }) {
  const hostRef = useRef(null)
  const pauseRef = useRef(paused)
  const [ready, setReady] = useState(false)
  useEffect(() => { pauseRef.current = paused }, [paused])
  useEffect(() => {
    const host = hostRef.current
    let disposed = false
    let cleanup = () => {}
    import('three').then(THREE => {
      if (disposed) return
      let renderer
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }) } catch { return }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setClearColor(0x000000, 0)
      host.appendChild(renderer.domElement)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30)
      camera.position.set(0, 0.25, 8.5)
      scene.add(new THREE.HemisphereLight(0xffffff, 0x52642a, 2.8))
      const key = new THREE.DirectionalLight(0xffffff, 4)
      key.position.set(-3, 5, 6)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xa99aff, 3)
      rim.position.set(4, 1, -2)
      scene.add(rim)
      const lock = new THREE.Group()
      scene.add(lock)
      const green = new THREE.MeshStandardMaterial({ color: 0xc2ff4a, roughness: 0.26, metalness: 0.28 })
      const dark = new THREE.MeshStandardMaterial({ color: 0x242721, roughness: 0.4, metalness: 0.35 })
      const chrome = new THREE.MeshStandardMaterial({ color: 0xdddde4, roughness: 0.22, metalness: 0.65 })
      const shape = new THREE.Shape()
      const w = 1.04, h = 0.79, r = 0.23
      shape.moveTo(-w + r, -h)
      shape.lineTo(w - r, -h)
      shape.quadraticCurveTo(w, -h, w, -h + r)
      shape.lineTo(w, h - r)
      shape.quadraticCurveTo(w, h, w - r, h)
      shape.lineTo(-w + r, h)
      shape.quadraticCurveTo(-w, h, -w, h - r)
      shape.lineTo(-w, -h + r)
      shape.quadraticCurveTo(-w, -h, -w + r, -h)
      const body = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.09, bevelThickness: 0.09 }), green)
      body.position.set(0, -0.43, -0.27)
      lock.add(body)
      const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.15, 16, 56, Math.PI), chrome)
      shackle.position.set(0, 0.83, 0)
      lock.add(shackle)
      for (const x of [-0.64, 0.64]) {
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.58, 16), chrome)
        stem.position.set(x, 0.55, 0)
        lock.add(stem)
      }
      const keyhole = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), dark)
      keyhole.position.set(0, -0.32, 0.385)
      lock.add(keyhole)
      const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.3), dark)
      slot.position.set(0, -0.51, 0.39)
      lock.add(slot)
      const orbit = new THREE.Group()
      scene.add(orbit)
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x32362d, transparent: true, opacity: 0.28 })
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.13, 0.008, 6, 100), orbitMaterial)
        ring.rotation.set(0.8 + i * 0.8, 0.3 + i, 0.2)
        orbit.add(ring)
      }
      const bits = []
      const bitMaterial = new THREE.MeshStandardMaterial({ color: 0x9e88f0, roughness: 0.4 })
      for (let i = 0; i < 7; i++) {
        const bit = new THREE.Mesh(new THREE.OctahedronGeometry(0.08 + (i % 3) * 0.04), bitMaterial)
        const angle = (i / 7) * Math.PI * 2
        bit.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 1.7, Math.sin(i) * 0.7)
        scene.add(bit)
        bits.push(bit)
      }
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      const pointer = { x: 0, y: 0 }
      const move = event => {
        const rect = host.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.65
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3
      }
      const leave = () => { pointer.x = 0; pointer.y = 0 }
      host.addEventListener('pointermove', move)
      host.addEventListener('pointerleave', leave)
      let visible = true, frame = 0, last = 0, elapsed = 0
      const resize = new ResizeObserver(() => {
        const { width, height } = host.getBoundingClientRect()
        if (!width || !height) return
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        renderer.render(scene, camera)
      })
      resize.observe(host)
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
      visibility.observe(host)
      lock.rotation.set(-0.12, -0.38, -0.16)
      const tick = time => {
        frame = requestAnimationFrame(tick)
        const delta = Math.min((time - last) / 1000, 0.05)
        last = time
        if (!visible || document.hidden || pauseRef.current || reducedMotion.matches) return
        elapsed += delta
        lock.rotation.y += (-0.38 + pointer.x - lock.rotation.y) * 0.045
        lock.rotation.x += (-0.12 + pointer.y - lock.rotation.x) * 0.045
        lock.position.y = Math.sin(elapsed * 1.2) * 0.08
        orbit.rotation.y = elapsed * 0.08
        bits.forEach((bit, i) => { bit.rotation.x = elapsed * 0.3 + i; bit.rotation.y = elapsed * 0.4 })
        renderer.render(scene, camera)
      }
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
      setReady(true)
      const contextLost = event => { event.preventDefault(); setReady(false) }
      renderer.domElement.addEventListener('webglcontextlost', contextLost)
      cleanup = () => {
        cancelAnimationFrame(frame)
        resize.disconnect()
        visibility.disconnect()
        host.removeEventListener('pointermove', move)
        host.removeEventListener('pointerleave', leave)
        renderer.domElement.removeEventListener('webglcontextlost', contextLost)
        scene.traverse(object => { if (object.geometry) object.geometry.dispose() })
        ;[green, dark, chrome, orbitMaterial, bitMaterial].forEach(material => material.dispose())
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
    }).catch(() => { /* Keep the CSS fallback if WebGL cannot initialize. */ })
    return () => { disposed = true; cleanup() }
  }, [])
  return <div className={styles.scene} ref={hostRef} aria-hidden="true"><div className={`${styles.lockFallback} ${ready ? styles.fallbackHidden : ''}`}><ShieldCheck size={130} strokeWidth={1.4} /></div></div>
}
