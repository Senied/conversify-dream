
const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 mt-1 ml-1">
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-loading-dot-1"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-loading-dot-2"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-loading-dot-3"></div>
    </div>
  );
};

export default LoadingDots;
