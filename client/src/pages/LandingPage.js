import CyberArtwork from '../components/CyberArtwork'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, ArrowDown, Shield, ShieldCheck, Terminal, Target, AlertTriangle, Heart, Check, X, Gamepad2, Pause, Play, Sparkles } from 'lucide-react'
import CyberScene from '../components/CyberScene'
import styles from '../styles/LandingPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const MODULES = [
  { id: '01', title: 'The “Digital Arrest”', description: 'Spoiler: the police don’t use Zoom to interrogate you. Learn to hang up with confidence.', art: 'arrest', path: '/learn/digital-arrest-scam', color: 'purple', label: 'CALL OUT THE CON' },
  { id: '02', title: 'Fake Job Offers', description: '₹5000/hr to like YouTube videos? Takes 5 seconds to spot the trap once you know what to look for.', art: 'job', path: '/learn/fake-job-scams', color: 'green', label: 'TOO GOOD TO BE TRUE' },
  { id: '03', title: 'KYC Fraud', description: 'An urgent KYC message? Learn to spot fake bank links, data harvesting, and SIM-swap traps.', art: 'identity', path: '/learn/ekyc-sim-swap', color: 'paper', label: 'KEEP YOUR DATA YOURS' },
  { id: '04', title: 'AI & Deepfakes', description: 'Is that really your uncle calling? Voice cloning is here. Learn to verify.', art: 'deepfake', color: 'dark', label: 'THE NEXT FRONTIER', soon: true },
]
const STEPS = [
  { n: '01', title: 'Enter the arena.', desc: 'No passwords. Just pick a handle and start.', detail: 'Your internet survival journey starts here.', icon: Gamepad2 },
  { n: '02', title: 'Get “scammed”.', desc: 'Face safe simulations of real-world threats.', detail: 'Make mistakes here. Keep your money out there.', icon: Target },
  { n: '03', title: 'Build defenses.', desc: 'Learn the red flags. Protect your family.', detail: 'Every person you educate is a firewall.', icon: ShieldCheck },
]

function MagneticLink({ children, className = '', ...props }) {
  const ref = useRef(null)
  const move = event => {
    if (ref.current.closest('[data-motion-paused="true"]') || !window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const rect = ref.current.getBoundingClientRect()
    gsap.to(ref.current, { x: (event.clientX - rect.left - rect.width / 2) * 0.12, y: (event.clientY - rect.top - rect.height / 2) * 0.18, duration: 0.3, overwrite: true })
  }
  const reset = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, overwrite: true })
  useEffect(() => { const element = ref.current; return () => gsap.killTweensOf(element) }, [])
  return <Link ref={ref} className={className} onPointerMove={move} onPointerLeave={reset} onBlur={reset} {...props}>{children}</Link>
}

