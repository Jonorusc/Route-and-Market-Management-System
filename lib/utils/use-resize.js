import { ref } from 'vue'

export default function useResize() {
  const width = ref(window.innerWidth)

  window.addEventListener('resize', resizeHandler)

  function resizeHandler() {
    return (width.value = window.innerWidth)
  }

  return { width }
}
