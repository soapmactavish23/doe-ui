import Image from 'next/image';
import imgLoading from '../assets/loading.png';

export default function LoadingContent() {
  return (
    <div
      id="route-loading"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)'
      }}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '22px 26px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 16,
          // Dark mode-friendly
          colorScheme: 'light dark'
        }}
      >
        {/* Ícone de loading (cobrinha na caixa com barra) */}
        <Image
          src={imgLoading}
          alt="Carregando"
          width={150}
          height={200}
          priority
          style={{ display: 'block' }}
        />

        {/* Barrinha de progresso animada */}
        <div
          style={{
            width: 160,
            height: 10,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.1)',
            overflow: 'hidden',
            position: 'relative'
          }}
          aria-hidden="true"
        >
          <div className="loading-bar" />
        </div>
      </div>

      {/* Animações (com respeito a reduce-motion) */}
      <style jsx global>{`
        .loading-bar {
          position: absolute;
          inset: 0;
        }
        .loading-bar::before {
          content: '';
          position: absolute;
          left: -40%;
          top: 0;
          height: 100%;
          width: 40%;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(46,204,113,0.15), #2ecc71, rgba(46,204,113,0.15));
          animation: slide 1.2s ease-in-out infinite;
        }
        @keyframes slide {
          0% { left: -40%; }
          50% { left: 60%; }
          100% { left: 110%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .loading-bar::before {
            animation: none;
            left: 0;
            width: 50%;
            background: #2ecc71;
          }
        }
      `}</style>
    </div>
  );
}
