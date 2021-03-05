const express = require("express");
const app = express();
const port = 8080;

const cors = require("cors");
app.use(cors());

const request = require("request");

app.get("/history/:platform/:pair", (req, res) => {
  switch (req.params.platform) {
    case "Kraken":
      createKrakenRequest(req.params.pair.toUpperCase(), res);
      return;
    case "Huobi":
      createHuobiRequest(req.params.pair.toLowerCase(), res);
      return;
    default:
      res.send([]);
  }
});

app.get("/:pair", async (req, res) => {
  const krakenPromise = await new Promise((resolve) => {
    request(
      `https://api.kraken.com/0/public/Ticker?pair=${req.params.pair.toUpperCase()}`,
      (error, response, body) => {
        resolve(body);
      }
    );
  });

  const huobiPromise = await new Promise((resolve) => {
    request(
      `https://api.huobi.pro/market/detail/merged?symbol=${req.params.pair.toLowerCase()}`,
      (error, response, body) => {
        resolve(body);
      }
    );
  });

  const bitfinexPromise = await new Promise((resolve) => {
    request(
      `https://api.bitfinex.com/v1/pubticker/${req.params.pair.toLowerCase()}`,
      (error, response, body) => {
        resolve(body);
      }
    );
  });

  const binancePromise = await new Promise((resolve) => {
    request(
      `https://api.binance.com/api/v3/avgPrice?symbol=${req.params.pair.toUpperCase()}`,
      (error, response, body) => {
        resolve(body);
      }
    );
  });

  Promise.all([
    krakenPromise,
    huobiPromise,
    bitfinexPromise,
    binancePromise,
  ]).then((values) => {
    res.send(dataAdapter(values, req.params.pair.toUpperCase()));
  });
});

const dataAdapter = (data, pair) => {
  const krakenResult = JSON.parse(data[0]).result;
  const krakenData = krakenResult ? Object.values(krakenResult)[0] : {};
  const huobiResult = JSON.parse(data[1]);
  const huobiData = huobiResult ? huobiResult.tick : {};
  const bitfinexData = JSON.parse(data[2]);
  const binanceData = JSON.parse(data[3]);
  return [
    {
      name: "Kraken",
      data: krakenData.c && krakenData.c[0],
    },
    {
      name: "Huobi",
      data: huobiData && huobiData.close,
    },
    {
      name: "Bitfinex",
      data: bitfinexData.last_price,
    },
    {
      name: "Binance",
      data: binanceData.price,
    },
  ];
};

const createKrakenRequest = (pair, res) => {
  request(
    `https://api.kraken.com/0/public/Trades?pair=${pair}`,
    (error, response, body) => {
      const result = JSON.parse(body).result;
      const data = result ? Object.values(result)[0] : {};
      const lastFiveBuys = data
        .filter((d) => d[3] === "b")
        .map((d) => d[0])
        .slice(0, 5);
      const lastFiveSells = data
        .filter((d) => d[3] === "s")
        .map((d) => d[0])
        .slice(0, 5);
      const responseData = lastFiveBuys.map((b, index) => [
        b,
        lastFiveSells[index],
      ]);
      res.send(responseData);
    }
  );
};

const createHuobiRequest = (pair, res) => {
  request(
    `https://api.huobi.pro/market/history/trade?symbol=${pair}&size=10`,
    (error, response, body) => {
      const result = JSON.parse(body);
      const mappedData = result.data.map((d) => d.data).flat();
      const lastFiveBuys = mappedData
        .filter((d) => d.direction === "buy")
        .map((d) => d.price)
        .slice(0, 5);
      const lastFiveSells = mappedData
        .filter((d) => d.direction === "sell")
        .map((d) => d.price)
        .slice(0, 5);
      const responseData = lastFiveBuys.map((b, index) => [
        b,
        lastFiveSells[index],
      ]);
      res.send(responseData);
    }
  );
};

app.listen(port, () => {
  console.log(`Proxy app listening at http://localhost:${port}`);
});
