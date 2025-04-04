
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function StudentPortal() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Portali i Nxënësve
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Orari im</h3>
          <p className="text-gray-600 mb-4">Shiko orarin personal të klasës dhe aktiviteteve</p>
          <button className="bg-[#26a69a] text-white px-4 py-2 rounded">Shiko Orarin</button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Notat</h3>
          <p className="text-gray-600 mb-4">Kontrollo notat dhe vlerësimet</p>
          <button className="bg-[#26a69a] text-white px-4 py-2 rounded">Shiko Notat</button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4">Materialet Mësimore</h3>
          <p className="text-gray-600 mb-4">Materialet dhe detyrat e kursit</p>
          <button className="bg-[#26a69a] text-white px-4 py-2 rounded">Shiko Materialet</button>
        </Card>
      </div>
    </div>
  );
}
