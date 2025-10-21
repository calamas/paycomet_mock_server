const express = require("express");
const cors = require("cors");
const path = require("path");
const faker = require("faker");

const app = express();
const PORT = process.env.PORT || 443;

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Payments
app.post("/payments", (req, res) => {
  const {
    payment: {
      amount,
      currency,
      methodId,
      order,
      originalIp,
      secure,
      terminal,
      idUser,
      tokenUser,
      productDescription,
    },
  } = req.body;

  const returnAuthCode = amount == 0;

  if (amount > 10000) {
    res.json({ errorCode: amount % 10000 });
  } else {
    res.json({
      amount,
      currency,
      methodId,
      order,
      challengeUrl: !returnAuthCode ? faker.internet.url() : undefined,
      authCode: returnAuthCode ? faker.random.alphaNumeric(10) : undefined,
      idUser,
      tokenUser,
      cardCountry: "ESP",
      errorCode: 0,
    });
  }
});
// CARDS INFO
app.post("/cards/info", (req, res) => {
  const { terminal, idUser, tokenUser } = req.body;

  const cardBrandsArray = ["VISA", "MASTERCARD"];
  const cardTypesArray = ["DEBIT", "CREDIT"];
  const cardCategoriesArray = ["CONSUMER", "BUSINESS"];
  const cardICountryISO3Array = ["CYM", "ESP"];

  const cardType =
    cardTypesArray[Math.floor(Math.random() * cardTypesArray.length)];

  res.json({
    errorCode: 0,
    pan: `${faker.datatype.number({
      min: 100000,
      max: 999999,
    })}-XX-XXXX-${faker.datatype.number({ min: 1000, max: 9999 })}`,
    cardBrand:
      cardBrandsArray[Math.floor(Math.random() * cardBrandsArray.length)],
    cardType,
    CardType: cardType,
    cardICountryISO3:
      cardICountryISO3Array[
        Math.floor(Math.random() * cardICountryISO3Array.length)
      ],
    expiryDate: `${faker.date.future().getFullYear()}-${(
      faker.date.future().getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`,
    cardHash: faker.random.alphaNumeric(32),
    cardCategory:
      cardCategoriesArray[
        Math.floor(Math.random() * cardCategoriesArray.length)
      ],
    sepaCard: 0,
    eeaCard: "N",
    tokenCOF: 0,
    psd2Card: "NA",
  });
});

//Preauthorizations

app.post("/payments/preauth", (req, res) => {
  const {
    payment: {
      amount,
      currency,
      methodId,
      order,
      originalIp,
      secure,
      terminal,
      idUser,
      tokenUser,
    },
  } = req.body;

  if (amount > 10000) {
    res.json({ errorCode: amount % 10000 });
  } else {
    res.json({
      amount,
      currency,
      methodId,
      order,
      challengeUrl: faker.internet.url(),
      //authCode: faker.random.alphaNumeric(10),
      idUser,
      tokenUser,
      cardCountry: "ESP",
      errorCode: 0,
    });
  }
});

app.post("/payments/:preauthorizationId/preauth/cancel", (req, res) => {
  const {
    payment: { authCode, amount, currency, cardCountry, originalIp, terminal },
  } = req.body;

  const { preauthorizationId } = req.params;

  if (amount > 10000) {
    res.json({ errorCode: amount % 10000 });
  } else {
    res.json({
      amount,
      currency,
      order: preauthorizationId,
      authCode,
      cardCountry,
      errorCode: 0,
    });
  }
});

app.post("/payments/:preauthorizationId/preauth/confirm", (req, res) => {
  const {
    payment: { authCode, amount, currency, originalIp, terminal, cardCountry },
  } = req.body;

  const { preauthorizationId } = req.params;

  if (amount > 10000) {
    res.json({ errorCode: amount % 10000 });
  } else {
    res.json({
      amount,
      currency,
      order: preauthorizationId,
      authCode,
      cardCountry,
      errorCode: 0,
    });
  }
});

app.post("/payments/:transactionId/refund", (req, res) => {
  const {
    payment: { authCode, amount, currency, originalIp, terminal, cardCountry },
  } = req.body;

  const { transactionId } = req.params;

  if (amount > 10000) {
    res.json({ errorCode: amount % 10000 });
  } else {
    res.json({
      amount,
      currency,
      order: transactionId,
      authCode,
      cardCountry,
      errorCode: 0,
    });
  }
});

app.post("/payments/:transactionId/info", (req, res) => {
  const { transactionId } = req.params;

  res.json({
    errorCode: 0,
    payment: {
      amount: "200",
      amountDisplay: "2,00 €",
      amountEur: "2.00",
      amountEurDisplay: "2,00 €",
      authCode: "709604/267317868823855755525078875212",
      bicCode: "PAYTPVMMXXX",
      cardBrand: "VISA",
      cardCategory: "GOLD",
      cardCountry: "FR",
      cardType: "CREDIT",
      costumerCountry: "ES",
      currency: "EUR",
      dcc: 0,
      errorCode: 0,
      errorDescription: "Sin error",
      feeEuro: "0",
      feePercent: "0",
      issuerBank: "BPCE",
      merchantData: [
        "eyJjdXN0b21lciI6eyJpZCI6ImVhNjJkZTJlLTZhMzEtNDc1YS04N2FhLTg0MTAxMmRkZmJhZiIsIm5hbWUiOiJWZXJvIiwic3VybmFtZSI6IlN0YWdpbmcifX0=",
      ],
      methodId: "1",
      operationId: 350698157,
      operationName: "Autorización",
      operationType: 1,
      order: "1647d545-20ab-477b-9ffb-f09a518013cb",
      originalIp: "90.162.81.13",
      pan: "455685******2403",
      paycometId: "350741409",
      response: "OK",
      secure: 0,
      settlementDate: "20251020170540",
      state: 1,
      stateName: "Completado",
      terminal: 16785,
      terminalCurrency: "EUR",
      terminalName: "www.pidetaxi.es - BANKSTORE (TEST)",
      timestamp: "20251020170540",
      user: "ZHr4iAvV",
      history: [
        {
          amount: "200",
          amountDisplay: "2,00 €",
          amountEur: "2.00",
          amountEurDisplay: "2,00 €",
          authCode: "709604/267317868823855755525078875212",
          bicCode: "PAYTPVMMXXX",
          cardBrand: "VISA",
          cardCategory: "GOLD",
          cardCountry: "FR",
          cardType: "CREDIT",
          costumerCountry: "ES",
          currency: "EUR",
          dcc: 0,
          errorCode: 0,
          errorDescription: "Sin error",
          feeEuro: "0",
          feePercent: "0",
          issuerBank: "BPCE",
          methodId: "1",
          operationId: 350698157,
          operationName: "Autorización",
          operationType: 1,
          order: "1647d545-20ab-477b-9ffb-f09a518013cb",
          originalIp: "90.162.81.13",
          pan: "455685******2403",
          paycometId: "350741409",
          productDescription:
            "Trip:cc4cb318-b002-43c1-b2f1-64eb63ff743d,dispId:1025784,Comp:RT Takasi ,App:Pidetaxi APP/veronicalamas@gmail.com",
          response: "OK",
          secure: 0,
          settlementDate: "20251020170540",
          state: 1,
          stateName: "Completado",
          terminal: 16785,
          terminalCurrency: "EUR",
          terminalName: "www.pidetaxi.es - BANKSTORE (TEST)",
          timestamp: "20251020170540",
          user: "ZHr4iAvV",
        },
      ],
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For Vercel deployment
