import { cn } from '@/lib/utils';
import React from 'react';

export const NeutronIcon = ({ className }: { className?: string }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
		fill="none"
		className={cn("w-8 h-8", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1202_6016)">
      <rect width="48" height="48" rx="5" fill="#10B981" />
      <rect width="48" height="48" fill="url(#paint0_linear_1202_6016)" />
      <g filter="url(#filter0_d_1202_6016)">
        <path
          opacity="0.4"
          d="M39 30V18C39 13.0294 34.9706 9 30 9H18L9 18H25.5C27.9853 18 30 20.0147 30 22.5L30 39L39 30Z"
          fill="url(#paint1_linear_1202_6016)"
        />
        <path
          d="M9 18L9 30C9 34.9706 13.0294 39 18 39H30L39 30L24 30C20.6863 30 18 27.3137 18 24L18 9L9 18Z"
          fill="url(#paint2_linear_1202_6016)"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_1202_6016"
        x="6"
        y="5.25"
        width="36"
        height="42"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology radius="1.5" operator="erode" in="SourceAlpha" result="effect1_dropShadow_1202_6016" />
        <feOffset dy="2.25" />
        <feGaussianBlur stdDeviation="2.25" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1202_6016" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1202_6016" result="shape" />
      </filter>
      <linearGradient
        id="paint0_linear_1202_6016"
        x1="24"
        y1="5.96047e-07"
        x2="26"
        y2="48"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0" />
        <stop offset="1" stopColor="white" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_1202_6016"
        x1="24"
        y1="9"
        x2="24"
        y2="39"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.8" />
        <stop offset="1" stopColor="white" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_1202_6016"
        x1="24"
        y1="9"
        x2="24"
        y2="39"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.8" />
        <stop offset="1" stopColor="white" stopOpacity="0.5" />
      </linearGradient>
      <clipPath id="clip0_1202_6016">
        <rect width="48" height="48" rx="5" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
