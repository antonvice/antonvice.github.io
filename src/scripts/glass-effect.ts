/**
 * Card hover utility
 * Adds mouse tracking for chunky patterned card highlights
 */

export function initGlassEffect() {
  // Only run on client side
  if (typeof window === 'undefined') return;

  const cards = document.querySelectorAll('.card-glass');
  
  cards.forEach(card => {
    const element = card as HTMLElement;
    
    // Add mouse move handler for card highlight positioning
    element.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      element.style.setProperty('--mouse-x', `${x}%`);
      element.style.setProperty('--mouse-y', `${y}%`);
    });
    
    // Reset on mouse leave
    element.addEventListener('mouseleave', () => {
      element.style.setProperty('--mouse-x', '50%');
      element.style.setProperty('--mouse-y', '50%');
    });
  });
}

// Auto-init when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlassEffect);
  } else {
    initGlassEffect();
  }
  
  // Re-init on navigation (for SPAs)
  document.addEventListener('astro:page-load', initGlassEffect);
}
