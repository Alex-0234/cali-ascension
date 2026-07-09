
const SystemButton = ({ text, onClick, variant = "primary", disabled = false }) => {
  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-2 h-10 px-5 rounded-md cursor-pointer text-[12px] font-semibold uppercase tracking-[0.09em] text-[#a78bfa] bg-transparent border border-[rgba(167,139,250,0.4)] transition-colors duration-150 hover:bg-[rgba(167,139,250,0.06)] hover:border-[rgba(167,139,250,0.8)] active:translate-y-px focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-[#a78bfa] disabled:opacity-35 disabled:cursor-not-allowed"
      >
        <span className="w-[5px] h-[5px] rounded-[1px] bg-[#a78bfa] flex-shrink-0" />
        <span className="pointer-events-none">{text}</span>
      </button>
    );
  }
 
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 h-10 px-5 rounded-md cursor-pointer text-[12px] font-semibold uppercase tracking-[0.09em] text-accent bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.45)] transition-colors duration-150 hover:border-[rgba(56,189,248,0.85)] hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] active:translate-y-px focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-[#38bdf8] disabled:opacity-35 disabled:cursor-not-allowed"
    >
      <span className="w-[5px] h-[5px] rounded-[1px] bg-accent shadow-[0_0_4px_#38bdf8] flex-shrink-0" />
      <span className="pointer-events-none">{text}</span>
    </button>
  );
};
 
export default SystemButton;
