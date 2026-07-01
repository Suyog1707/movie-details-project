import { motion } from "framer-motion";

export default function MovieCardSkeleton() {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.4,
        repeat: Infinity,
      }}
      className="relative group flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
    >
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-800" />

      <div className="mt-2">
        <div className="h-4 w-3/4 rounded bg-zinc-800" />
        <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800" />
      </div>
    </motion.div>
  );
}