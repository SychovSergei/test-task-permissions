import app from "./bin/app";

const start = async () => {
  try {
    const PORT = 3000;
    app.listen(PORT, () =>
      console.log(`[server]: Server is running at PORT:${PORT}`),
    );
  } catch (e) {
    console.log("Start() ERROR", e);
  }
};

start().catch((err) => console.log("err", err));
