"use client"


import { useEffect, useRef, useCallback } from "react"


export function InfiniteScroll({ hasMore, isLoading, onLoadMore, children, threshold = 100 }) {
  const observerRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore()
      }
    },
    [hasMore, isLoading, onLoadMore],
  )

  useEffect(() => {
    const element = observerRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: `${threshold}px`,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [handleObserver, threshold])

  return (
    <>
      {children}
      <div ref={observerRef} className="h-4" />
    </>
  )
}
