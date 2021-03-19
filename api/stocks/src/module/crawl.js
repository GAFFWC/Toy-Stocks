const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

const getData = async (code) => {
	await axios({
		url: `https://finance.naver.com/item/main.nhn?code=${code}`,
		method: "GET",
		responseType: "arraybuffer"
	})
		.then((res) => {
			const result = {};
			const $ = cheerio.load(iconv.decode(res.data, "EUC-KR"));
			// const result = iconv.decode($(".blind dd").text(), "EUC-KR").toString();
			const deal = $(".blind")
				.find("dd")
				.text()
				.split(" ")
				.map((value) => {
					return value.replace(/[^0-9]/g, "");
				});

			result.datetime = deal[0] + "-" + deal[1] + "-" + deal[2] + " " + deal[3] + ":" + deal[4] + ":00";
			result.code = deal[8];
			result.price = {
				now: deal[10],
				yesterday: {
					start: deal[17],
					highest: deal[18],
					lowest: deal[20],
					upperLimit: deal[19],
					lowerLimit: deal[21]
				}
			};

			result.volume = deal[22];

			console.log(result);
		})
		.catch((err) => {
			console.error(err);
		});
};

getData("005930");
