#!/usr/bin/env node

/**
 * Broken Link Checker for Speedy Van
 * Checks internal and external links for validity
 * Used in pre-commit hooks and CI/CD pipeline
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class BrokenLinkChecker {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.timeout = options.timeout || 10000;
    this.maxRetries = options.maxRetries || 2;
    this.excludePatterns = options.excludePatterns || [
      /^mailto:/,
      /^tel:/,
      /^javascript:/,
      /^#/,
      /localhost:3001/, // Admin portal
      /127\.0\.0\.1/,
      /example\.com/,
      /placeholder/
    ];
    this.checkedUrls = new Map();
    this.errors = [];
    this.warnings = [];
  }

  async checkUrl(url, retries = 0) {
    // Skip if already checked
    if (this.checkedUrls.has(url)) {
      return this.checkedUrls.get(url);
    }

    // Skip excluded patterns
    if (this.excludePatterns.some(pattern => pattern.test(url))) {
      this.checkedUrls.set(url, { status: 'skipped', reason: 'excluded' });
      return this.checkedUrls.get(url);
    }

    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;

      const result = await new Promise((resolve, reject) => {
        const options = {
          method: 'HEAD',
          timeout: this.timeout,
          headers: {
            'User-Agent': 'Speedy-Van-Link-Checker/1.0'
          }
        };

        const req = client.request(url, options, (res) => {
          const status = res.statusCode;
          
          if (status >= 200 && status < 400) {
            resolve({ status: 'ok', code: status });
          } else if (status >= 400 && status < 500) {
            resolve({ status: 'error', code: status, message: `Client error: ${status}` });
          } else if (status >= 500) {
            resolve({ status: 'error', code: status, message: `Server error: ${status}` });
          } else {
            resolve({ status: 'warning', code: status, message: `Unexpected status: ${status}` });
          }
        });

        req.on('error', (error) => {
          resolve({ status: 'error', message: error.message });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({ status: 'error', message: 'Request timeout' });
        });

        req.end();
      });

      // Retry on server errors
      if (result.status === 'error' && result.code >= 500 && retries < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        return this.checkUrl(url, retries + 1);
      }

      this.checkedUrls.set(url, result);
      return result;

    } catch (error) {
      const result = { status: 'error', message: error.message };
      this.checkedUrls.set(url, result);
      return result;
    }
  }

  extractLinksFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = [];

    // Extract href attributes
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      links.push(match[1]);
    }

    // Extract src attributes for images
    const srcRegex = /src=["']([^"']+)["']/g;
    while ((match = srcRegex.exec(content)) !== null) {
      links.push(match[1]);
    }

    // Extract markdown links
    const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    while ((match = markdownRegex.exec(content)) !== null) {
      links.push(match[2]);
    }

    return links.map(link => {
      // Convert relative URLs to absolute
      if (link.startsWith('/')) {
        return this.baseUrl + link;
      }
      if (link.startsWith('./') || link.startsWith('../')) {
        return new URL(link, this.baseUrl).href;
      }
      return link;
    });
  }

  async scanDirectory(dirPath, extensions = ['.tsx', '.ts', '.js', '.jsx', '.md', '.html']) {
    const files = [];
    
    const scanRecursive = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanRecursive(fullPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };

    scanRecursive(dirPath);
    return files;
  }

  async checkProject(projectPath) {
    console.log('🔍 Starting broken link check...');
    
    const files = await this.scanDirectory(projectPath);
    const allLinks = new Set();

    // Extract all links from files
    for (const file of files) {
      try {
        const links = this.extractLinksFromFile(file);
        links.forEach(link => allLinks.add(link));
      } catch (error) {
        this.warnings.push(`Could not read file ${file}: ${error.message}`);
      }
    }

    console.log(`📊 Found ${allLinks.size} unique links to check`);

    // Check all links
    const results = [];
    let checked = 0;
    
    for (const link of allLinks) {
      const result = await this.checkUrl(link);
      results.push({ url: link, ...result });
      
      checked++;
      if (checked % 10 === 0) {
        console.log(`⏳ Checked ${checked}/${allLinks.size} links...`);
      }

      if (result.status === 'error') {
        this.errors.push(`❌ ${link}: ${result.message || result.code}`);
      } else if (result.status === 'warning') {
        this.warnings.push(`⚠️  ${link}: ${result.message || result.code}`);
      }
    }

    return results;
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        ok: results.filter(r => r.status === 'ok').length,
        errors: results.filter(r => r.status === 'error').length,
        warnings: results.filter(r => r.status === 'warning').length,
        skipped: results.filter(r => r.status === 'skipped').length
      },
      results: results,
      errors: this.errors,
      warnings: this.warnings
    };

    return report;
  }

  async run(projectPath) {
    try {
      const results = await this.checkProject(projectPath);
      const report = this.generateReport(results);

      // Save report
      const reportPath = path.join(projectPath, 'link-check-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

      // Console output
      console.log('\n📋 Link Check Summary:');
      console.log(`✅ OK: ${report.summary.ok}`);
      console.log(`❌ Errors: ${report.summary.errors}`);
      console.log(`⚠️  Warnings: ${report.summary.warnings}`);
      console.log(`⏭️  Skipped: ${report.summary.skipped}`);

      if (this.errors.length > 0) {
        console.log('\n❌ Broken Links Found:');
        this.errors.forEach(error => console.log(error));
      }

      if (this.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        this.warnings.forEach(warning => console.log(warning));
      }

      console.log(`\n📄 Full report saved to: ${reportPath}`);

      // Exit with error code if broken links found
      if (this.errors.length > 0) {
        process.exit(1);
      }

      return report;

    } catch (error) {
      console.error('💥 Link checker failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI usage
if (require.main === module) {
  const projectPath = process.argv[2] || process.cwd();
  const baseUrl = process.argv[3] || 'http://localhost:3000';

  const checker = new BrokenLinkChecker({ baseUrl });
  checker.run(projectPath);
}

module.exports = BrokenLinkChecker;

