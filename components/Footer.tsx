export default function Footer() {
  return (
    <footer className="border-t bg-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} AgriReg – Demoportal för miljö & CAP.</span>
        <span>Detta är en demo och innehåller inte verklig gårdsdata.</span>
      </div>
    </footer>
  );
}
