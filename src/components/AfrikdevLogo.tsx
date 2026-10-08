import React from 'react';

interface AfrikdevLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AfrikdevLogo: React.FC<AfrikdevLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span
        className={`relative inline-flex items-center justify-center rounded-xl bg-white p-1 shadow-md shadow-blue-950/30 border border-blue-500/20 shrink-0 ${dimensions}`}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          role="img"
          aria-label="Logo Afrique AFRIKDEV"
        >
          {/* Detailed Vector of the uploaded Blue Africa 'AFRIKDEV' Stencil Logo */}
          <g fill="#0A66E8">
            {/* North-West Africa Crown (Morocco, Algeria, Tunisia) */}
            <path d="M 45,146 C 54,125 65,112 72,96 C 85,84 96,82 104,62 C 118,46 128,38 145,42 C 165,36 184,26 205,28 C 218,32 222,40 214,52 C 228,60 238,68 248,74 L 45,146 Z" />

            {/* Diagonal Ribbon Above 'FRI' & Red Sea Cap */}
            <path d="M 164,109 L 258,76 C 268,74 276,82 284,102 L 172,142 C 176,125 172,115 164,109 Z" />
            <path d="M 282,82 C 292,72 305,68 314,76 C 324,84 335,88 340,94 C 332,104 316,112 302,116 C 292,106 284,94 282,82 Z" />

            {/* Stylized Letter 'A' forming West Africa Coast (Senegal to Ivory Coast) */}
            <path
              fillRule="evenodd"
              d="M 32,248 C 28,236 42,208 72,175 C 102,142 132,114 146,108 C 156,106 166,110 166,118 C 162,148 156,192 165,244 C 168,258 154,266 142,262 C 134,256 128,238 126,216 C 104,218 82,226 56,248 C 44,258 34,260 32,248 Z M 106,192 L 134,148 L 128,190 Z"
            />
            {/* Gulf of Guinea Coastal Accent */}
            <path d="M 73,245 C 82,238 92,248 102,258 C 110,256 115,260 112,266 C 102,270 96,274 90,268 C 82,260 76,252 73,245 Z" />

            {/* Stylized Letter 'F' */}
            <path d="M 162,158 C 185,146 212,135 232,126 C 228,142 222,154 214,160 L 188,172 L 182,190 L 208,180 C 206,192 202,202 194,208 L 176,215 C 172,232 172,246 176,258 C 166,254 158,242 156,225 C 155,204 158,180 162,158 Z" />

            {/* Stylized Letter 'R' */}
            <path
              fillRule="evenodd"
              d="M 232,134 C 254,120 282,112 296,118 C 308,124 308,142 296,158 C 286,170 274,176 264,180 C 272,192 278,206 284,218 C 274,224 264,228 256,226 C 250,214 246,198 240,186 L 232,190 C 226,212 218,234 206,252 L 194,254 C 204,220 218,174 232,134 Z M 248,166 C 262,162 274,154 276,144 C 276,136 266,136 254,142 Z"
            />

            {/* Stylized Letter 'I' */}
            <path d="M 316,118 C 324,112 336,116 340,124 C 328,154 316,184 306,214 C 296,218 288,216 284,210 C 294,180 306,148 316,118 Z" />

            {/* Stylized Letter 'K' & Horn of Africa */}
            <path d="M 352,96 C 362,92 372,98 376,106 L 352,150 L 392,114 C 400,118 405,126 400,134 L 368,162 L 394,160 C 406,164 416,170 418,176 C 414,184 398,190 380,196 L 348,178 L 336,204 C 326,206 318,204 315,198 C 328,164 340,130 352,96 Z" />

            {/* Diagonal Divider Bar Above 'DEV' */}
            <path d="M 332,216 L 430,180 C 434,180 436,184 432,188 L 342,222 Z" />

            {/* Left Central Africa Shoulder & Stylized 'D' */}
            <path d="M 173,268 C 218,244 265,222 302,218 C 328,216 344,234 342,265 C 338,298 312,330 272,348 C 252,356 235,360 226,358 C 242,326 258,285 268,248 C 278,244 292,244 295,254 C 298,270 288,302 266,324 C 258,332 250,335 246,334 C 256,304 264,276 268,248 L 178,286 C 174,280 171,274 173,268 Z" />
            <path d="M 189,292 L 254,260 C 258,262 258,270 255,282 C 248,308 236,334 225,352 C 220,342 218,332 210,326 C 210,312 204,304 194,302 C 190,298 188,295 189,292 Z" />

            {/* Stylized Letter 'E' */}
            <path d="M 358,225 L 408,206 C 410,214 408,222 400,226 L 372,238 L 366,255 L 395,244 C 398,250 396,258 388,262 L 360,274 L 354,292 L 402,272 C 406,280 404,290 396,295 L 336,318 C 344,286 352,255 358,225 Z" />

            {/* Stylized Letter 'V' */}
            <path d="M 404,205 C 412,202 420,206 422,214 L 426,262 L 454,186 C 462,178 474,180 472,192 L 428,304 C 422,312 412,312 408,304 L 404,205 Z" />

            {/* Southern Africa Diagonal Stripes (Angola, Zambia, Namibia, South Africa) */}
            <path d="M 216,374 C 278,350 348,318 408,288 C 394,305 384,318 380,328 C 374,332 370,338 375,346 C 325,372 272,395 224,412 C 216,396 212,384 216,374 Z" />
            <path d="M 284,398 L 374,358 C 375,368 374,378 368,386 L 232,430 L 228,420 L 325,382 Z" />
            <path d="M 236,435 L 366,392 C 362,404 356,416 346,424 C 338,430 332,436 332,444 C 325,452 318,460 312,468 C 296,476 280,480 264,480 C 254,475 250,466 248,455 C 242,448 238,442 236,435 Z" />

            {/* Madagascar Island Silhouette */}
            <path d="M 422,354 C 428,354 430,364 428,374 C 422,388 418,404 412,418 C 406,432 396,442 388,438 C 382,434 382,422 385,410 C 384,398 390,386 398,376 C 406,368 414,354 422,354 Z" />
          </g>
        </svg>
      </span>
      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight font-display text-emerald-500 hover:text-emerald-400 transition-colors">
          AFRIKDEV
        </span>
      )}
    </span>
  );
};
