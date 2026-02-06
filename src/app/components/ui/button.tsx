export default function Button({ children, onClick }: any) {
  return (
    <button
      className="border-1 text-black border-black hover:bg-gray-200 font-bold rounded transition-colors duration-200 ease-in-out"
      onClick={onClick}
    >
      {children}
    </button>
  );
}