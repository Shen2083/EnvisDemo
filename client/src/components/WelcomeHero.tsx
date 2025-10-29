import { Button } from "@/components/ui/button";
import heroImage from "@assets/stock_images/abstract_minimal_gra_4910bd69.jpg";

interface WelcomeHeroProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function WelcomeHero({ onSignUp, onLogin }: WelcomeHeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{ transform: 'rotate(-45deg)' }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="text-2xl md:text-3xl font-semibold whitespace-nowrap opacity-15 absolute"
              style={{
                top: `${i * 150 - 300}px`,
                left: '-20%',
                width: '140%',
              }}
            >
              MVP prototype built by Shenbagaraja Vanamamalai
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="font-heading font-bold text-5xl md:text-6xl tracking-tight mb-6">
          Envis
        </h1>
        <p className="text-2xl md:text-3xl font-medium mb-4">
          Your Family's Financial Partner, Finally.
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          The intelligent financial coach that proactively coordinates your goals, 
          prevents financial stress, and builds collective wealth.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="text-lg px-8"
            onClick={onSignUp}
            data-testid="button-signup"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 bg-background/60 backdrop-blur-sm"
            onClick={onLogin}
            data-testid="button-login"
          >
            Log In
          </Button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>FCA-aligned principles • Bank-level security • Your data stays private</span>
        </div>
      </div>
    </div>
  );
}
