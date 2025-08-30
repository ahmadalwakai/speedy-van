#!/usr/bin/env node

/**
 * Favicon Generator for Speedy Van
 * Generates complete favicon suite from base image
 * Supports ICO, PNG, SVG, Apple-touch, manifest, mask-icon
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class FaviconGenerator {
  constructor(inputPath, outputDir) {
    this.inputPath = inputPath;
    this.outputDir = outputDir;
    this.sizes = {
      // Standard favicon sizes
      favicon: [16, 32, 48],
      // PNG favicons
      png: [16, 32, 48, 64, 96, 128, 192, 256, 512],
      // Apple touch icons
      apple: [57, 60, 72, 76, 114, 120, 144, 152, 180],
      // Android/Chrome icons
      android: [36, 48, 72, 96, 144, 192, 256, 384, 512],
      // Windows tiles
      windows: [70, 150, 310]
    };
  }

  async ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generatePngFavicons() {
    console.log('🖼️  Generating PNG favicons...');
    
    for (const size of this.sizes.png) {
      const outputPath = path.join(this.outputDir, `favicon-${size}x${size}.png`);
      
      await sharp(this.inputPath)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);
        
      console.log(`✅ Generated: favicon-${size}x${size}.png`);
    }

    // Generate standard favicon.png
    await sharp(this.inputPath)
      .resize(32, 32)
      .png({ quality: 100 })
      .toFile(path.join(this.outputDir, 'favicon.png'));
      
    console.log('✅ Generated: favicon.png');
  }

  async generateAppleTouchIcons() {
    console.log('🍎 Generating Apple Touch icons...');
    
    for (const size of this.sizes.apple) {
      const outputPath = path.join(this.outputDir, `apple-touch-icon-${size}x${size}.png`);
      
      await sharp(this.inputPath)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png({ quality: 100 })
        .toFile(outputPath);
        
      console.log(`✅ Generated: apple-touch-icon-${size}x${size}.png`);
    }

    // Generate standard apple-touch-icon.png
    await sharp(this.inputPath)
      .resize(180, 180)
      .png({ quality: 100 })
      .toFile(path.join(this.outputDir, 'apple-touch-icon.png'));
      
    console.log('✅ Generated: apple-touch-icon.png');
  }

  async generateAndroidIcons() {
    console.log('🤖 Generating Android/Chrome icons...');
    
    for (const size of this.sizes.android) {
      const outputPath = path.join(this.outputDir, `android-chrome-${size}x${size}.png`);
      
      await sharp(this.inputPath)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 100 })
        .toFile(outputPath);
        
      console.log(`✅ Generated: android-chrome-${size}x${size}.png`);
    }
  }

  async generateWindowsTiles() {
    console.log('🪟 Generating Windows tiles...');
    
    // Square tiles
    for (const size of this.sizes.windows) {
      const outputPath = path.join(this.outputDir, `mstile-${size}x${size}.png`);
      
      await sharp(this.inputPath)
        .resize(size, size, {
          kernel: sharp.kernel.lanczos3,
          fit: 'contain',
          background: { r: 37, g: 99, b: 235, alpha: 1 } // Speedy Van blue
        })
        .png({ quality: 100 })
        .toFile(outputPath);
        
      console.log(`✅ Generated: mstile-${size}x${size}.png`);
    }

    // Wide tile
    await sharp(this.inputPath)
      .resize(558, 270, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 37, g: 99, b: 235, alpha: 1 }
      })
      .png({ quality: 100 })
      .toFile(path.join(this.outputDir, 'mstile-558x270.png'));
      
    console.log('✅ Generated: mstile-558x270.png');
  }

  generateSvgFavicon() {
    console.log('🎨 Generating SVG favicon...');
    
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="white"/>
  <g transform="translate(4, 8)">
    <path d="M2 8h4v2H2V8zm0 3h3v2H2v-2zm0 3h2v2H2v-2z" fill="#2563EB"/>
    <path d="M8 4h12c2 0 4 2 4 4v8c0 2-2 4-4 4H8c-2 0-4-2-4-4V8c0-2 2-4 4-4z" fill="#2563EB"/>
    <circle cx="10" cy="16" r="2" fill="white"/>
    <circle cx="18" cy="16" r="2" fill="white"/>
    <rect x="14" y="6" width="4" height="3" rx="1" fill="white"/>
  </g>
</svg>`;

    fs.writeFileSync(path.join(this.outputDir, 'favicon.svg'), svgContent);
    console.log('✅ Generated: favicon.svg');
  }

  generateWebManifest() {
    console.log('📱 Generating web manifest...');
    
    const manifest = {
      name: "Speedy Van - Professional Moving Services",
      short_name: "Speedy Van",
      description: "Fast, reliable moving and delivery services across the UK",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#2563EB",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/android-chrome-256x256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "/android-chrome-384x384.png",
          sizes: "384x384",
          type: "image/png"
        }
      ],
      categories: ["business", "productivity", "utilities"],
      lang: "en-GB",
      dir: "ltr"
    };

    fs.writeFileSync(
      path.join(this.outputDir, 'site.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('✅ Generated: site.webmanifest');
  }

  generateBrowserConfig() {
    console.log('⚙️  Generating browser config...');
    
    const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/mstile-70x70.png"/>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-558x270.png"/>
      <TileColor>#2563EB</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

    fs.writeFileSync(path.join(this.outputDir, 'browserconfig.xml'), browserConfig);
    console.log('✅ Generated: browserconfig.xml');
  }

  generateHtmlMeta() {
    console.log('📝 Generating HTML meta tags...');
    
    const metaTags = `<!-- Favicon and App Icons -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">

<!-- Web App Manifest -->
<link rel="manifest" href="/site.webmanifest">

<!-- Windows Tiles -->
<meta name="msapplication-TileColor" content="#2563EB">
<meta name="msapplication-config" content="/browserconfig.xml">

<!-- Theme Colors -->
<meta name="theme-color" content="#2563EB">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Speedy Van">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="/favicon.svg" color="#2563EB">`;

    fs.writeFileSync(path.join(this.outputDir, 'favicon-meta.html'), metaTags);
    console.log('✅ Generated: favicon-meta.html');
  }

  async generate() {
    console.log('🚀 Starting favicon generation...');
    console.log(`📁 Input: ${this.inputPath}`);
    console.log(`📁 Output: ${this.outputDir}`);
    
    await this.ensureOutputDir();
    
    try {
      await this.generatePngFavicons();
      await this.generateAppleTouchIcons();
      await this.generateAndroidIcons();
      await this.generateWindowsTiles();
      this.generateSvgFavicon();
      this.generateWebManifest();
      this.generateBrowserConfig();
      this.generateHtmlMeta();
      
      console.log('\n🎉 Favicon generation complete!');
      console.log('📋 Generated files:');
      
      const files = fs.readdirSync(this.outputDir);
      files.forEach(file => console.log(`   - ${file}`));
      
    } catch (error) {
      console.error('❌ Error generating favicons:', error.message);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const inputPath = process.argv[2] || './public/favicon-base.png';
  const outputDir = process.argv[3] || './public';

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const generator = new FaviconGenerator(inputPath, outputDir);
  generator.generate();
}

module.exports = FaviconGenerator;

