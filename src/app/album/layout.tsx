import { AlbumProvider } from "@/contexts/AlbumContext";

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return <AlbumProvider>{children}</AlbumProvider>;
}
