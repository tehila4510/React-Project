
const INITIAL_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id:    i,
  left:  `${Math.random() * 100}%`,
  size:  `${4 + Math.random() * 8}px`,
  dur:   `${9 + Math.random() * 12}s`,
  delay: `${Math.random() * 12}s`,
  color: ['var(--purple)', 'var(--blue)', 'var(--yellow)', 'var(--green)'][i % 4],
}));

export default function Particles() {
  // 2. הקומפוננטה רק משתמשת בנתונים הסטטיים
  return (
    <div className="particles">
      {INITIAL_PARTICLES.map((p) => (
        <div 
          key={p.id} 
          className="particle" 
          style={{
            left: p.left, 
            width: p.size, 
            height: p.size,
            background: p.color, 
            animationDuration: p.dur, 
            animationDelay: p.delay,
          }} 
        />
      ))}
    </div>
  );
}
