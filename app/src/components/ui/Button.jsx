export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, type = 'button', ...props }) {
  const variants = {
    primary: 'bg-signal text-void hover:bg-signal/90 font-semibold',
    secondary: 'bg-pulse text-white hover:bg-pulse/90 font-semibold',
    outline: 'border border-signal text-signal hover:bg-signal/10',
    ghost: 'text-secondary hover:text-primary hover:bg-border',
    danger: 'bg-hot text-white hover:bg-hot/90',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-signal disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
