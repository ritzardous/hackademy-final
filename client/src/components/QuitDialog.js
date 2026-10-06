import React, { useEffect, useId, useRef } from 'react'
import styles from '../styles/common.module.css'

export default function QuitDialog({ open, onCancel, onConfirm }) {
  const panel = useRef(null)
  const cancel = useRef(null)
  const title = useId()
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancel.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open])
  if (!open) return null
  const keyDown = event => {
    if (event.key === 'Escape') { event.stopPropagation(); onCancel() }
    if (event.key !== 'Tab') return
    const buttons = panel.current.querySelectorAll('button')
    if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[1].focus() }
    if (!event.shiftKey && document.activeElement === buttons[1]) { event.preventDefault(); buttons[0].focus() }
  }
  return <div className={styles.dialogBackdrop} onMouseDown={event => { if (event.target === event.currentTarget) onCancel() }}>
    <div ref={panel} className={styles.dialogPanel} role="dialog" aria-modal="true" aria-labelledby={title} onKeyDown={keyDown}>
      <h2 id={title}>Leave this round?</h2>
      <p>Your progress in this round will be lost. Your saved scores and ranking won’t change.</p>
      <div className={styles.dialogActions}><button ref={cancel} onClick={onCancel} className={styles.button}>Keep playing</button><button onClick={onConfirm} className={`${styles.button} ${styles.dangerButton}`}>Leave round</button></div>
    </div>
  </div>
}
