import { NextFunction, Request, Response } from "express";
import { Controller, Route } from "../../../decorators";
import { TokenHandler } from "../../../middleware";
import Stripe from "stripe";
import { API } from "../../../constants";
import { Error } from "../../../shared";
import { STRIPE_SECRET_KEY } from "../../../config";

// Created only when a key is configured, so the server can start without Stripe.
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

@Controller(`${API}/stripe`)
export default class UtilityController {
  @Route("post", "/payment-sheet", TokenHandler.verifyToken)
  async googlePay(req: Request, res: Response, next: NextFunction) {
    try {
      if (!stripe) return res.status(503).json({ data: false, message: Error.m041 });
      const { amount, currency, name, email } = req.body;
      const customer = await stripe.customers.create({
        name,
        email,
      });
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2024-10-28.acacia" },
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.PUBLISHABLE_KEY,
      });
    } catch (error: any) {
      logging.log("----------------------------------------");
      logging.error("GooglePay-Controller [post]:", error.message);
      logging.log("----------------------------------------");
      return res.status(500).json({ data: false, message: Error.m001 });
    }
  }
}