export default function LandingPage() {
  const root = useRef(null)
  const protocol = useRef(null)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [answer, setAnswer] = useState(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (paused) return
      const context = gsap.context(() => {
        gsap.from('[data-hero-reveal]', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
        gsap.utils.toArray('[data-reveal]').forEach(element => {
          gsap.from(element, { y: 38, opacity: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } })
        })
        gsap.to('[data-orbit-panel]', { y: -45, rotation: 2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '650 top', scrub: 1 } })
        gsap.to('[data-marquee]', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '[data-marquee]', start: 'top bottom', end: 'bottom top', scrub: 1.5 } })
        const desktop = gsap.matchMedia()
        desktop.add('(min-width: 960px)', () => {
          const cards = gsap.utils.toArray('[data-protocol-card]')
          const timeline = gsap.timeline({ scrollTrigger: {
            trigger: protocol.current, start: 'top 110px', end: '+=950', pin: true, scrub: 0.7,
            onUpdate: self => setStep(Math.min(2, Math.floor(self.progress * 3))),
          } })
          timeline.to('[data-protocol-progress]', { scaleX: 1, ease: 'none', duration: 3 }, 0)
          cards.forEach((card, index) => {
            timeline.fromTo(card, { y: 20 + index * 15, rotation: index === 1 ? -3 : 3, scale: 0.94 }, { y: 0, rotation: 0, scale: 1, duration: 0.8 }, index)
          })
        })
        return () => desktop.revert()
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [paused])

  const explore = () => document.getElementById('defense-protocols')?.scrollIntoView({ behavior: paused ? 'auto' : 'smooth' })

  return <div ref={root} data-motion-paused={paused} className={`${styles.landingPage} ${paused ? styles.motionPaused : ''}`}>
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroGrid}>
        <div className={styles.heroContent}>
          <p data-hero-reveal className={styles.heroTagline}>The modern survival guide for the internet.</p>
          <h1 id="hero-title" data-hero-reveal>Don’t let a<br /><span className={styles.scammer}>scammer<svg viewBox="0 0 480 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12 Q120 0 237 10 T477 7 M13 18 Q210 6 460 16" /></svg></span><br />ruin your day<span className={styles.titleDot}>.</span></h1>
          <p data-hero-reveal className={styles.heroSubtitle}>The “police” is calling. Your KYC has “expired”. Strangers want to pay you to like videos.</p>
          <p data-hero-reveal className={styles.heroStrong}>Welcome to the digital jungle.<br />We teach you how to survive.</p>
          <div data-hero-reveal className={styles.ctaGroup}>
            <MagneticLink to="/games" className={styles.primaryBtn}>Start training <ArrowUpRight size={23} /></MagneticLink>
            <button className={styles.secondaryBtn} onClick={explore}>Explore modules <ArrowDown size={17} /></button>
          </div>
          <div data-hero-reveal className={styles.heroFootnote}><span><Check size={16} /> Free to play</span><span><Check size={16} /> No tech skills needed</span></div>
        </div>
        <div className={styles.heroArt} data-hero-reveal>
          <div className={styles.visualFrame}>
            <div className={styles.frameHeader}><span><Shield size={18} /> Your digital armor</span><span className={styles.windowDots} aria-hidden="true">● ● ●</span></div>
            <div className={styles.sceneArea}>
              <div className={styles.orbitWord} aria-hidden="true">STAY<br />SHARP.</div>
              <CyberScene paused={paused} />
            </div>
            <div className={styles.frameFooter} aria-hidden="true" />
          </div>
          <div className={styles.threatSticker} data-orbit-panel><span className={styles.stickerIcon}><AlertTriangle size={24} /></span><div><strong>“Your KYC has expired.”</strong><span>Nice try, scammer.</span></div></div>
          <div className={styles.starburst} aria-hidden="true"><ShieldCheck size={37} /></div>
        </div>
      </div>
      <div className={styles.heroBottom}><button onClick={() => setPaused(value => !value)} aria-pressed={paused} className={styles.motionButton}>{paused ? <Play size={15} /> : <Pause size={15} />}{paused ? 'Resume motion' : 'Pause motion'}</button></div>
    </section>

    <div className={styles.marquee} aria-label="Spot the scam. Break the pattern. Protect your people."><div data-marquee aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <React.Fragment key={i}><span>SPOT THE SCAM</span><Sparkles /><span className={styles.outlineText}>BREAK THE PATTERN</span><Sparkles /><span>PROTECT YOUR PEOPLE</span><Sparkles /></React.Fragment>)}</div></div>

    <section id="defense-protocols" className={styles.modulesSection} aria-labelledby="modules-title">
      <div className={styles.sectionHead} data-reveal><h2 id="modules-title">Defense protocols<span className={styles.purpleDot}>.</span></h2><p>Real scams. Zero jargon.<br />Master these modules to become scambait-proof.</p></div>
      <div className={styles.moduleGrid}>
        {MODULES.map(({ id, title, description, art, path, color, soon }) => {
          const Tag = soon ? 'article' : Link
          return <Tag key={id} {...(path ? { to: path } : {})} className={`${styles.moduleCard} ${styles[color]}`} data-reveal>
            <div className={styles.cardTop}>{soon ? <span className={styles.soon}>Coming soon</span> : <ArrowUpRight size={24} />}</div>
            <div className={styles.moduleIcon}><CyberArtwork kind={art} /></div>
            <h3>{title}</h3><p>{description}</p>
          </Tag>
        })}
      </div>
      <div className={styles.moduleSubline} data-reveal><Link to="/learn">See all learning modules <ArrowUpRight size={18} /></Link></div>
    </section>

    <section className={styles.simulationSection} aria-labelledby="simulation-title">
      <div className={styles.simulationIntro} data-reveal><h2 id="simulation-title">Get scammed here.<br /><span>Not out there.</span></h2><p>We simulate real-world attacks in a safe sandbox environment so you know exactly what to do when it happens for real.</p><div className={styles.simulationBenefits}><span><Check size={18} /> Real-world scenarios</span><span><Check size={18} /> Instant explanations</span><span><Check size={18} /> Mistakes encouraged</span></div><MagneticLink to="/games" className={styles.primaryBtn}>Enter the playground <Gamepad2 size={21} /></MagneticLink></div>
      <div className={styles.demoWindow} data-reveal>
        <div className={styles.demoHeader}><span><Terminal size={18} /> Try a threat simulation</span></div>
        <div className={styles.demoBody}><div className={styles.messageSender}><CyberArtwork kind="bank" className={styles.senderAvatar} /><div><strong>“Your bank”</strong><small>Example SMS</small></div><AlertTriangle size={22} /></div><p className={styles.message}>Dear customer, your account will be blocked in 2 hours. Update your KYC immediately:</p><span className={styles.fakeLink}>https://bank-kyc-verify.example</span><p className={styles.demoQuestion}>Trust it or bust it?</p><div className={styles.answerButtons}><button onClick={() => setAnswer('safe')} aria-pressed={answer === 'safe'} disabled={answer !== null}><Check size={19} /> Looks safe</button><button onClick={() => setAnswer('scam')} aria-pressed={answer === 'scam'} disabled={answer !== null}><X size={19} /> It’s a scam</button></div><div className={`${styles.demoFeedback} ${answer ? styles.answered : ''}`} aria-live="polite">{answer ? <><strong>{answer === 'scam' ? 'Great catch. Human firewall activated.' : 'That’s the trap. Now you know.'}</strong><p>Urgency + an unfamiliar link = red flags. Open your bank’s official app to check.</p><button onClick={() => setAnswer(null)}>Try again <ArrowRight size={17} /></button></> : <span>No sign-up needed. Pick an answer to try it.</span>}</div></div>
      </div>
    </section>

    <section ref={protocol} className={styles.protocolSection} aria-labelledby="protocol-title">
      <div className={styles.sectionHead} data-reveal><h2 id="protocol-title">From “uh-oh” to “I got this.”</h2><span className={styles.levelBadge}>Level {step + 1} of 3</span></div>
      <div className={styles.progressTrack} aria-hidden="true"><span data-protocol-progress /></div>
      <div className={styles.protocolGrid}>{STEPS.map(({ n, title, desc, detail, icon: Icon }, index) => <article key={n} data-protocol-card className={`${styles.protocolCard} ${step === index ? styles.currentStep : ''}`}><div className={styles.stepTop}><span>{n}</span><Icon size={30} /></div><h3>{title}</h3><p>{desc}</p><small>{detail}</small></article>)}</div>
    </section>

    <section className={styles.peopleSection}>
      <div data-reveal><h2>You don’t need to be a hacker.<br />Just a little harder to hack.</h2><p>Every person you educate is a firewall. Build your defenses, then pass them on. Because a safer internet starts with us.</p></div><Link to="/learn" className={styles.panicCard} data-reveal><div><AlertTriangle size={26} /><ArrowUpRight size={24} /></div><h3>The panic button.</h3><p>Real-time steps to take when you realise you’ve been compromised. Act fast — every minute matters.</p><strong>Find recovery guidance <ArrowRight size={18} /></strong></Link>
    </section>

    <section className={styles.finalCta}><div className={styles.ctaCross} aria-hidden="true">✳</div><h2 data-reveal>The internet is wild.<br /><span>Be wilder.</span></h2><p data-reveal>Less doomscrolling. More scam-dodging.<br />Your digital survival skills are one click away.</p><MagneticLink to="/games" className={styles.darkBtn}>Let’s play defense <ArrowUpRight size={23} /></MagneticLink></section>
    <footer className={styles.footer}><Link to="/" className={styles.footerLogo}><Shield size={22} /> hackademy<span aria-hidden="true">✳</span></Link><span>The modern survival guide for the internet.</span><div><Link to="/learn">Learn</Link><Link to="/games">Play</Link><a href="https://github.com/RiteshJha912" target="_blank" rel="noopener noreferrer">Made with <Heart size={12} /> by Ritzardous <ArrowUpRight size={13} /></a></div></footer>
  </div>
}
