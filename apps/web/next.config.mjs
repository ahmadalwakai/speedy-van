import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	// Image optimization with AVIF/WebP support
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 31536000, // 1 year
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Performance optimizations
	compiler: {
		// Remove console logs in production
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// Enable experimental features for better performance
	experimental: {
		optimizeCss: true,
		optimizePackageImports: ['@chakra-ui/react', '@chakra-ui/icons', 'react-icons'],
		webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
	},
	// Add headers for CSP and Pusher
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
							"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
							"img-src 'self' data: blob: https: https://api.qrserver.com https://via.placeholder.com",
							"font-src 'self' data: https://fonts.gstatic.com",
							"connect-src 'self' https://*.pusherapp.com https://*.pusher.com wss://*.pusherapp.com wss://*.pusher.com https://api.postcodes.io https://www.googletagmanager.com",
							"frame-src 'self'",
							"object-src 'none'",
							"base-uri 'self'",
							"form-action 'self'",
							"frame-ancestors 'self'",
							"upgrade-insecure-requests"
						].join('; ')
					}
				]
			}
		];
	},
	// Rewrite rules for production
	async rewrites() {
		return [
			// Map numeric-leading file names at web root to /uploads/
			{
				source: '/:file((?:\\d|\\-)+-.+\\.(?:png|jpe?g|webp|gif))',
				destination: '/uploads/:file'
			},
			// Map driver application uploads
			{
				source: '/uploads/driver-applications/:file',
				destination: '/api/uploads/driver-applications/:file'
			}
		];
	},
	// Webpack configuration with performance optimizations
	webpack: (config, { isServer, dev }) => {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'@': path.resolve(process.cwd(), 'src'),
		};
		
		// Exclude test files from production build
		if (!dev) {
			// Exclude test files and test utilities from production build
			config.resolve.alias['@/lib/test-utils'] = false;
			config.resolve.alias['@/lib/__tests__'] = false;
		}
		
		// Ensure CSS files are handled properly and not processed as JavaScript
		config.module.rules.forEach((rule) => {
			if (rule.test && rule.test.test && rule.test.test('.css')) {
				// Ensure CSS files are treated as CSS, not JavaScript
				if (rule.use && Array.isArray(rule.use)) {
					rule.use.forEach((useItem) => {
						if (useItem.loader && useItem.loader.includes('css-loader')) {
							useItem.options = {
								...useItem.options,
								modules: false, // Disable CSS modules for global CSS
								importLoaders: 1,
							};
						}
					});
				}
			}
		});
		
		// Performance optimizations (client-side only)
		if (!isServer) {
			// Ensure optimization and splitChunks exist
			config.optimization = config.optimization || {};
			config.optimization.splitChunks = config.optimization.splitChunks || {};
			config.optimization.splitChunks.cacheGroups = config.optimization.splitChunks.cacheGroups || {};
			
			config.optimization = {
				...config.optimization,
				splitChunks: {
					chunks: 'all',
					cacheGroups: {
						// CSS chunk to prevent bundling issues
						styles: {
							name: 'styles',
							test: /\.css$/,
							chunks: 'all',
							enforce: true,
							priority: 30,
						},
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendors',
							chunks: 'all',
							// Exclude CSS files from vendor chunk to prevent CSS-as-JS errors
							enforce: true,
							reuseExistingChunk: true,
						},
						chakra: {
							test: /[\\/]node_modules[\\/]@chakra-ui[\\/]/,
							name: 'chakra',
							chunks: 'all',
							priority: 10,
						},
						react: {
							test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
							name: 'react',
							chunks: 'all',
							priority: 20,
						},
					},
				},
			};
		}
		
		return config;
	},
};

export default nextConfig;

