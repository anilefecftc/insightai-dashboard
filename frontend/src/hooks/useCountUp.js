/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Returns the current display value.
 *
 * React StrictMode note:
 *   In development, StrictMode intentionally mounts → unmounts → remounts every
 *   component to catch side-effect bugs.  The old guard
 *     `if (target === prevTargetRef.current) return`
 *   caused the second mount to skip the animation entirely because
 *   `prevTargetRef.current` was already set during the first (discarded) mount.
 *
 *   Fix: remove the prevTarget guard.  The effect dependency array [target, duration]
 *   already ensures the animation re-runs only when the target actually changes.
 *   The cleanup `cancelAnimationFrame` correctly tears down each run before the
 *   next starts, even in StrictMode's double-invoke cycle.
 */
import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target == null) return

    let startTimestamp = null

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        setValue(target)
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return value
}
