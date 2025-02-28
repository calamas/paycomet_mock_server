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
  const {
    payment: { terminal, idUser, tokenUser },
  } = req.body;

  const cardBrandsArray = ["VISA", "MASTERCARD"];
  const cardTypesArray = ["DEBIT", "CREDIT"];
  const cardCategoriesArray = ["CONSUMER", "BUSINESS"];
  const cardICountryISO3Array = ["CYM", "ESP"];

  res.json({
    errorCode: 0,
    pan: `${faker.datatype.number({
      min: 100000,
      max: 999999,
    })}-XX-XXXX-${faker.datatype.number({ min: 1000, max: 9999 })}`,
    cardBrand:
      cardBrandsArray[Math.floor(Math.random() * cardBrandsArray.length)],
    cardType: cardTypesArray[Math.floor(Math.random() * cardTypesArray.length)],
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For Vercel deployment
