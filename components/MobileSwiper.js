import { useCallback, useEffect, useState, useRef } from "react"

export default function MobileSwiper({ children, onSwipe }) {
    const wrapperRef = useRef(null)
    const [startY, setStartY] = useState(0);

    const handleTouchStart = useCallback((e) => {
        if (!wrapperRef.current.contains(e.target)) {
              return
        }
        setStartY(e.touches[0].clientY)
      }, [])

      const handleTouchEnd = useCallback(
    (e) => {
        if (!wrapperRef.current.contains(e.target)) {
            return
        }
        const endY = e.changedTouches[0].clientY        
        const deltaY = endY - startY

        onSwipe({ deltaY })
    }, [startY, onSwipe])   

     useEffect(() => {
        window.addEventListener("touchstart", handleTouchStart)
        window.addEventListener("touchend", handleTouchEnd)

        return () => {
            window.removeEventListener("touchstart", handleTouchStart)
            window.removeEventListener("touchend", handleTouchEnd)
        }
      }, [handleTouchStart, handleTouchEnd])

    return <div ref={wrapperRef}>{children}</div>
}