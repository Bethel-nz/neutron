import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <svg
            width='96'
            height='96'
            viewBox='0 0 48 48'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{
              flexShrink: 0,
            }}
          >
            <rect width='48' height='48' rx='5' fill='#10B981' />
            <g>
              <path
                opacity='0.4'
                d='M39 30V18C39 13.0294 34.9706 9 30 9H18L9 18H25.5C27.9853 18 30 20.0147 30 22.5L30 39L39 30Z'
                fill='white'
                fillOpacity='0.8'
              />
              <path
                d='M9 18L9 30C9 34.9706 13.0294 39 18 39H30L39 30L24 30C20.6863 30 18 27.3137 18 24L18 9L9 18Z'
                fill='white'
                fillOpacity='0.8'
              />
            </g>
          </svg>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bolder',
                color: '#111827',
                margin: 0,
                lineHeight: 1,
              }}
            >
              Neutron
            </h1>
            <p
              style={{
                fontSize: '28px',
                color: '#6B7280',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Organize your bookmarks with ease
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
