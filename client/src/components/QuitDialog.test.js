import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import QuitDialog from './QuitDialog'

describe('QuitDialog keyboard flow', () => {
  let host, root, launch
  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true
    launch = document.createElement('button')
    launch.textContent = 'Back'
    document.body.appendChild(launch)
    launch.focus()
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
  })
  afterEach(() => {
    act(() => root.unmount())
    host.remove()
    launch.remove()
    document.body.style.overflow = ''
  })
  test('focuses the safe action, traps Tab, and restores focus when closed', () => {
    act(() => root.render(<QuitDialog open onCancel={() => {}} onConfirm={() => {}} />))
    const buttons = host.querySelectorAll('button')
    expect(document.activeElement).toBe(buttons[0])
    expect(document.body.style.overflow).toBe('hidden')
    act(() => buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })))
    expect(document.activeElement).toBe(buttons[1])
    act(() => buttons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })))
    expect(document.activeElement).toBe(buttons[0])
    act(() => root.render(<QuitDialog open={false} onCancel={() => {}} onConfirm={() => {}} />))
    expect(document.activeElement).toBe(launch)
    expect(document.body.style.overflow).toBe('')
  })
  test('Escape cancels without abandoning the round', () => {
    const cancel = jest.fn()
    const confirm = jest.fn()
    act(() => root.render(<QuitDialog open onCancel={cancel} onConfirm={confirm} />))
    act(() => host.querySelector('button').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(confirm).not.toHaveBeenCalled()
  })
})
