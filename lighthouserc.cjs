module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/mines-automotive/',
        'http://localhost/mines-automotive/about/',
        'http://localhost/mines-automotive/curriculum/',
        'http://localhost/mines-automotive/teams/',
        'http://localhost/mines-automotive/teams/fsae/'
      ],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.85 }]
      }
    },
    upload: { target: 'temporary-public-storage' }
  }
};
