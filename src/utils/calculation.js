process.on("message", (message) => {
  let result = 0;
  if (message === "start") {
    console.log("Child process started calculation");
    for (let i = 0; i < 5e9; i++) {
      result += i;
    }
    process.send(result);
  }
});
