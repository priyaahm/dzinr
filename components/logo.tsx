import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex-1 flex items-center
  gap-2 text-2xl"
    >
      <span
        className="inline-block
    font-extrabold text-primary"
      >
        Dzinr
      </span>
      
    </Link>
  );
};

export default Logo;
