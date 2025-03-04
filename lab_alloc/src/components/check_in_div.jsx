import { motion } from "framer-motion";
import { MdOutlineDone } from "react-icons/md";
import { AiOutlineExclamation } from "react-icons/ai";

export default function CheckIn({ success, message }) {
  return (
    <motion.div
      className="check-in-outer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className={`check-in-done ${success ? "success" : "error"}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {success ? <MdOutlineDone size={24} /> : <AiOutlineExclamation size={24} />}
      </motion.div>
      <motion.div
        className="check-in-msg"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {message}
      </motion.div>
    </motion.div>
  );
}
