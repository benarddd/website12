import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

// Book genre types
type BookGenre = "all" | "fiction" | "nonfiction" | "textbook" | "science" | "literature" | "history" | "language";

// Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  genre: BookGenre[];
  description: string;
  year: number;
  format: "PDF" | "EPUB" | "BOTH";
  language: string;
  pages: number;
}

const books: Book[] = [
  {
    id: 1,
    title: "Historia e Shqipërisë",
    author: "Kristo Frashëri",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["textbook", "history"],
    description: "Një përmbledhje e historisë së Shqipërisë nga periudha ilire deri në ditët e sotme.",
    year: 2018,
    format: "PDF",
    language: "Shqip",
    pages: 382
  },
  {
    id: 2,
    title: "Fizika e Klasës së 11-të",
    author: "Min. e Arsimit",
    cover: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["textbook", "science"],
    description: "Libri zyrtar i fizikës për klasën e 11-të me të gjitha konceptet themelore.",
    year: 2022,
    format: "PDF",
    language: "Shqip",
    pages: 210
  },
  {
    id: 3,
    title: "Kështjella",
    author: "Ismail Kadare",
    cover: "https://images.unsplash.com/photo-1581795669633-91ef7c9699a8?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["fiction", "literature"],
    description: "Roman historik që përshkruan qëndresën shqiptare kundër pushtimit otoman.",
    year: 1970,
    format: "BOTH",
    language: "Shqip",
    pages: 248
  },
  {
    id: 4,
    title: "Princesha e Martuar",
    author: "William Goldman",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["fiction"],
    description: "Një roman aventuresh që përzien fantazinë, romanticizmin dhe humorin.",
    year: 1973,
    format: "EPUB",
    language: "Anglisht",
    pages: 320
  },
  {
    id: 5,
    title: "Biologjia Molekulare",
    author: "James D. Watson",
    cover: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["textbook", "science"],
    description: "Një hyrje moderne në biologjinë molekulare dhe gjenetikën.",
    year: 2020,
    format: "PDF",
    language: "Anglisht",
    pages: 450
  },
  {
    id: 6,
    title: "Gramatika e Gjuhës Shqipe",
    author: "Akademia e Shkencave",
    cover: "https://images.unsplash.com/photo-1544947892-21e54adb4681?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["textbook", "language"],
    description: "Gramatika zyrtare e gjuhës shqipe me rregullat e sintaksës dhe morfologjisë.",
    year: 2019,
    format: "PDF",
    language: "Shqip",
    pages: 320
  },
  {
    id: 7,
    title: "Sapiens: Një histori e shkurtër e njerëzimit",
    author: "Yuval Noah Harari",
    cover: "https://images.unsplash.com/photo-1597690160839-cb13c1844fb5?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["nonfiction", "history"],
    description: "Një vështrim provokues në historinë e njerëzimit nga hominidet e para deri në ditët tona.",
    year: 2011,
    format: "BOTH",
    language: "Anglisht",
    pages: 512
  },
  {
    id: 8,
    title: "Gjergj Kastrioti Skënderbeu",
    author: "Fan Noli",
    cover: "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["nonfiction", "history"],
    description: "Biografia e heroit kombëtar shqiptar Gjergj Kastrioti Skënderbeu.",
    year: 1947,
    format: "PDF",
    language: "Shqip",
    pages: 280
  },
  {
    id: 9,
    title: "Matematika e Avancuar",
    author: "Prof. Dr. Edmond Lulja",
    cover: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["textbook", "science"],
    description: "Tekst për matematikën e avancuar me koncepte të analizës matematikore dhe algjebrës.",
    year: 2021,
    format: "PDF",
    language: "Shqip",
    pages: 380
  },
  {
    id: 10,
    title: "Poezi të Zgjedhura",
    author: "Migjeni",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["literature"],
    description: "Përmbledhje e poezive të zgjedhura të autorit të famshëm shqiptar Migjeni.",
    year: 1954,
    format: "BOTH",
    language: "Shqip",
    pages: 120
  },
  {
    id: 11,
    title: "Kemistria Organike",
    author: "John McMurry",
    cover: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["textbook", "science"],
    description: "Tekst universitar për kemistrinë organike me reakcione dhe mekanizma.",
    year: 2018,
    format: "PDF",
    language: "Anglisht",
    pages: 520
  },
  {
    id: 12,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&h=600&auto=format&fit=crop",
    genre: ["fiction", "literature"],
    description: "Roman distopik që përshkruan një shoqëri totalitare nën kontrollin e një regjimi diktatorial.",
    year: 1949,
    format: "BOTH",
    language: "Anglisht",
    pages: 328
  }
];

