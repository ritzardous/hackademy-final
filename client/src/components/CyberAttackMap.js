import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Pause, Play, Shuffle, Globe2 } from 'lucide-react'
import styles from '../styles/CyberAttackMap.module.css'

gsap.registerPlugin(ScrollTrigger)
const cities = [
  { name: 'New Delhi', lat: 28.6, lon: 77.2 }, { name: 'London', lat: 51.5, lon: -0.1 },
  { name: 'San Francisco', lat: 37.8, lon: -122.4 }, { name: 'Tokyo', lat: 35.7, lon: 139.7 },
  { name: 'São Paulo', lat: -23.6, lon: -46.6 }, { name: 'Sydney', lat: -33.9, lon: 151.2 },
  { name: 'Singapore', lat: 1.3, lon: 103.8 }, { name: 'Cape Town', lat: -33.9, lon: 18.4 },
]
const routes = [[1, 0], [2, 3], [4, 1], [0, 6], [5, 0], [7, 4], [3, 5], [6, 2]]
// Lightweight, stylized land outlines; no remote imagery or map service required.
const land = [
  [[-168,70],[-140,72],[-125,60],[-105,72],[-65,58],[-52,48],[-80,25],[-97,16],[-112,29],[-130,50],[-168,60]],
  [[-81,12],[-62,10],[-35,-8],[-40,-23],[-68,-55],[-76,-38],[-80,-8]],
  [[-18,35],[8,37],[35,30],[50,12],[42,-12],[30,-35],[16,-35],[4,-10],[-16,12]],
  [[-10,36],[-10,58],[10,72],[40,70],[65,77],[110,72],[180,62],[160,48],[140,35],[125,20],[105,5],[80,8],[65,25],[40,30],[30,42]],
  [[112,-12],[135,-10],[154,-25],[148,-39],[115,-35]], [[-55,60],[-42,60],[-20,78],[-45,84],[-60,75]],
  [[47,-13],[50,-16],[49,-26],[44,-25]], [[130,33],[142,45],[146,44],[137,32]],
]
const inside = (x, y, polygon) => {
  let hit = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j]
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

