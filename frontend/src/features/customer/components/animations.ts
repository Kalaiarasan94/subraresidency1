export const fadeInUp = {
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -40, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  whileInView: { opacity: 1, x: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
};

export const fadeInRight = {
  initial: { opacity: 0, x: 40, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  whileInView: { opacity: 1, x: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  },
  whileInView: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  },
  viewport: { once: true }
};

export const heroStagger = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.18
    }
  }
};

export const heroItem = {
  initial: { opacity: 0, y: 34, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } as any
};
