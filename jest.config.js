module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
      "node_modules/(?!axios)" // axios를 변환하도록 설정
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Jest가 최신 JS 문법을 변환하도록 설정
    },
  };