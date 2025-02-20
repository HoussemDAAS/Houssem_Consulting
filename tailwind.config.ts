import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		
		keyframes: {
			'scroll-text': {
			  '0%, 100%': { transform: 'translateY(0)' },
			  '50%': { transform: 'translateY(-100%)' },
			},
			'gradient-move': {
				'0%': { backgroundPosition: '0% 0%' },
				'100%': { backgroundPosition: '100% 100%' }
			  },
			'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
			marquee: {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' },
			  }
		  },
		  animation: {
			'scroll-text': 'scroll-text 6s infinite ease-in-out',
			marquee: 'marquee 20s linear infinite',
			'infinite-scroll': 'infinite-scroll 25s linear infinite',
			'gradient-move': 'gradient-move 20s linear infinite',
		  },
		
  		colors: {
			primaryColor: "#0b0b0b",  // Deep Black
			secondaryColor: "#ccbeac", // Warm Beige
			accentColor: "#f9f9f4",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
		
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
	  fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
