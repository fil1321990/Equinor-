import express from "express";
import cors from "cors";
import path from "path";
import axios from "axios";
import { sendNotificationEmail } from "./src/services/mailer.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mount API paths

  app.post("/api/notify", async (req, res) => {
    try {
      const { to, type, data } = req.body;
      
      let subject = "Notification";
      let message = "";
      
      switch(type) {
        case "deposit_confirmation":
          subject = "Deposit Confirmed";
          message = `Your deposit of ₦${data.amount} has been confirmed. Thank you!`;
          break;
        case "withdrawal_approval":
          subject = "Withdrawal Approved";
          message = `Your withdrawal of ₦${data.amount} has been approved and is being processed.`;
          break;
        case "investment_maturity":
          subject = "Investment Matured";
          message = `Your investment has matured. You have earned a profit of ₦${data.profit}.`;
          break;
        default:
          return res.status(400).json({ status: "error", message: "Invalid notification type" });
      }
      
      await sendNotificationEmail(to, subject, message);
      res.json({ status: "success" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ status: "error", message: "Failed to send email" });
    }
  });

  // Paystack Withdrawal endpoint
  app.post("/api/withdraw", async (req, res) => {
    try {
      const { amount, bankName, accountNumber, bankCode } = req.body;
      const secretKey = process.env.PAYSTACK_SECRET_KEY;

      if (!secretKey) {
        return res.status(500).json({ status: "error", message: "Paystack secret key is missing." });
      }

      // 1. Create a transfer recipient
      const recipientResponse = await axios.post(
        "https://api.paystack.co/transferrecipient",
        {
          type: "nuban",
          name: "User Withdrawal", // Or take name from user
          account_number: accountNumber,
          bank_code: bankCode || "058", // Default to GTB or we need actual bankCode
          currency: "NGN",
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const recipientCode = recipientResponse.data.data.recipient_code;

      // 2. Initiate Transfer
      // Amount in Paystack is in kobo (multiply by 100)
      const transferResponse = await axios.post(
        "https://api.paystack.co/transfer",
        {
          source: "balance",
          amount: amount * 100, 
          recipient: recipientCode,
          reason: "Cash withdrawal from app",
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.json({ status: "success", data: transferResponse.data });
    } catch (error: any) {
      console.error("Paystack withdrawal error:", error.response?.data || error.message);
      res.status(500).json({ 
        status: "error", 
        message: error.response?.data?.message || "Failed to initiate withdrawal" 
      });
    }
  });

  // Balance endpoint
  app.get("/api/balance", (req, res) => {
    // Return a mock balance (e.g. 50000) or calculate user balance
    res.json({ status: "success", balance: 50000 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
