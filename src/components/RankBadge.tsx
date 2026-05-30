import React from "react";

interface RankBadgeProps {
  rankName: string;
  className?: string;
  size?: number;
}

const getRankColors = (rank: string) => {
  // Base default is the SVIP / rank 1 described:
  // Shield frame: Light silver #E8F0F8
  // Circle fill: Blue gradient #4AA3FF to #1E5DBF
  // Highlights: #B8E0FF

  if (rank === "VIP0") return { frame: "#B0BEC5", circleStart: "#90A4AE", circleEnd: "#546E7A", ribbon: "#607D8B", accent: "#CFD8DC" };
  if (rank === "VIP1") return { frame: "#D7CCC8", circleStart: "#BCAAA4", circleEnd: "#8D6E63", ribbon: "#795548", accent: "#EFEBE9" };
  if (rank === "VIP2") return { frame: "#F5F5F5", circleStart: "#E0E0E0", circleEnd: "#9E9E9E", ribbon: "#757575", accent: "#FFFFFF" };
  if (rank === "VIP3") return { frame: "#E8F0F8", circleStart: "#90CAF9", circleEnd: "#1976D2", ribbon: "#1565C0", accent: "#BBDEFB" };
  if (rank === "VIP4") return { frame: "#FFF9C4", circleStart: "#FFF176", circleEnd: "#FBC02D", ribbon: "#F57F17", accent: "#FFFDE7" };
  if (rank === "VIP5") return { frame: "#FFE082", circleStart: "#FFCA28", circleEnd: "#FF8F00", ribbon: "#FF6F00", accent: "#FFF8E1" };
  if (rank === "VIP6") return { frame: "#E0F2F1", circleStart: "#80CBC4", circleEnd: "#00897B", ribbon: "#00695C", accent: "#E0F2F1" };
  if (rank === "VIP7") return { frame: "#E1BEE7", circleStart: "#CE93D8", circleEnd: "#8E24AA", ribbon: "#6A1B9A", accent: "#F3E5F5" };
  if (rank === "VIP8") return { frame: "#FFCDD2", circleStart: "#EF9A9A", circleEnd: "#E53935", ribbon: "#C62828", accent: "#FFEBEE" };
  if (rank === "VIP9") return { frame: "#C5CAE9", circleStart: "#9FA8DA", circleEnd: "#3949AB", ribbon: "#283593", accent: "#E8EAF6" };
  if (rank === "VIP10") return { frame: "#C8E6C9", circleStart: "#A5D6A7", circleEnd: "#43A047", ribbon: "#2E7D32", accent: "#E8F5E9" };
  
  if (rank.startsWith("SVIP")) {
    const num = parseInt(rank.replace("SVIP", ""));
    // A progression of intense gradients
    const svipHues = [
      { frame: "#E8F0F8", circleStart: "#4AA3FF", circleEnd: "#1E5DBF", ribbon: "#0D47A1", accent: "#B8E0FF" }, // SVIP1
      { frame: "#FCE4EC", circleStart: "#F48FB1", circleEnd: "#D81B60", ribbon: "#AD1457", accent: "#FCE4EC" }, // SVIP2
      { frame: "#FFF3E0", circleStart: "#FFB74D", circleEnd: "#EF6C00", ribbon: "#E65100", accent: "#FFF3E0" }, // SVIP3
      { frame: "#E8EAF6", circleStart: "#7986CB", circleEnd: "#303F9F", ribbon: "#1A237E", accent: "#C5CAE9" }, // SVIP4
      { frame: "#EFEBE9", circleStart: "#BCAAA4", circleEnd: "#6D4C41", ribbon: "#4E342E", accent: "#D7CCC8" }, // SVIP5
      { frame: "#F3E5F5", circleStart: "#BA68C8", circleEnd: "#7B1FA2", ribbon: "#4A148C", accent: "#E1BEE7" }, // SVIP6
      { frame: "#E0F7FA", circleStart: "#4DD0E1", circleEnd: "#0097A7", ribbon: "#006064", accent: "#B2EBF2" }, // SVIP7
      { frame: "#F9FBE7", circleStart: "#DCE775", circleEnd: "#AFB42B", ribbon: "#827717", accent: "#F0F4C3" }, // SVIP8
      { frame: "#ECEFF1", circleStart: "#90A4AE", circleEnd: "#455A64", ribbon: "#263238", accent: "#CFD8DC" }, // SVIP9
      { frame: "#FFFDE7", circleStart: "#FFF59D", circleEnd: "#FBC02D", ribbon: "#F57F17", accent: "#FFF9C4" }, // SVIP10
    ];
    return svipHues[Math.min(num - 1, 9)] || svipHues[0];
  }
  
  if (rank === "Crown") {
    return { frame: "#FFECB3", circleStart: "#FFCA28", circleEnd: "#D84315", ribbon: "#BF360C", accent: "#FFF8E1" };
  }
  
  if (rank === "City Agent") {
    return { frame: "#E1F5FE", circleStart: "#03A9F4", circleEnd: "#01579B", ribbon: "#0277BD", accent: "#B3E5FC" };
  }

  return { frame: "#E8F0F8", circleStart: "#4AA3FF", circleEnd: "#1E5DBF", ribbon: "#1565C0", accent: "#B8E0FF" };
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rankName, className = "", size = 120 }) => {
  const colors = getRankColors(rankName);
  
  const formattedRank = rankName
    .replace("VIP", "V")
    .replace("SVIP", "S")
    .replace("Crown", "CRW")
    .replace("City Agent", "AGT");

  const gradientId = `badge-grad-${rankName.replace(/\s+/g, '-')}`;

  return (
    <svg 
      width={size} 
      height={size * 1.2} 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.circleStart} />
          <stop offset="100%" stopColor={colors.circleEnd} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="innerGlow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
          <feFlood floodColor="white" floodOpacity="0.5"/>
          <feComposite in2="blur" operator="in"/>
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
        </filter>
      </defs>

      {/* Frame / Shield */}
      <path 
        d="M20 10 L80 10 L95 45 L50 110 L5 45 Z" 
        fill={colors.frame} 
        stroke={colors.accent} 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      
      {/* Inner Shield Bevel/Detail */}
      <path 
        d="M25 15 L75 15 L88 45 L50 100 L12 45 Z" 
        fill="url(#glow)" 
        fillOpacity="0.1" 
        stroke="#FFFFFF" 
        strokeOpacity="0.3" 
        strokeWidth="1.5" 
      />

      {/* Wings / Laurel accents */}
      <g stroke={colors.accent} strokeWidth="1.5" fill="none">
        <path d="M 12 40 Q 25 25 35 30" />
        <path d="M 10 50 Q 25 35 32 42" />
        <path d="M 88 40 Q 75 25 65 30" />
        <path d="M 90 50 Q 75 35 68 42" />
      </g>

      {/* Medallion Circle */}
      <circle cx="50" cy="45" r="28" fill={`url(#${gradientId})`} stroke={colors.accent} strokeWidth="3" />
      
      {/* Inner circle detail */}
      <circle cx="50" cy="45" r="24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

      {/* Ribbon */}
      <path 
        d="M 15 75 L 85 75 L 90 85 L 80 88 L 50 95 L 20 88 L 10 85 Z" 
        fill={colors.ribbon} 
        stroke={colors.accent} 
        strokeWidth="1.5" 
        strokeLinejoin="round" 
      />
      
      {/* Diamond on Ribbon */}
      <path 
        d="M 50 82 L 56 88 L 50 94 L 44 88 Z" 
        fill={colors.accent} 
      />

      {/* Rank Text */}
      <text 
        x="50" 
        y="53" 
        fontFamily="sans-serif" 
        fontWeight="800" 
        fontSize={formattedRank.length > 2 ? "14" : "22"} 
        fill="#FFFFFF" 
        textAnchor="middle" 
        filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.5))"
      >
        {formattedRank}
      </text>
      
      {/* Small "Rank" text on Ribbon */}
      <text 
        x="50" 
        y="83" 
        fontFamily="sans-serif" 
        fontWeight="bold" 
        fontSize="6" 
        fill="#FFFFFF" 
        textAnchor="middle"
        letterSpacing="1"
      >
        RANK
      </text>
    </svg>
  );
};
