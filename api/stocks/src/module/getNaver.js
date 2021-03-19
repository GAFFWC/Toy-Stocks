// connectPython_print.js 파일
const spawn = require("child_process").spawn;
const result = spawn("python3", ["getNaver.py"]);

result.stdout.on("data", (data) => {
	try {
		const stocksInfo = JSON.parse(data.toString());
		console.log(stocksInfo);
	} catch (err) {
		console.error(err);
	}
});
