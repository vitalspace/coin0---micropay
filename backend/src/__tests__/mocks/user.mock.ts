export const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  address: "0x123456789abcdef",
  avatar: "https://example.com/avatar.jpg",
  nickname: "testuser",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUserDoc = {
  ...mockUser,
  save: () => Promise.resolve(mockUser),
  findById: () => Promise.resolve(null),
};

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});