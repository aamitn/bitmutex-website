"use client"
import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, FileCode2, Sparkles } from "lucide-react";

interface CodeBlockWithCopyProps {
  children: React.ReactNode;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

const CodeBlockWithCopy: React.FC<CodeBlockWithCopyProps> = ({ 
  children, 
  language, 
  title,
  showLineNumbers = true 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const codeString = String(children).trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const containerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.2, 
        duration: 0.4 
      }
    }
  };

  const buttonVariants: Variants = {
    idle: { 
      scale: 1, 
      rotate: 0 
    },
    hover: { 
      scale: 1.05, 
      rotate: 2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.95, 
      rotate: -2 
    },
    copied: {
      scale: [1, 1.2, 1],
      rotate: [0, 360, 0],
      transition: { 
        duration: 0.6, 
        ease: "easeInOut" 
      }
    }
  };

  const iconVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0, 
      rotate: -180 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0, 
      rotate: 180,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const sparkleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0 
    },
    visible: { 
      opacity: [0, 1, 0], 
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
      transition: { 
        duration: 1.5, 
        ease: "easeOut",
        times: [0, 0.3, 1]
      }
    }
  };

  const glowVariants: Variants = {
    hidden: { 
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)" 
    },
    visible: { 
      boxShadow: [
        "0 0 0 rgba(59, 130, 246, 0)",
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.2)",
        "0 0 20px rgba(59, 130, 246, 0.1)"
      ],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="group relative max-w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl"
        variants={glowVariants}
        animate={isHovered ? "visible" : "hidden"}
      />
      
      {/* Main Container */}
      <motion.div 
        className="relative backdrop-blur-sm bg-zinc-200 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl"
        whileHover={{ 
          borderColor: "rgba(59, 130, 246, 0.5)",
          transition: { duration: 0.3 }
        }}
      >
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          className="flex items-center justify-between px-6 py-4 dark:border dark:border-b-1 dark:border-b-slate-700 border border-b-1 border-b-slate-400 bg-gradient-to-r from-slate-300/80 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-700/80 border-b border-slate-200/30 dark:border-slate-600/30"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: isHovered ? 1.2 : 1 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <FileCode2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </motion.div>
            
            <div className="flex flex-col">
            {/* 
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {language.toUpperCase()}
              </span>
            */}
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {codeString.split('\n').length} lines
              </span>
            </div>
          </div>

          {/* Copy Button */}
          <motion.button
            variants={buttonVariants}
            initial="idle"
            animate={isCopied ? "copied" : "idle"}
            whileHover="hover"
            whileTap="tap"
            onClick={handleCopy}
            className="relative flex items-center gap-2 px-4 py-2 bg-slate-300/70 hover:bg-slate-200/70 dark:bg-slate-700/70 dark:hover:bg-slate-600/70 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-400/50 dark:border-slate-600/50 backdrop-blur-sm transition-all duration-300 group/btn"
          >
            {/* Sparkle Effect */}
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  variants={sparkleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button Icon */}
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div
                  key="check"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Copy className="w-4 h-4 group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.span 
              className="text-sm font-medium"
              animate={{ 
                color: isCopied ? "#059669" : undefined,
                scale: isCopied ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {isCopied ? "Copied!" : "Copy"}
            </motion.span>

            {/* Button Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
              animate={{
                x: isHovered ? ["100%", "-100%"] : "100%"
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 2
              }}
            />
          </motion.button>
        </motion.div>

        {/* Code Content */}
        <motion.div 
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SyntaxHighlighter
            style={{
                ...oneDark,
                'pre[class*="language-"]': {
                ...oneDark['pre[class*="language-"]'],
                background: "transparent",
                margin: 0,
                color: "var(--code-text)",
                padding: 0,
                },
                'code[class*="language-"]': {
                ...oneDark['code[class*="language-"]'],
                background: "transparent",
                fontSize: "0.875rem",
                color: "var(--code-text)",
                lineHeight: "1.5",
                }
            }}
            language={language}
            PreTag="div"
            showLineNumbers={showLineNumbers}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#64748b',
              borderRight: '1px solid #cbd5e1',
              marginRight: '1em',
            }}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
            className="text-slate-800 dark:text-slate-200" 
          >
            {codeString}
          </SyntaxHighlighter>

          {/* Code Overlay Effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
              background: isHovered 
                ? "linear-gradient(90deg, rgba(59,130,246,0.05) 0%, transparent 50%, rgba(168,85,247,0.05) 100%)"
                : "transparent"
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Bottom Accent Line */}
        <motion.div
          className="h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CodeBlockWithCopy;