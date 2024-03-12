import { watch } from 'vue'

export default function useClickOutside(element, callback = () => {}) {
  function mount() {
    window.addEventListener('mousedown', handler)
    window.addEventListener('touchstart', handler)
  }

  function unmount() {
    window.removeEventListener('mousedown', handler)
    window.removeEventListener('touchstart', handler)
  }

  function handler(event) {
    if (!element.value) return
    if (!element.value.contains(event.target)) {
      callback()
    }
  }

  watch(element, (el) => {
    if (el) {
      mount()
    } else {
      unmount()
    }
  })
}
