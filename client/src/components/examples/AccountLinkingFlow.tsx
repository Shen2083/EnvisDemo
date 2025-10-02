import { AccountLinkingFlow } from "../AccountLinkingFlow";

export default function AccountLinkingFlowExample() {
  return (
    <AccountLinkingFlow
      onComplete={(accounts) => console.log("Connected accounts:", accounts)}
    />
  );
}
