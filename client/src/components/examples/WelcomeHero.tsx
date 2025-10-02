import { WelcomeHero } from "../WelcomeHero";

export default function WelcomeHeroExample() {
  return (
    <WelcomeHero
      onSignUp={() => console.log("Sign up clicked")}
      onLogin={() => console.log("Login clicked")}
    />
  );
}
