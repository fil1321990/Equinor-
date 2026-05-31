import express from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

export const router = express.Router();
const prisma = new PrismaClient();

// GET /api/offers/special
router.get("/offers/special", async (req, res) => {
  const offers = await prisma.investmentOffer.findMany({
    where: { status: "active" },
  });
  res.json(offers);
});

// POST /api/offers/:id/purchase
router.post("/offers/:id/purchase", async (req, res) => {
  const { userId } = req.body;
  const offerId = req.params.id;

  const offer = await prisma.investmentOffer.findUnique({ where: { id: offerId } });
  if (!offer) return res.status(404).json({ error: "Offer not found" });

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + offer.cycleDays * 24 * 60 * 60 * 1000);
  
  const code = `CP${Date.now()}${crypto.randomInt(10000, 99999)}`;

  const investment = await prisma.userInvestment.create({
    data: {
      id: code,
      userId,
      offerId,
      startTime,
      endTime,
      profitAccrued: 0,
      withdrawn: false,
      status: "active",
    },
  });

  res.json(investment);
});

// GET /api/investments/:id/status
router.get("/investments/:id/status", async (req, res) => {
  const investment = await prisma.userInvestment.findUnique({
    where: { id: req.params.id },
    include: { offer: true },
  });
  if (!investment) return res.status(404).json({ error: "Not found" });

  const now = new Date();
  const elapsedDays = Math.floor(
    (now.getTime() - investment.startTime.getTime()) / (1000 * 60 * 60 * 24)
  );
  const profitAccrued = Math.min(
    elapsedDays * investment.offer.dailyIncome,
    investment.offer.totalIncome
  );
  const canWithdraw = now >= new Date(investment.startTime.getTime() + 7 * 24 * 60 * 60 * 1000);

  res.json({
    ...investment,
    profitAccrued: Number(profitAccrued.toFixed(3)),
    canWithdraw,
    timeRemaining: investment.endTime.getTime() - now.getTime(),
  });
});

// POST /api/investments/:id/withdraw
router.post("/investments/:id/withdraw", async (req, res) => {
  const investment = await prisma.userInvestment.findUnique({
    where: { id: req.params.id },
    include: { offer: true },
  });
  if (!investment) return res.status(404).json({ error: "Not found" });

  const now = new Date();
  const canWithdraw = now >= new Date(investment.startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  if (!canWithdraw) {
    return res.status(400).json({ error: "Funds are locked for 7 days" });
  }

  // Handle actual withdrawal logic here...
  const updated = await prisma.userInvestment.update({
    where: { id: investment.id },
    data: { 
      withdrawn: true,
      status: "completed"
    }
  });

  res.json(updated);
});

export default router;
