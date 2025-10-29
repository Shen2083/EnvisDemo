export function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute inset-0" 
        style={{ transform: 'rotate(-45deg)', transformOrigin: 'center', opacity: 0.10 }} 
        data-testid="watermark-container"
      >
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="text-xl md:text-2xl font-semibold absolute flex gap-16"
            style={{
              top: `${i * 120 - 600}px`,
              left: '-50%',
              width: '200%',
            }}
          >
            {[...Array(10)].map((_, j) => (
              <span key={j} className="whitespace-nowrap">
                Demo prototype built by Shenbagaraja Vanamamalai
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
