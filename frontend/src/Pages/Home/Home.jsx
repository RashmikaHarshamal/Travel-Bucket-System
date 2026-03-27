import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Parallax, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";
import NavigationBar from "../../Components/NavigationBar/NavigationBar";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import LogIn from "../LogIn/LogIn";

const slides = [
  {
    bg: "/5.jpg",
    eyebrow: "Begin Your Story",
    heading: ["Map your", "Future", "Travels"],
    accent: "Interesting & Well Organized",
    tag: "travel",
  },
  {
    bg: "/2.jpg",
    eyebrow: "Chase Every Dream",
    heading: ["Build your", "Bucket", "List"],
    accent: "One Adventure at a Time",
    tag: "skills",
  },
  {
    bg: "/3.jpg",
    eyebrow: "Live Without Limits",
    heading: ["Track every", "Goal &", "Milestone"],
    accent: "Your Journey, Your Rules",
    tag: "fitness",
  },
];

const stats = [
  { icon: "✈️", value: "120+", label: "Destinations" },
  { icon: "🏆", value: "4.9★", label: "Rated" },
  { icon: "👥", value: "50K", label: "Dreamers" },
  { icon: "🎯", value: "98%", label: "Goals Met" },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    
    <div className="home-root">
      
      <NavigationBar />

      {/* ── MESH BG ── */}
      <div className="home-mesh" />
      <div className="home-grain" />

      {/* ── SWIPER ── */}
      <Swiper
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        parallax={true}
        speed={1600}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[Autoplay, Parallax, EffectFade]}
        className="home-swiper"
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            {/* BG image layer */}
            <div
              className="slide-bg"
              style={{ backgroundImage: `url('${slide.bg}')` }}
              data-swiper-parallax="-20%"
            />
            {/* Gradient overlay */}
            <div className="slide-overlay" />

            {/* Content */}
            <div className={`slide-content ${mounted ? "slide-content--in" : ""}`}>
              <p className="slide-eyebrow" data-swiper-parallax="-180">
                <span className="eyebrow-dot" /> {slide.eyebrow}
              </p>

              <h1 className="slide-heading" data-swiper-parallax="-300">
                {slide.heading[0]}{" "}
                <em>{slide.heading[1]}</em>
                <br />
                {slide.heading[2]}
              </h1>

              <p className="slide-accent" data-swiper-parallax="-420">
                {slide.accent}
              </p>

              <div className="slide-actions" data-swiper-parallax="-500">
                <button className="btn-hero-primary" onClick={() => navigate("/Login")}>
                  Start Your Journey
                  <span className="btn-arrow">→</span>
                </button>
                <button className="btn-hero-ghost">Explore Bucket Lists</button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom pagination */}
        <div className="home-pagination" slot="container-end">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`pag-dot ${i === activeIndex ? "pag-dot--active" : ""}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </Swiper>

      {/* ── FLOATING STAT ORBS ──
      <div className="home-orbs">
        {stats.map((s, i) => (
          <div className="home-orb" key={i} style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            <span className="home-orb__icon">{s.icon}</span>
            <span className="home-orb__value">{s.value}</span>
            <span className="home-orb__label">{s.label}</span>
          </div>
        ))}
      </div> */}

      {/* ── SCROLL CUE ── */}
      <div className="scroll-cue">
        <span className="scroll-cue__line" />
        <span className="scroll-cue__text">Scroll</span>
      </div>
    </div>
  );
}