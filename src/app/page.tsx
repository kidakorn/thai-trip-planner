import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Map, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Thai Trip Planner — วางแผนทริปไทยด้วย AI",
  description:
    "บอก AI ว่าอยากไปไหน มีงบเท่าไหร่ ชอบสไตล์ไหน รับแผนทริปส่วนตัวพร้อมแผนที่ทันที ฟรีทั้งหมด",
};

const POPULAR_PROVINCES = [
  { name: "เชียงใหม่", nameEn: "Chiang Mai", vibe: "วัฒนธรรม · ธรรมชาติ" },
  { name: "ภูเก็ต", nameEn: "Phuket", vibe: "ทะเล · Party" },
  { name: "เชียงราย", nameEn: "Chiang Rai", vibe: "วัด · ธรรมชาติ" },
  { name: "กระบี่", nameEn: "Krabi", vibe: "หาด · ทะเล" },
  { name: "กรุงเทพมหานคร", nameEn: "Bangkok", vibe: "เมือง · อาหาร" },
  { name: "กาญจนบุรี", nameEn: "Kanchanaburi", vibe: "ธรรมชาติ · ประวัติศาสตร์" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    titleTh: "กรอกความต้องการ",
    titleEn: "Fill In Preferences",
    descTh: "เลือกจังหวัด วันที่ งบประมาณ และสไตล์การเดินทางที่ต้องการ",
    icon: Map,
  },
  {
    step: "02",
    titleTh: "AI สร้างแผนทริป",
    titleEn: "AI Builds Your Plan",
    descTh: "Gemini AI วิเคราะห์และสร้างแผนทริปที่เหมาะกับคุณโดยเฉพาะ",
    icon: Zap,
  },
  {
    step: "03",
    titleTh: "ดูบนแผนที่ พร้อมจอง",
    titleEn: "Map View + Book",
    descTh: "แผนทริปแสดงบนแผนที่ พร้อมลิงก์จองที่พักและกิจกรรมทันที",
    icon: Star,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        aria-label="Hero"
        style={{
          minHeight: "calc(100vh - 4rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217,4,41,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "52rem" }}>
          {/* Free badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              background: "rgba(217, 4, 41, 0.1)",
              border: "1px solid rgba(217, 4, 41, 0.3)",
              color: "#d90429",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              letterSpacing: "0.04em",
            }}
          >
            <Star size={12} aria-hidden="true" />
            ฟรีทั้งหมด — ไม่มีค่าใช้จ่าย
          </div>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1.25rem",
              color: "#edf2f4",
            }}
          >
            วางแผนทริปไทย
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #d90429, #ff6b6b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ด้วย AI
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "#8d99ae",
              lineHeight: 1.75,
              marginBottom: "2.5rem",
              maxWidth: "38rem",
              margin: "0 auto 2.5rem",
            }}
          >
            บอก AI ว่าอยากไปไหน มีงบเท่าไหร่ ชอบสไตล์ไหน
            แล้วรับแผนทริปส่วนตัวพร้อมแผนที่ทันที
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/plan"
              className="btn-primary-custom"
              style={{
                padding: "0.85rem 2rem",
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
              aria-label="Start planning a trip"
            >
              เริ่มวางแผน
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/places"
              style={{
                padding: "0.85rem 2rem",
                fontSize: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#edf2f4",
                transition: "border-color 0.2s, background 0.2s",
              }}
              aria-label="Browse all places"
            >
              ดูสถานที่ทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        aria-label="How it works"
        style={{
          padding: "5rem 1.5rem",
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            textAlign: "center",
            marginBottom: "3rem",
            color: "#edf2f4",
          }}
        >
          ใช้งานอย่างไร
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {HOW_IT_WORKS.map(({ step, titleTh, descTh, icon: Icon }) => (
            <div
              key={step}
              className="card-glass"
              style={{ padding: "1.75rem", textAlign: "center" }}
            >
              <div
                aria-hidden="true"
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
                <Icon size={22} color="#d90429" />
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#d90429",
                  letterSpacing: "0.12em",
                  marginBottom: "0.4rem",
                }}
              >
                STEP {step}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#edf2f4",
                  marginBottom: "0.5rem",
                }}
              >
                {titleTh}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#8d99ae", lineHeight: 1.65 }}>
                {descTh}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Provinces */}
      <section
        aria-label="Popular provinces"
        style={{
          padding: "0 1.5rem 5rem",
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            marginBottom: "2rem",
            color: "#edf2f4",
          }}
        >
          จังหวัดยอดนิยม
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {POPULAR_PROVINCES.map(({ name, nameEn, vibe }) => (
            <Link
              key={name}
              href={`/plan?province=${encodeURIComponent(name)}`}
              style={{ textDecoration: "none" }}
              aria-label={`Plan a trip to ${nameEn}`}
            >
              <div
                className="card-glass"
                style={{
                  padding: "1.25rem",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#edf2f4",
                    marginBottom: "0.2rem",
                  }}
                >
                  {name}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#8d99ae" }}>{nameEn}</p>
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    color: "#d90429",
                    fontWeight: 500,
                  }}
                >
                  {vibe}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
