"use client";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import PromptInput from "@/components/prompt-input";
import React, { useState } from "react";
import Header from "./header"
const LandingSection = () => {
  const [promptText, setPromptText] = useState<string>("");


  const suggestions = [
    {
      label: "Finance Tracker",
      icon: "🏦",
      value: `Finance app statistics screen. Current balance at top with dollar amount, bar chart showing spending over months (Oct–Mar) with month selector pills below, transaction list with app icons, amounts, and categories. Bottom navigation bar. Mobile app, single screen. Style: Light mode, bold and colorful. Dark gray/almost black background, no gradients, chunky rounded cards, playful but professional, modern sans-serif typography, Gen Z fintech vibe. Fun and fresh, not corporate.`,
    },
    {
      label: "Fitness Activity",
      icon: "🔥",
      value: `Fitness tracker summary screen. Large central circular progress ring showing steps and calories with neon glow. Line graph showing heart rate over time. Bottom section with grid of health metrics (Sleep, Water, SpO2). Mobile app, single screen. Style: Deep Dark Mode (OLED friendly). Pitch black background with electric neon green and vibrant blue accents. High contrast, data-heavy but organized, sleek and sporty aesthetic.`,
    },
    {
      label: "Food Delivery",
      icon: "🍔",
      value: `Food delivery home feed. Top search bar with location pin. Horizontal scrolling hero carousel of daily deals. Vertical list of restaurants with large delicious food thumbnails, delivery time badges, and rating stars. Floating Action Button (FAB) for cart. Mobile app, single screen. Style: Vibrant and Appetizing. Warm colors (orange, red, yellow), rounded card corners, subtle drop shadows to create depth. Friendly and inviting UI.`,
    },
    {
      label: "Travel Booking",
      icon: "✈️",
      value: `Travel destination detail screen. Full-screen immersive photography of a tropical beach. Bottom sheet overlay with rounded top corners containing hotel title, star rating, price per night, and a large 'Book Now' button. Horizontal scroll of amenity icons. Mobile app, single screen. Style: Minimalist Luxury. Ample whitespace, elegant serif typography for headings, clean sans-serif for body text. Sophisticated, airy, high-end travel vibe.`,
    },
    {
      label: "E-Commerce",
      icon: "👟",
      value: `Sneaker product page. Large high-quality product image on a light gray background. Color selector swatches, size selector grid, and a sticky 'Add to Cart' button at the bottom. Title and price in bold, oversized typography. Mobile app, single screen. Style: Neo-Brutalism. High contrast, thick black outlines on buttons and cards, hard shadows (no blur), unrefined geometry, bold solid colors (yellow and black). Trendy streetwear aesthetic.`,
    },
    {
      label: "Meditation",
      icon: "🧘",
      value: `Meditation player screen. Central focus is a soft, abstract breathing bubble animation. Play/Pause controls and a time slider below. Background is a soothing solid pastel sage green. Mobile app, single screen. Style: Soft Minimal. Rounded corners on everything, low contrast text for relaxation, pastel color palette, very little UI clutter. Zen, calming, and therapeutic atmosphere.`,
    },
  ];

  const handleSuggestionClick = (val: string) => {
    setPromptText(val);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col">
        <Header />
        <div className="relative overflow-hidden pt-28">
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
            <div className="space-y-3">
              <h1 className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
                Design mobile apps <br className="md:hidden" />
                <span className="text-primary">in minutes</span>
              </h1>
              <p className="mx-auto max-w-2xl text-center font-medium text-foreground leading-relaxed sm:text-lg">
                Go from idea to beautiful app mockups in minutes by chatting
                with AI.
              </p>
              <div className="flex w-full max-w-3xl flex-col items-center gap-8 relative z-50">
                <div className="w-full">
                  <PromptInput
                    className="ring-2 ring-primary"
                    promptText={promptText}
                    setPromptText={setPromptText}
                    isLoading={false}
                    onSubmit={() => {}}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2 px-5">
                  <Suggestions>
                    {suggestions.map((s) => (
                      <Suggestion
                        key={s.label}
                        suggestion={s.label}
                        className="text-xs! h-7! px-2.5 pt-1!"
                        onClick={() => handleSuggestionClick(s.value)}
                      >
                        {s.icon}
                        <span>{s.label}</span>
                      </Suggestion>
                    ))}
                  </Suggestions>
                </div>
              </div>

              <div
                className="absolute -translate-x-1/2 
                    left-1/2 w-[5000px] h-[3000px] top-[80%]
                    -z-10 "
              >
                <div
                  className="-translate-x-1/2 absolute 
                      bottom-[calc(100%-300px)] left-1/2 
                      h-[2000px] w-[2000px]
                      opacity-20 bg-radial-primary"
                ></div>
                <div
                  className="absolute -mt-2.5 
                      size-full rounded-[50%] 
                      bg-primary/20 opacity-70
                      [box-shadow:0_-15px_24.8px_var(--primary)]"
                ></div>
                <div
                  className="absolute z-0 size-full 
                      rounded-[50%] bg-background"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full py-10">
          <div className="mx-auto max-w-3xl">
            <div>
              <h1
                className="font-medium text-xl
              tracking-tight"
              >
                Recent Projects
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;
