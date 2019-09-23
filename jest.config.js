module.exports = {
  name: 'Jazida Testes Unitários/Integração',
  notify: true,
  verbose: true,
  testEnvironment: 'node',
  testURL: 'http://localhost:3000/',
  setupFiles: ['<rootDir>/lib/setup.js'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*-(spec|test).js?(x)',
    '<rootDir>/**/?(*.)(spec|test).js?(x)',
  ],
  collectCoverageFrom: ['/**/*.{js,jsx}'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest/fileTransformer.js',
  },
};
