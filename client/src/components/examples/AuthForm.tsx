import { useState } from "react";
import { AuthForm } from "../AuthForm";

export default function AuthFormExample() {
  const [mode, setMode] = useState<"signup" | "login">("signup");

  return (
    <AuthForm
      mode={mode}
      onSubmit={(data) => console.log("Form submitted:", data)}
      onSwitchMode={() => setMode(mode === "signup" ? "login" : "signup")}
    />
  );
}
