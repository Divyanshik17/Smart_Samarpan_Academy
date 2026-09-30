import mongoose from "mongoose";
import dns from "dns";

export const connectDb = async () => {
  try {
    // Ensure DNS resolver can resolve MongoDB Atlas SRV records
    try {
      dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("Could not set custom DNS servers, using system default:", dnsErr.message);
    }

    await mongoose.connect(process.env.DB);
    console.log("✅ MongoDB Database Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};