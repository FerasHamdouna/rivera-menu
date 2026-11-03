// Brand ornaments shared by the menu (and later the print page): crown, logo, frame corners.

export function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 46 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 24 L2 8 L13 16 L23 3 L33 16 L44 8 L42 24 Z" />
      <path d="M5 27.5 H41" />
      <circle cx="2" cy="7" r="1.6" fill="currentColor" />
      <circle cx="23" cy="2" r="1.8" fill="currentColor" />
      <circle cx="44" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Uploaded logo when there is one, otherwise the drawn crown + script wordmark. */
export function Logo({ src }: { src: string | null }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded file of unknown size
    return <img className="rv-logo-img" src={src} alt="Rivera Cafe & Restaurant" />;
  }
  return (
    <div className="rv-logo" role="img" aria-label="Rivera Cafe & Restaurant">
      <Crown className="crown" />
      <span className="word rv-gold">Rivera</span>
      <span className="sub rv-gold">Cafe &amp; Restaurant</span>
    </div>
  );
}

function Corner() {
  return (
    <svg viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M2 32 V10 Q2 2 10 2 H32" />
      <path d="M8 26 V14 Q8 8 14 8 H26" />
      <path d="M14 14 q6 0 6 6 q-6 0 -6 -6z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

export function Frame() {
  return (
    <div className="rv-frame">
      <Corner />
      <Corner />
      <Corner />
      <Corner />
    </div>
  );
}
