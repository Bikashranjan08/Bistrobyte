"use client";

import { UserProfile } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-mint-whisper pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <UserProfile
                        appearance={{
                            elements: {
                                card: "bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-green/10 border border-emerald-green/10",
                                navbar: "hidden", // Hide navigation if you want to keep it simple, or keep it visible
                            }
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