export default function DigitalLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<BookGenre>("all");
  const [selectedFormat, setSelectedFormat] = useState<"ALL" | "PDF" | "EPUB" | "BOTH">("ALL");
  
  // Filter books based on search term, genre, and format
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === "all" || book.genre.includes(selectedGenre);
    
    const matchesFormat = selectedFormat === "ALL" || book.format === selectedFormat || 
      (selectedFormat === "BOTH" && book.format === "BOTH");
    
    return matchesSearch && matchesGenre && matchesFormat;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute -top-40 right-0 w-64 h-64 bg-[#26a69a] bg-opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-40 left-0 w-80 h-80 bg-[#7e57c2] bg-opacity-5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <SectionHeading 
            title="Biblioteka Digjitale" 
            subtitle="Qasje në libra dhe burime elektronike për të gjithë nxënësit e shkollës"
          />
          
          <motion.div 
            className="mt-8 bg-[#121212] rounded-xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#c0c0c0] mb-6">
              Biblioteka digjitale e shkollës "Abdulla Keta" ofron një koleksion të pasur me materiale 
              mësimore, tekste shkollore, literaturë artistike dhe burime shkencore në format elektronik. 
              Nxënësit dhe stafi kanë qasje të plotë në këto materiale nga çdo pajisje me internet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#26a69a] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#26a69a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold">+2,500 Libra</h3>
                  <p className="text-[#c0c0c0] text-sm">Koleksion i gjerë librash</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#7e57c2] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7e57c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold">Formate të Ndryshme</h3>
                  <p className="text-[#c0c0c0] text-sm">PDF, EPUB dhe më shumë</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#ff5722] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold">Qasje 24/7</h3>
                  <p className="text-[#c0c0c0] text-sm">Në shkollë dhe nga shtëpia</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Search and Filter */}
          <div className="mt-12">
            <div className="bg-[#121212] rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-white font-medium mb-2">Kërko</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="search" 
                      className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md pl-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#26a69a] focus:border-transparent" 
                      placeholder="Kërko sipas titullit ose autorit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c0c0c0] absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Genre Filter */}
                <div>
                  <label htmlFor="genre" className="block text-white font-medium mb-2">Zhanri</label>
                  <select 
                    id="genre" 
                    className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#26a69a] focus:border-transparent"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value as BookGenre)}
                  >
                    <option value="all">Të gjithë zhanret</option>
                    <option value="fiction">Letërsi Artistike</option>
                    <option value="nonfiction">Jo-fiction</option>
                    <option value="textbook">Tekste Shkollore</option>
                    <option value="science">Shkencë</option>
                    <option value="literature">Letërsi</option>
                    <option value="history">Histori</option>
                    <option value="language">Gjuhësi</option>
                  </select>
                </div>
                
                {/* Format Filter */}
                <div>
                  <label htmlFor="format" className="block text-white font-medium mb-2">Formati</label>
                  <select 
                    id="format" 
                    className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#26a69a] focus:border-transparent"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as "ALL" | "PDF" | "EPUB" | "BOTH")}
                  >
                    <option value="ALL">Të gjithë formatet</option>
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="BOTH">PDF & EPUB</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Books Grid */}
          <div className="mt-8">
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book, index) => (
                  <motion.div 
                    key={book.id}
                    className="bg-[#121212] rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <div className="flex items-center mb-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded mr-2 ${
                            book.format === "PDF" ? "bg-[#26a69a] text-white" : 
                            book.format === "EPUB" ? "bg-[#7e57c2] text-white" : 
                            "bg-[#ff5722] text-white"
                          }`}>
                            {book.format}
                          </span>
                          <span className="text-[#c0c0c0] text-xs">{book.language}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-[#c0c0c0] text-sm mb-3">{book.author} • {book.year}</p>
                        
                        <p className="text-[#c0c0c0] text-sm mb-4 line-clamp-3">{book.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-[#c0c0c0] text-xs">{book.pages} faqe</span>
                        <button 
                          className="px-4 py-2 bg-[#2d2d2d] text-white text-sm rounded-md hover:bg-[#3d3d3d] transition-colors"
                        >
                          Lexo Tani
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-[#121212] rounded-xl p-8 text-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#2d2d2d] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Nuk u gjetën rezultate</h3>
                <p className="text-[#c0c0c0]">
                  Na vjen keq, por nuk gjetëm asnjë libër që përputhet me kriteret tuaja të kërkimit. 
                  Ju lutemi provoni kritere të tjera.
                </p>
              </div>
            )}
          </div>
          
          {/* Help Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Si të Përdorni Bibliotekën Digjitale</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="bg-[#121212] rounded-xl p-6 shadow-lg h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-[#26a69a] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#26a69a] text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Kërkoni Librin</h3>
                <p className="text-[#c0c0c0]">
                  Përdorni filtrat dhe fushën e kërkimit për të gjetur librin që ju nevojitet. 
                  Mund të kërkoni sipas titullit, autorit ose zhanrit.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] rounded-xl p-6 shadow-lg h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-[#7e57c2] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7e57c2] text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Lexoni Online ose Shkarkoni</h3>
                <p className="text-[#c0c0c0]">
                  Zgjidhni të lexoni librin drejtpërdrejt në platformën tonë ose shkarkojeni 
                  në formatin e preferuar (PDF ose EPUB).
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-[#121212] rounded-xl p-6 shadow-lg h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-[#ff5722] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#ff5722] text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Ruani dhe Organizoni</h3>
                <p className="text-[#c0c0c0]">
                  Shtoni librat në listën tuaj të favoritve për qasje të shpejtë dhe 
                  organizojini sipas kategorive tuaja.
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Request Books */}
          <div className="mt-16">
            <motion.div 
              className="bg-gradient-to-r from-[#121212] to-[#1e1e1e] rounded-xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Nuk gjetët çfarë po kërkoni?</h2>
                  <p className="text-[#c0c0c0] mb-6">
                    Biblioteka jonë digjitale përditësohet vazhdimisht me tituj të rinj. Nëse nuk gjetët librin që 
                    po kërkoni, mund të bëni një kërkesë dhe ne do të mundohemi ta shtojmë sa më shpejt.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#26a69a] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[#c0c0c0]">Kërkoni libra teknikë, artistikë, romane ose materiale mësimore.</p>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#26a69a] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[#c0c0c0]">Kërkesa juaj do të shqyrtohet nga stafi i bibliotekës.</p>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#26a69a] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-[#c0c0c0]">Do të njoftoheni kur libri të jetë i disponueshëm.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Kërkesë për Libër të Ri</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="bookTitle" className="block text-[#c0c0c0] text-sm font-medium mb-2">Titulli i Librit</label>
                      <input 
                        type="text" 
                        id="bookTitle" 
                        className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#26a69a] focus:border-transparent" 
                        placeholder="Shënoni titullin e saktë"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bookAuthor" className="block text-[#c0c0c0] text-sm font-medium mb-2">Autori</label>
                      <input 
                        type="text" 
                        id="bookAuthor" 
                        className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#26a69a] focus:border-transparent" 
                        placeholder="Emri i autorit"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="reason" className="block text-[#c0c0c0] text-sm font-medium mb-2">Arsyeja e Kërkesës</label>
                      <textarea 
                        id="reason" 
                        rows={3} 
                        className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#26a69a] focus:border-transparent" 
                        placeholder="Pse keni nevojë për këtë libër?"
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-[#26a69a] text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      Dërgo Kërkesën
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}