import express from "express";
import cors from "cors";
import axios from "axios";

async function sendNotificationEmail(to: string, subject: string, message: string) {
  console.log(`Sending email to ${to}: ${subject} - ${message}`);
  return true;
}

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/api/withdraw", async (req, res) => {
  try {
    const { amount, bankName, accountNumber, bankCode } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ status: "error", message: "Paystack secret key is missing." });
    }

    const recipientResponse = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: "User Withdrawal",
        account_number: accountNumber,
        bank_code: bankCode || "058",
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

app.get("/api/balance", (req, res) => {
  res.json({ status: "success", balance: 50000 });
});

export default app;
