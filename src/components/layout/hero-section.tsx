"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { motion } from "framer-motion";
import { CheckCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-10 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Container className="relative z-10 flex flex-col items-center justify-center gap-12 pt-20 pb-16">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-6 max-w-2xl px-4"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-4"
          >
            <Sparkles size={14} />
            <span>The New Standard</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-purple-200 tracking-tight leading-tight"
          >
            {"I Got This "}
            <CheckCircle
              className="inline-block text-cyan-400 -mt-2 ml-1"
              size={48}
              strokeWidth={2.5}
            />
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium"
          >
            No more nagging. Just shared responsibility.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base text-slate-400 max-w-lg mx-auto"
          >
            Make household tasks visible, claim ownership with a simple tap, and
            get things done together.
          </motion.p>
        </motion.section>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4 mt-4"
        >
          <motion.div variants={itemVariants} className="w-full flex-1">
            <Link href="/signup" className="w-full block group">
              <div className="relative rounded-2xl p-0.5 bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 rounded-2xl"></div>
                <Button className="relative w-full bg-slate-950 text-white font-bold h-14 text-lg group-hover:bg-slate-950/80 transition-colors rounded-[14px]">
                  Get Started
                </Button>
              </div>
            </Link>
          </motion.div>
          <motion.div variants={itemVariants} className="w-full sm:w-1/3">
            <Link href="/login" className="w-full block">
              <Button
                variant="ghost"
                className="w-full h-14 text-lg font-medium border border-slate-700/50 hover:bg-slate-800/50"
              >
                Log In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 md:max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4"
        >
          {[
            {
              title: "Tired of Reminding?",
              desc: "Stop chasing roommates for chores.",
              icon: <Zap className="w-6 h-6 text-cyan-400" />,
            },
            {
              title: "Shared Ownership",
              desc: "Take pride in your shared space.",
              icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
            },
            {
              title: "Just 1 Tap",
              desc: 'Say "I got this" and it is yours.',
              icon: <CheckCircle className="w-6 h-6 text-green-400" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl hover:-translate-y-1 transition-transform duration-300 cursor-default"
            >
              <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 ring-1 ring-white/10">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </Container>
    </main>
  );
}
