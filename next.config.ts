import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 30
		}
	},
	serverExternalPackages: ['@node-rs/argon2'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.ufs.sh', // поддомены uploadthing
				pathname: '/f/*'
			}
		]
	},
	rewrites: async () => {
		return [
			{
				source: '/hashtag/:tag',
				destination: '/search?q=%23:tag'
			}
		]
	}
}

export default nextConfig
