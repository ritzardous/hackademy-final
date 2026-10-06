import React, { Children, cloneElement, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react'
import styles from '../styles/ArticlePage.module.css'

// Keep the existing article content and speech controls inside one reading layout.
export default function ArticleLayout({ children }) {
  const [hero, content] = Children.toArray(children)
  const sections = Children.toArray(content.props.children)
  const [active, setActive] = useState('article-section-1')
  const [contentsOpen, setContentsOpen] = useState(false)
  const bodyRef = useRef(null)
  const contents = sections.map((section, index) => ({
    id: `article-section-${index + 1}`,
    title: Children.toArray(section.props.children).find(child => child.type === 'h2')?.props.children,
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (visible.length) setActive(visible[0].target.id)
    }, { rootMargin: '-100px 0px -55% 0px', threshold: 0 })
    bodyRef.current.querySelectorAll('section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <article className={styles.articlePage}>
    <Link to="/learn" className={styles.backLink}><ArrowLeft size={18} /> All learning modules</Link>
    {hero}
    <div className={styles.readingLayout} ref={bodyRef}>
      <aside className={styles.contents}>
        <nav aria-label="Article sections">
          <h2>In this guide</h2>
          <button className={styles.contentsToggle} aria-expanded={contentsOpen} aria-controls="article-contents" onClick={() => setContentsOpen(value => !value)}>In this guide <ChevronDown size={20} /></button>
          <div id="article-contents" className={contentsOpen ? styles.contentsOpen : styles.contentsLinks}>
          {contents.map(({ id, title }, index) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => { setActive(id); setContentsOpen(false) }}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{title}
          </a>)}
          </div>
        </nav>
        <Link to="/games" className={styles.practiceLink}>Put it into practice <ArrowUpRight size={18} /></Link>
      </aside>
      {cloneElement(content, {}, sections.map((section, index) => cloneElement(section, {
        id: contents[index].id,
        'aria-labelledby': `${contents[index].id}-heading`,
      }, Children.map(section.props.children, child => child?.type === 'h2' ? cloneElement(child, { id: `${contents[index].id}-heading` }) : child))))}
    </div>
  </article>
}
