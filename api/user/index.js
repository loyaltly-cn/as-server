export default (app) => {
    app.get("/", async (c) => c.json({ message: 'test' }));
};
