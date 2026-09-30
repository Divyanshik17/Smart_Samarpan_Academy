import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Rahul Sharma",
      position: "JEE Main & Advanced Aspirant",
      message:
        "The AI quiz generator and concept breakdowns are incredible! I was able to identify my weak spots in Integral Calculus and improve my mock test score by 35 marks.",
      logoUrl: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=172554&color=fff",
      stars: 5,
    },
    {
      id: 2,
      name: "Priya Patel",
      position: "Olympiad & Class 11 Student",
      message:
        "The step-by-step problem walkthroughs make complex Coordinate Geometry so easy to grasp. The faculty genuinely cares about making fundamentals rock solid.",
      logoUrl: "https://ui-avatars.com/api/?name=Priya+Patel&background=0F766E&color=fff",
      stars: 5,
    },
    {
      id: 3,
      name: "Amit Kumar",
      position: "CBSE Class 10 (Scored 98/100)",
      message:
        "Before joining Samarpan, math was my most stressful subject. The structured chapter practice and formula sheets helped me score 98% in my Board exams!",
      logoUrl: "https://ui-avatars.com/api/?name=Amit+Kumar&background=D97706&color=fff",
      stars: 5,
    },
    {
      id: 4,
      name: "Neha Singh",
      position: "Class 12 Board Aspirant",
      message:
        "The formula generator and quick revision notes are lifesavers before exams. I can revise three whole units in less than an hour with full confidence.",
      logoUrl: "https://ui-avatars.com/api/?name=Neha+Singh&background=0284C7&color=fff",
      stars: 5,
    },
    {
      id: 5,
      name: "Vikram Gupta",
      position: "Class 12 Student & JEE Aspirant",
      message:
        "The personalized AI recommendations feel like having a personal mentor by your side 24/7. Truly the best mathematics platform for serious students.",
      logoUrl: "https://ui-avatars.com/api/?name=Vikram+Gupta&background=475569&color=fff",
      stars: 5,
    },
  ];

  return (
    <div className="sma-testimonials-wrap">
      <div className="sma-testimonials-slider">
        {testimonialsData.map((e) => (
          <div className="sma-testimonial-card" key={e.id}>
            <div className="sma-testimonial-quote-icon">
              <FaQuoteLeft />
            </div>

            <div className="sma-testimonial-stars">
              {Array.from({ length: e.stars }).map((_, idx) => (
                <FaStar key={idx} className="sma-star-icon" />
              ))}
            </div>

            {/* Testimonial Message */}
            <p className="sma-testimonial-msg">"{e.message}"</p>

            {/* Student Info */}
            <div className="sma-testimonial-author">
              <img
                src={e.logoUrl}
                alt={e.name}
                className="sma-testimonial-avatar"
              />
              <div className="sma-testimonial-meta">
                <div className="sma-testimonial-name">{e.name}</div>
                <div className="sma-testimonial-role">{e.position}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;