/* global module */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      url: ['http://localhost/'],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        // Pre-cutover noindex intentionally makes Lighthouse's crawlability audit non-actionable.
        'categories:seo': ['warn', { minScore: 1 }],
        'is-crawlable': 'off',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci/reports',
    },
  },
};
