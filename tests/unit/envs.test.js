test("envs should be TEST", () => {
	expect(process.env.NODE_ENV).toBe("test");
});