export default function CyberAttackMap() {
  const host = useRef(null), panel = useRef(null), controls = useRef({ paused: false, route: 0 })
  const [paused, setPaused] = useState(false), [route, setRoute] = useState(0), [ready, setReady] = useState(false)
  useEffect(() => { controls.current = { paused, route } }, [paused, route])
  useEffect(() => {
    const element = host.current
    let cancelled = false, cleanup = () => {}
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const intro = gsap.context(() => {
      if (!motion.matches) gsap.from(panel.current, { y: 24, opacity: 0, duration: .7, scrollTrigger: { trigger: panel.current, start: 'top 95%', once: true } })
    }, panel)
    import('three').then(T => {
      if (cancelled) return
      let renderer
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }) } catch { return }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      element.appendChild(renderer.domElement)
      const scene = new T.Scene(), camera = new T.PerspectiveCamera(40, 1, .1, 30)
      camera.position.set(0, .15, 7.7)
      const globe = new T.Group()
      scene.add(globe)
      const materials = []
      const mat = (Type, options) => { const material = new Type(options); materials.push(material); return material }
      const point = (lat, lon, radius = 1.8) => {
        const a = lat * Math.PI / 180, b = lon * Math.PI / 180
        return new T.Vector3(radius * Math.cos(a) * Math.sin(b), radius * Math.sin(a), radius * Math.cos(a) * Math.cos(b))
      }
      globe.add(new T.Mesh(new T.SphereGeometry(1.78, 48, 32), mat(T.MeshBasicMaterial, { color: 0x191d23 })))
      globe.add(new T.Mesh(new T.SphereGeometry(1.8, 32, 20), mat(T.MeshBasicMaterial, { color: 0x8571b2, wireframe: true, transparent: true, opacity: .13 })))
      const atmosphere = mat(T.ShaderMaterial, {
        transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        vertexShader: 'varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }',
        fragmentShader: 'varying vec3 n; varying vec3 v; void main(){ float rim=pow(1.0-abs(dot(normalize(n),normalize(v))),3.0); gl_FragColor=vec4(0.58,0.35,1.0,rim*0.65); }',
      })
      globe.add(new T.Mesh(new T.SphereGeometry(1.87, 48, 32), atmosphere))
      const glowCanvas = document.createElement('canvas')
      glowCanvas.width = glowCanvas.height = 64
      const context = glowCanvas.getContext('2d'), gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, '#e9ffbe'); gradient.addColorStop(.2, '#c0f75b'); gradient.addColorStop(.5, '#c0f75b65'); gradient.addColorStop(1, '#c0f75b00')
      context.fillStyle = gradient; context.fillRect(0, 0, 64, 64)
      const glowTexture = new T.CanvasTexture(glowCanvas)
      const glowMaterial = mat(T.SpriteMaterial, { map: glowTexture, transparent: true, blending: T.AdditiveBlending, depthWrite: false })
      const glow = parent => { const sprite = new T.Sprite(glowMaterial); sprite.scale.set(.25, .25, 1); parent.add(sprite) }
      const positions = []
      for (let lat = -56; lat < 82; lat += 3) for (let lon = -180; lon < 180; lon += 3) {
        if (land.some(polygon => inside(lon, lat, polygon))) positions.push(...point(lat, lon, 1.82).toArray())
      }
      const dots = new T.BufferGeometry()
      dots.setAttribute('position', new T.Float32BufferAttribute(positions, 3))
      globe.add(new T.Points(dots, mat(T.PointsMaterial, { color: 0xc7b6ff, size: .045, sizeAttenuation: true })))
      const nodeMaterial = mat(T.MeshBasicMaterial, { color: 0xc0f75b })
      cities.forEach(city => { const node = new T.Mesh(new T.SphereGeometry(.045, 8, 8), nodeMaterial); node.position.copy(point(city.lat, city.lon, 1.85)); glow(node); globe.add(node) })
      const attacks = routes.map(([from, to], index) => {
        const start = point(cities[from].lat, cities[from].lon), end = point(cities[to].lat, cities[to].lon)
        const path = new T.CatmullRomCurve3(Array.from({ length: 33 }, (_, i) => start.clone().lerp(end, i / 32).normalize().multiplyScalar(1.84 + Math.sin(i / 32 * Math.PI) * .65)))
        const material = mat(T.MeshBasicMaterial, { color: index === 0 ? 0xc0f75b : 0xae99e7, transparent: true, opacity: index === 0 ? .95 : .55 })
        globe.add(new T.Mesh(new T.TubeGeometry(path, 64, .009, 4, false), material))
        const packet = new T.Mesh(new T.SphereGeometry(.038, 8, 8), nodeMaterial)
        glow(packet)
        globe.add(packet)
        return { path, material, packet }
      })
      const ringMaterial = mat(T.MeshBasicMaterial, { color: 0xae99e7, transparent: true, opacity: .4 })
      const ring = new T.Mesh(new T.TorusGeometry(2.2, .007, 4, 100), ringMaterial)
      ring.rotation.x = 1.2; ring.rotation.y = .3; scene.add(ring)
      const outer = new T.Mesh(new T.TorusGeometry(2.35, .006, 4, 100), ringMaterial)
      outer.rotation.set(.4, .8, -.4); scene.add(outer)
      const pointer = { x: 0, y: 0 }, view = { angle: -.8 }
      const move = event => {
        if (motion.matches || controls.current.paused) return
        const rect = element.getBoundingClientRect()
        gsap.to(pointer, { x: ((event.clientX - rect.left) / rect.width - .5) * .65, y: ((event.clientY - rect.top) / rect.height - .5) * .3, duration: .8, overwrite: true })
      }
      const leave = () => gsap.to(pointer, { x: 0, y: 0, duration: 1, overwrite: true })
      element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave)
      let visible = true, frame, last = 0, elapsed = 0, currentRoute = -1
      globe.rotation.set(.15, -.8, -.12)
      const resize = new ResizeObserver(() => {
        const { width, height } = element.getBoundingClientRect()
        if (!width || !height) return
        camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); renderer.render(scene, camera)
      })
      resize.observe(element)
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
      observer.observe(element)
      const tick = time => {
        frame = requestAnimationFrame(tick)
        const delta = Math.min((time - last) / 1000, .05); last = time
        if (!visible || document.hidden) return
        const routeChanged = currentRoute !== controls.current.route
        if (routeChanged) {
          currentRoute = controls.current.route
          attacks.forEach((attack, i) => { attack.material.color.setHex(i === currentRoute ? 0xc0f75b : 0xae99e7); attack.material.opacity = i === currentRoute ? .95 : .55 })
          const angle = -cities[routes[currentRoute][0]].lon * Math.PI / 180 - elapsed * .07
          gsap.killTweensOf(view)
          if (controls.current.paused || motion.matches) view.angle = angle
          else gsap.to(view, { angle, duration: 1.3, ease: 'power2.inOut' })
        }
        if (!routeChanged && (controls.current.paused || motion.matches)) return
        if (!controls.current.paused && !motion.matches) {
          elapsed += delta
          ring.rotation.z = elapsed * .04
        }
        globe.rotation.y = view.angle + elapsed * .07 + pointer.x
        globe.rotation.x = .15 + pointer.y
        attacks.forEach((attack, i) => { attack.packet.position.copy(attack.path.getPointAt((elapsed * .23 + i / 8) % 1)); attack.packet.scale.setScalar(i === currentRoute ? 1.6 : .7) })
        renderer.render(scene, camera)
      }
      frame = requestAnimationFrame(tick)
      setReady(true)
      const lost = event => { event.preventDefault(); setReady(false) }
      renderer.domElement.addEventListener('webglcontextlost', lost)
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); gsap.killTweensOf(pointer); gsap.killTweensOf(view)
        element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave)
        renderer.domElement.removeEventListener('webglcontextlost', lost)
        scene.traverse(object => object.geometry?.dispose()); materials.forEach(material => material.dispose()); glowTexture.dispose()
        renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove()
      }
    }).catch(() => { /* The static globe and route text remain available without WebGL. */ })
    return () => { cancelled = true; cleanup(); intro.revert() }
  }, [])
  const [from, to] = routes[route]
  return <section className={styles.panel} ref={panel} aria-labelledby="attack-map-title">
    <div className={styles.topbar}><span><Globe2 size={18} /> Cyber attack map</span><span className={styles.simulation}>Simulation</span></div>
    <div className={styles.body}>
      <div className={styles.copy}><h2 id="attack-map-title">Threats move fast.<br /><span>So do we.</span></h2><p>A little global chaos. A lot of human firewall energy.</p><div className={styles.route} aria-live="polite"><span>Simulated route</span><strong>{cities[from].name} <span aria-hidden="true">→</span> {cities[to].name}</strong></div><div className={styles.actions}><button onClick={() => setRoute(value => (value + 1) % routes.length)}><Shuffle size={16} /> Reroute</button><button aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} /> : <Pause size={16} />}{paused ? 'Resume' : 'Pause'}</button></div></div>
      <div className={styles.visual} ref={host} aria-hidden="true">{!ready && <div className={styles.fallback}><Globe2 size={180} strokeWidth={.6} /></div>}<span className={styles.orbitLabel}>HUMAN FIREWALL / ONLINE</span></div>
    </div>
    <div className={styles.bottom}><span><i /> Lime: selected route</span><span>Illustrative traffic. No live threat data.</span></div>
  </section>
}
