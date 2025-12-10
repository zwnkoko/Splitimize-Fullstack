import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowWrapperProps {
  children: ReactNode;
  isGlowing?: boolean;
  className?: string;
  intensity?: "medium" | "high";
  speed?: "normal" | "fast";
}

export function GlowWrapper({
  children,
  isGlowing = false,
  className,
  intensity = "medium",
  speed = "normal",
}: GlowWrapperProps) {
  const getGlowSize = () => {
    switch (intensity) {
      case "medium":
        return { min: 15, max: 25 };
      case "high":
        return { min: 25, max: 40 };
      default:
        return { min: 15, max: 25 };
    }
  };

  const getAnimationDuration = () => {
    switch (speed) {
      case "normal":
        return "3s";
      case "fast":
        return "1.8s";
      default:
        return "3s";
    }
  };

  const glowSize = getGlowSize();
  const animationDuration = getAnimationDuration();

  return (
    <>
      {isGlowing && (
        <style>{`
          @keyframes pulse-glow-${speed}-${intensity} {
            0% {
              filter: drop-shadow(0 0 ${
                glowSize.min
              }px rgba(59, 130, 246, 0.6)) 
                     drop-shadow(0 0 ${
                       glowSize.min * 1.5
                     }px rgba(139, 92, 246, 0.4));
            }
            25% {
              filter: drop-shadow(0 0 ${
                glowSize.max
              }px rgba(139, 92, 246, 0.7)) 
                     drop-shadow(0 0 ${
                       glowSize.max * 1.5
                     }px rgba(236, 72, 153, 0.5));
            }
            50% {
              filter: drop-shadow(0 0 ${
                glowSize.min
              }px rgba(236, 72, 153, 0.6)) 
                     drop-shadow(0 0 ${
                       glowSize.min * 1.5
                     }px rgba(16, 185, 129, 0.4));
            }
            75% {
              filter: drop-shadow(0 0 ${
                glowSize.max
              }px rgba(16, 185, 129, 0.7)) 
                     drop-shadow(0 0 ${
                       glowSize.max * 1.5
                     }px rgba(59, 130, 246, 0.5));
            }
            100% {
              filter: drop-shadow(0 0 ${
                glowSize.min
              }px rgba(59, 130, 246, 0.6)) 
                     drop-shadow(0 0 ${
                       glowSize.min * 1.5
                     }px rgba(139, 92, 246, 0.4));
            }
          }
          
          @keyframes shimmer-rotate {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      )}
      <div
        className={cn("relative rounded-md", className)}
        style={{
          animation: isGlowing
            ? `pulse-glow-${speed}-${intensity} ${animationDuration} ease-in-out infinite`
            : "none",
        }}
      >
        {isGlowing && (
          <div
            className="absolute inset-0 rounded-md opacity-30 -z-10"
            style={{
              background:
                "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #3b82f6)",
              backgroundSize: "200% 200%",
              animation: `shimmer-rotate ${animationDuration} ease-in-out infinite`,
              filter: `blur(${intensity === "high" ? "20px" : "12px"})`,
            }}
          />
        )}
        {children}
      </div>
    </>
  );
}
