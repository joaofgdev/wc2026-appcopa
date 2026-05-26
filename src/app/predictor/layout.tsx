import { PredictorProvider } from "./PredictorContext";

export default function PredictorLayout({ children }: { children: React.ReactNode }) {
  return (
    <PredictorProvider>
      {children}
    </PredictorProvider>
  );
}
