import { motion } from 'framer-motion';

const Card = ({ title, desc, delay = 0, onClick }) => {
  return (
    <motion.div
      // Navigazione
      onClick={onClick}
      
      // Drag e Interazione
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      whileTap={{ scale: 0.95 }}
      
      // Animazione di ingresso e loop (Deep Water Effect)
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        opacity: 1,
        y: [0, -40, 0],
        rotate: [0, 2, -2, 0],
        boxShadow: [
          "0 10px 20px rgba(125, 211, 252, 0.1)",
          "0 50px 100px rgba(125, 211, 252, 0.25)",
          "0 10px 20px rgba(125, 211, 252, 0.1)"
        ]
      }}
      
      // Transizione: il delay è isolato per non influenzare l'hover
      transition={{
        opacity: { duration: 0.8, delay: delay },
        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay },
        rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay },
        boxShadow: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay },
      }}
      
      // Hover istantaneo (senza delay)
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        transition: { delay: 0, duration: 0.2 } 
      }}
      
      // Classi dinamiche: cambia cursore se la card è cliccabile
      className={`glass-card w-72 p-8 rounded-[3rem] select-none shadow-sm transition-colors duration-300 ${
        onClick ? 'cursor-pointer border-k-ocean/30' : 'cursor-grab active:cursor-grabbing border-white/70'
      }`}
    >
      {/* Decorazione superiore */}
      <div className="w-14 h-1.5 bg-k-ocean/20 rounded-full mb-8 shadow-inner" />
      
      {/* Testi con i tuoi colori originali */}
      <h2 className="text-k-ocean font-bold text-2xl mb-4 tracking-tight">
        {title}
      </h2>
      
      <p className="text-slate-500 text-sm leading-relaxed font-medium">
        {desc}
      </p>
      
      {/* Footer della Card */}
      <div className="mt-10 flex justify-end items-center gap-2">
        {onClick && (
          <span className="text-[9px] font-bold text-k-ocean/40 animate-pulse uppercase tracking-tighter">
            Click to open
          </span>
        )}
        <button className="text-[10px] font-black text-k-ocean tracking-widest uppercase hover:text-sky-400 transition-colors">
          Explore
        </button>
      </div>
    </motion.div>
  );
};

export default Card;