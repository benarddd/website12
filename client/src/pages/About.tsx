import { motion } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import { SectionHeading } from "@/components/ui/section-heading";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24 relative overflow-hidden">
        <Particles className="absolute inset-0 z-0" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <SectionHeading 
            title="Rreth Shkollës Sonë" 
            subtitle="Pasioni për edukim dhe përsosmëri akademike që nga viti 2005"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-white">Historia e Shkollës</h3>
              <p className="text-[#c0c0c0] leading-relaxed">
                Gjimnazi "Abdulla Keta" u themelua në vitin 2005 dhe që atëherë ka qenë një ndër institucionet arsimore 
                më të rëndësishme në Shqipëri. I emëruar në nder të patriotit dhe arsimtarit të shquar shqiptar, 
                shkolla jonë ka një histori të pasur të përsosmërisë akademike dhe kontributit shoqëror.
              </p>
              <p className="text-[#c0c0c0] leading-relaxed">
                Gjatë dekadave, ne kemi evoluar dhe jemi përshtatur me kohën, duke integruar metodat moderne të 
                mësimdhënies ndërsa ruajmë vlerat tona themelore të integritetit, respektit dhe përsosmërisë.
              </p>
              
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-4">Statistikat pergjate viteve</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#121212] p-6 rounded-lg text-center">
                    <h4 className="text-3xl font-bold text-[#26a69a]">XX+</h4>
                    <p className="text-[#c0c0c0] text-sm mt-2">Staf Akademik</p>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg text-center">
                    <h4 className="text-3xl font-bold text-[#26a69a]">XX+</h4>
                    <p className="text-[#c0c0c0] text-sm mt-2">Nxënës</p>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg text-center">
                    <h4 className="text-3xl font-bold text-[#26a69a]">XX%</h4>
                    <p className="text-[#c0c0c0] text-sm mt-2">Norma e Suksesit</p>
                  </div>
                  <div className="bg-[#121212] p-6 rounded-lg text-center">
                    <h4 className="text-3xl font-bold text-[#26a69a]">20+</h4>
                    <p className="text-[#c0c0c0] text-sm mt-2">Vite Histori</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border-4 border-[#26a69a]">
                <img 
                  src="https://i.imgur.com/57SoCEx.png" 
                  alt="Gjimnazi Abdulla Keta" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#7e57c2] rounded-full opacity-20 blur-2xl z-0"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#26a69a] rounded-full opacity-20 blur-2xl z-0"></div>
            </motion.div>
          </div>
          
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-6">Misioni dhe Vizioni</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-[#121212] p-8 rounded-xl border-l-4 border-[#26a69a]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h4 className="text-xl font-bold text-white mb-4">Misioni Ynë</h4>
                <p className="text-[#c0c0c0] leading-relaxed">
                  Misioni i gjimnazit "Abdulla Keta" është të ofrojë një arsim cilësor, gjithëpërfshirës dhe 
                  novator që përgatit nxënësit për të qenë qytetarë të suksesshëm, të përgjegjshëm dhe kontribues 
                  në shoqëri. Ne angazhohemi të nxisim mendimin kritik, kreativitetin dhe përsosmërinë akademike 
                  në një mjedis që vlerëson diversitetin dhe respekton individualitetin e çdo nxënësi.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] p-8 rounded-xl border-l-4 border-[#7e57c2]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h4 className="text-xl font-bold text-white mb-4">Vizioni Ynë</h4>
                <p className="text-[#c0c0c0] leading-relaxed">
                  Vizioni ynë është të jemi një shkollë lider në arsimin parauniversitar në Shqipëri, e njohur për 
                  standardet e larta akademike, vlerat e forta etike dhe inovacionin në metodologjinë e mësimdhënies. 
                  Ne aspirojmë të krijojmë një komunitet të të nxënit ku çdo nxënës arrin potencialin e tij të 
                  plotë dhe zhvillon aftësitë e nevojshme për të naviguar me sukses në një botë në ndryshim të vazhdueshëm.
                </p>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-6">Vlerat Tona</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="bg-[#121212] p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-[#26a69a] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-brain text-[#26a69a] text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Ekselenca</h4>
                <p className="text-[#c0c0c0] text-sm">Angazhohemi për standarde të larta në të gjitha aspektet e punës sonë akademike dhe jashtëshkollore.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-[#7e57c2] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-handshake text-[#7e57c2] text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Integriteti</h4>
                <p className="text-[#c0c0c0] text-sm">Veprojmë me ndershmëri, drejtësi dhe përgjegjësi në të gjitha ndërveprimet tona.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-[#4CAF50] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-[#4CAF50] text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Respekti</h4>
                <p className="text-[#c0c0c0] text-sm">Vlerësojmë çdo individ dhe kontributin e tij unik në komunitetin tonë shkollor.</p>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="bg-[#FF9800] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-[#FF9800] text-2xl"></i>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Inovacioni</h4>
                <p className="text-[#c0c0c0] text-sm">Inkurajojmë kreativitetin dhe qasjet e reja në zgjidhjen e problemeve dhe të mësuarit.</p>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-white mb-6">Drejtuesit e Shkollës</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-[#121212] rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src="" 
                    alt="Drejtori" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-1"> X Y</h4>
                  <p className="text-[#26a69a] mb-4">Drejtor i Shkollës</p>
                  <p className="text-[#c0c0c0] text-sm">Me mbi XX vjet eksperiencë në fushën e arsimit dhe një pasion të pakrahasueshëm për edukimin e brezit të ri.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src="" 
                    alt="Zv. Drejtore" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-1"> XY</h4>
                  <p className="text-[#26a69a] mb-4">Zv. Drejtore për Çështjet Akademike</p>
                  <p className="text-[#c0c0c0] text-sm">E specializuar në kurrikulën moderne dhe metodologjitë inovative të mësimdhënies.</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}