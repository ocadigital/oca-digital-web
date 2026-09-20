import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'marquee': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-50%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'marquee': 'marquee 40s linear infinite'
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'none',
						'--tw-prose-body': 'hsl(var(--foreground) / 0.86)',
						'--tw-prose-headings': 'hsl(var(--foreground))',
						'--tw-prose-lead': 'hsl(var(--muted-foreground))',
						'--tw-prose-links': 'hsl(var(--primary))',
						'--tw-prose-bold': 'hsl(var(--foreground))',
						'--tw-prose-counters': 'hsl(var(--primary))',
						'--tw-prose-bullets': 'hsl(var(--primary))',
						'--tw-prose-hr': 'hsl(var(--border))',
						'--tw-prose-quotes': 'hsl(var(--foreground))',
						'--tw-prose-quote-borders': 'hsl(var(--primary))',
						'--tw-prose-captions': 'hsl(var(--muted-foreground))',
						'--tw-prose-th-borders': 'hsl(var(--border))',
						'--tw-prose-td-borders': 'hsl(var(--border))',
						a: {
							textDecoration: 'underline',
							textUnderlineOffset: '3px',
							textDecorationColor: 'hsl(var(--primary) / 0.45)',
							fontWeight: '500',
						},
						'a:hover': { textDecorationColor: 'hsl(var(--primary))' },
						h2: {
							fontWeight: '700',
							letterSpacing: '-0.01em',
							marginTop: '2.4em',
							marginBottom: '0.7em',
							paddingTop: '1.4em',
							borderTop: '1px solid hsl(var(--border))',
						},
						'h2:first-child': { marginTop: '0', paddingTop: '0', borderTop: '0' },
						h3: { fontWeight: '600', marginTop: '1.8em', marginBottom: '0.5em' },
						img: { borderRadius: '0.75rem' },
						figure: { marginTop: '2.2em', marginBottom: '2.2em' },
						'figure img': {
							maxWidth: '640px',
							width: '100%',
							height: 'auto',
							marginTop: '0',
							marginBottom: '0',
							marginLeft: 'auto',
							marginRight: 'auto',
							border: '1px solid hsl(var(--border))',
						},
						figcaption: { textAlign: 'center', marginTop: '0.9em', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' },
						li: { marginTop: '0.4em', marginBottom: '0.4em' },
						'li::marker': { fontWeight: '600' },
						table: {
							display: 'block',
							overflowX: 'auto',
							fontSize: '0.9em',
							lineHeight: '1.5',
						},
						thead: { borderBottomColor: 'hsl(var(--primary) / 0.5)' },
						'thead th': {
							textAlign: 'left',
							color: 'hsl(var(--foreground))',
							fontWeight: '600',
							padding: '0.75em 1em',
							backgroundColor: 'hsl(var(--card))',
							whiteSpace: 'nowrap',
						},
						'tbody td': { padding: '0.75em 1em', verticalAlign: 'top' },
						'thead th:first-child': { paddingLeft: '1em' },
						'tbody td:first-child': { paddingLeft: '1em' },
						'thead th:last-child': { paddingRight: '1em' },
						'tbody td:last-child': { paddingRight: '1em' },
						'tbody tr:hover': { backgroundColor: 'hsl(var(--card) / 0.6)' },
					},
				},
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
