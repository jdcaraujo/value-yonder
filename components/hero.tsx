"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-36 pb-20 px-6 max-w-5xl mx-auto">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-2 mb-6"
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "#06b6d4" }}
        />
        <span className="text-sm font-medium" style={{ color: "#06b6d4" }}>
          AI product leader · Lisbon
        </span>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
        style={{
          background: "linear-gradient(160deg, #ffffff 40%, #737373 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Daniel Araújo
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed mb-10"
      >
        Former founder. Senior PM at Zendesk. Writing about what I&apos;m learning.
      </motion.p>

      {/* Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="p-6 rounded-2xl max-w-2xl"
        style={{
          background: "rgba(6,182,212,0.04)",
          border: "1px solid rgba(6,182,212,0.15)",
        }}
      >
        <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
          I&apos;m most interested in the moment AI moves from automating tasks to orchestrating
          workflows — when it becomes an org design question, not a productivity one. If that&apos;s
          the problem you&apos;re working on,{" "}
          <Link
            href="mailto:jdc.araujo@gmail.com"
            className="underline underline-offset-2 hover:text-cyan-400 transition-colors"
            style={{ color: "#06b6d4" }}
          >
            let&apos;s talk
          </Link>
          .
        </p>
      </motion.div>
    </section>
  );
}
