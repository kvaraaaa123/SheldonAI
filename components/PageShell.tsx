"use client";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PageShellProps = {
  children: React.ReactNode;
  userEmail?: string;
  activeSection?: string;
};

export default function PageShell({ children, userEmail }: PageShellProps) {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const bg = isDark ? "#080810" : "#FAFAF8";
  const surface = isDark ? "#0f0f1a" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#FAFAF5" : "#0a0a12";
  const muted = isDark ? "rgba(250,250,245,0.5)" : "rgba(10,10,18,0.45)";
  const gold = isDark ? "#C9A96E" : "#9a7040";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 56, borderBottom: `0.5px solid ${border}`,
        background: surface, position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, color: text, letterSpacing: "-0.5px" }}>
              Sheldon<span style={{ color: gold }}>AI</span>
            </span>
          </button>
          <button onClick={() => router.push("/dashboard")} style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, color: muted, background: "none", border: "none",
            cursor: "pointer", padding: "4px 8px", borderRadius: 6,
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 10 }}>←</span> Dashboard
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {userEmail && <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>}
          <button onClick={toggleTheme} style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 15, padding: "4px 6px" }}>
            {isDark ? "☀" : "☽"}
          </button>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: `0.5px solid ${border}`, cursor: "pointer", padding: "5px 10px", borderRadius: 6 }}>
            Sign out
          </button>
        </div>
      </nav>
      <main style={{ padding: "0" }}>
        {children}
      </main>
    </div>
  );
}
