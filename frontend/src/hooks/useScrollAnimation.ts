import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-delay, .animate-on-scroll-delay-2');
    elements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observerRef.current?.unobserve(element);
      });
    };
  }, []);

  return observerRef.current;
};
