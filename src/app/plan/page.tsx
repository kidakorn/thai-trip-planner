import type { Metadata } from "next";
import PlanForm from "@/src/components/PlanForm";
import { Map } from "lucide-react";

export const metadata: Metadata = {
  title: "วางแผนทริป",
  description:
    "กรอกข้อมูลเพื่อให้ Gemini AI สร้างแผนทริปไทยส่วนตัวสำหรับคุณ",
};

export default function PlanPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 4rem)",
        padding: "3rem 1.5rem",
        maxWidth: "44rem",
        margin: "0 auto",
      }}
    >
      {/* Page heading */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div
          style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "1rem",
            background: "linear-gradient(135deg, rgba(217,4,41,0.2), rgba(239,35,60,0.1))",
            border: "1px solid rgba(217,4,41,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}
        >
          <Map size={22} color="#d90429" aria-hidden="true" />
        </div>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 800,
            color: "#edf2f4",
            marginBottom: "0.5rem",
          }}
        >
          วางแผนทริป
        </h1>
        <p style={{ color: "#8d99ae", fontSize: "0.95rem" }}>
          กรอกข้อมูลเพื่อให้ AI สร้างแผนทริปส่วนตัวสำหรับคุณ
        </p>
      </div>

      {/* Form card */}
      <div className="card-glass" style={{ padding: "2rem" }}>
        <PlanForm />
      </div>
    </div>
  );
}
