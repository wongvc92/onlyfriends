import React from "react";

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "8", color = "blue-500" }) => {
  return <div className={`w-${size} h-${size} border-2 border-t-transparent border-${color} rounded-full animate-spin`}></div>;
};

export default Spinner;
