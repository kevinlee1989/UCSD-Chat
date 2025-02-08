module.exports = {
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)" // axios를 Jest가 변환하도록 설정
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testEnvironment: "jsdom"
};