
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, Sun, X, ShoppingBag, ArrowRight, Trash2, Plus, Minus, 
  Globe, Mail, Instagram, Twitter, HelpCircle, Paperclip, 
  Filter, ChevronDown, CheckCircle, Beaker, Zap, ShieldCheck, 
  Microscope, Quote, Clock, Target, Users, Camera, MapPin 
} from 'lucide-react';

// --- Types ---
type PageType = 'home' | 'shop' | 'best-sellers' | 'our-science' | 'the-story' | 'locations';

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
}

// --- Product Data ---
const PRODUCTS = [
  { id: 1, name: "ALMOND CRUNCH", flavor: "Almond", price: 2.99, protein: "20G", desc: "Crunchy almonds with 20g protein", img: "https://github.com/Rohworld/superyou/blob/main/pexels-catscoming-3752065.jpg?raw=true", tag: "BEST SELLER", review: "Best protein bar ever!" },
  { id: 2, name: "PEANUT BUTTER", flavor: "Peanut", price: 2.99, protein: "20G", desc: "Creamy peanut butter bliss", img: "https://github.com/Rohworld/superyou/blob/main/pexels-karola-g-6659686.jpg?raw=true", tag: "NEW", review: "Actually tastes like dessert." },
  { id: 3, name: "CHOCO SWIRL", flavor: "Chocolate", price: 2.99, protein: "20G", desc: "Decadent dark cocoa fudge", img: "https://github.com/Rohworld/superyou/blob/main/choco%20swirl.jpg?raw=true", tag: "POPULAR", review: "Fuel for my 5AM runs." },
  { id: 4, name: "BERRY BLITZ", flavor: "Berry", price: 2.99, protein: "20G", desc: "Explosive berry energy", img: "https://github.com/Rohworld/superyou/blob/main/berry%20blitz.jpg?raw=true", tag: "LIMITED", review: "My kids even love them!" },
  { id: 5, name: "ALMOND PEAK", flavor: "Almond", price: 2.99, protein: "25G", desc: "Maximum crunch, extra fuel", img: "https://github.com/Rohworld/superyou/blob/main/pexels-catscoming-3752065.jpg?raw=true", tag: "HI-PROTEIN", review: "Great post-workout." },
  { id: 6, name: "NUTTY NUT", flavor: "Peanut", price: 2.99, protein: "20G", desc: "Roasted peanut perfection", img: "https://github.com/Rohworld/superyou/blob/main/pexels-karola-g-6659686.jpg?raw=true", tag: "", review: "So satisfying." },
  { id: 7, name: "COCOA CRAZE", flavor: "Chocolate", price: 2.99, protein: "20G", desc: "Double chocolate madness", img: "https://github.com/Rohworld/superyou/blob/main/choco%20swirl.jpg?raw=true", tag: "", review: "Chocolate lovers dream." },
  { id: 8, name: "WILD BERRY", flavor: "Berry", price: 2.99, protein: "20G", desc: "Mixed forest berries mix", img: "https://github.com/Rohworld/superyou/blob/main/berry%20blitz.jpg?raw=true", tag: "", review: "Fresh and light." },
];

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, img: product.img }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className={`min-h-screen bg-[#4A2C1A] selection:bg-[#FFFF00] selection:text-black ${isMenuOpen || isCartOpen ? 'overflow-hidden' : ''}`}>
      <TopBlackBar />
      <Navbar 
        onMenuClick={() => setIsMenuOpen(true)} 
        onCartClick={() => setIsCartOpen(true)} 
        onLogoClick={() => setCurrentPage('home')}
        cartCount={cartCount}
      />
      
      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={(page) => { setCurrentPage(page); setIsMenuOpen(false); }}
      />
      
      <CartOverlay 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQty}
      />

      <main className="transition-all duration-300">
        {currentPage === 'home' && (
          <>
            <Hero onShopClick={() => setCurrentPage('shop')} />
            <BottomMarquee />
            <FavesReimagined onProductClick={(p) => addToCart(p)} />
            <PopularFlavors onAdd={(p) => addToCart(p)} />
            <ScienceBehind onLearnMore={() => setCurrentPage('our-science')} />
            <MeetThePack onBuyNow={() => setCurrentPage('shop')} />
            <Newsletter />
          </>
        )}
        
        {currentPage === 'shop' && <ShopPage onAddToCart={addToCart} />}
        {currentPage === 'best-sellers' && <BestSellersPage onAddToCart={addToCart} />}
        {currentPage === 'our-science' && <OurSciencePage onShopNow={() => setCurrentPage('shop')} />}
        {currentPage === 'the-story' && <TheStoryPage />}
        {currentPage === 'locations' && <LocationsPage />}
      </main>
      
      <Footer 
        onNavigate={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

// --- Components ---

const TopBlackBar: React.FC = () => (
  <div className="bg-black text-white text-[9px] md:text-xs py-1.5 px-4 md:px-8 flex justify-between items-center fixed top-0 w-full z-[110] border-b border-white/10 uppercase font-bold tracking-widest">
    <span className="truncate">SUPEYOU | YUMMY PROTEIN REIMAGINED</span>
    <div className="flex gap-2 items-center flex-shrink-0">
      <span>EN</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
      </div>
    </div>
  </div>
);

const Navbar: React.FC<{ onMenuClick: () => void; onCartClick: () => void; onLogoClick: () => void; cartCount: number }> = 
  ({ onMenuClick, onCartClick, onLogoClick, cartCount }) => (
  <nav className="fixed top-8 left-0 w-full z-[100] flex justify-between items-center px-4 py-3 bg-transparent pointer-events-none">
    <div 
      onClick={onLogoClick}
      className="text-3xl md:text-5xl heading-font text-[#FFA500] pointer-events-auto cursor-pointer hover:scale-105 transition-transform drop-shadow-sm"
    >
      Supeyou
    </div>
    <div className="flex gap-2 md:gap-6 pointer-events-auto items-center">
      <button 
        onClick={onMenuClick}
        className="starburst bg-[#00FF00] text-black w-12 h-12 md:w-20 md:h-20 flex items-center justify-center font-black text-[9px] md:text-xs uppercase border-2 border-black hover:rotate-12 transition-transform shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      >
        MENU
      </button>
      <button 
        onClick={onCartClick}
        className="bg-[#FFFF00] text-black px-4 py-2 md:px-10 md:py-4 rounded-full font-black text-[10px] md:text-sm uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all flex items-center gap-2"
      >
        CART ({cartCount})
      </button>
    </div>
  </nav>
);

const Hero: React.FC<{ onShopClick: () => void }> = ({ onShopClick }) => (
  <section className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-[#4A2C1A]">
    <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none px-4 md:px-10">
      <div className="flex justify-between w-full max-w-[95vw] text-[18vw] md:text-[18vw] heading-font text-[#FFD700] leading-none opacity-100">
        <span>Y</span><span className="relative">U</span><span>M</span><span>M</span><span>Y</span>
      </div>
    </div>

    <div className="absolute top-[68%] left-[20%] md:top-[62%] md:left-[30%] -translate-x-1/2 z-30 pointer-events-auto scale-90 md:scale-100">
      <div onClick={onShopClick} className="w-24 h-24 md:w-52 md:h-52 bg-[#FFD700] rounded-full border-2 md:border-4 border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-all cursor-pointer group">
        <div className="flex gap-3 md:gap-8 mb-1 md:mb-2">
          <div className="w-2 h-2 md:w-5 md:h-5 bg-black rounded-full"></div>
          <div className="w-2 h-2 md:w-5 md:h-5 bg-black rounded-full"></div>
        </div>
        <div className="px-3 py-1 bg-black rounded-full mt-1 flex items-center justify-center overflow-hidden">
          <span className="heading-font text-[#FFD700] text-[8px] md:text-lg uppercase leading-none text-center font-black">SHOP<br/>NOW</span>
        </div>
      </div>
    </div>

    <div className="absolute top-[52%] md:top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[85vw] sm:w-[65vw] md:w-[45vw] lg:w-[35vw] z-20 pointer-events-auto flex justify-center">
      <div className="relative group">
        <img 
          src="https://github.com/Rohworld/superyou/blob/main/Gemini_Generated_Image_9lvxil9lvxil9lvx-removebg-preview.png?raw=true" 
          alt="Supeyou Protein Bar" 
          className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] rotate-[6deg] group-hover:rotate-0 transition-transform duration-700 object-contain"
        />
        <div className="absolute top-[20%] -left-2 md:-left-16 bg-[#00FF00] border-2 md:border-4 border-black px-2 md:px-6 py-1 md:py-2.5 heading-font text-[9px] md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ENERGY</div>
        <div className="absolute top-[8%] left-[15%] bg-white border-2 border-black px-2 md:px-6 py-1 heading-font text-[9px] md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-6">Snack Smart</div>
        <div className="absolute top-[40%] right-[-2%] md:right-[-15%] bg-[#FF69B4] text-white border-2 border-black px-2 md:px-6 py-1 heading-font text-[9px] md:text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12">Just Supeyou</div>
      </div>
    </div>

    <div className="absolute right-[5%] md:right-[10%] bottom-[22%] md:bottom-[35%] z-30 pointer-events-auto scale-90 md:scale-100">
      <div className="starburst w-24 h-24 md:w-56 md:h-56 bg-[#00FF00] border-2 md:border-4 border-black flex items-center justify-center p-2 md:p-6 text-center shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:rotate-12 transition-transform cursor-pointer group">
        <span className="heading-font text-white text-[10px] md:text-2xl leading-tight font-black">20G<br/>PROTEIN</span>
      </div>
    </div>

    <div className="absolute bottom-6 md:bottom-[15%] left-0 w-full px-6 z-40 text-[#00FF00] pointer-events-auto">
      <div className="flex items-center gap-3 justify-center md:justify-start md:ml-[15%]">
        <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=100&q=80" alt="Almond" className="w-10 md:w-16 h-auto rotate-[30deg] animate-pulse" />
        <p className="text-[12px] sm:text-base md:text-xl font-bold leading-tight max-w-[200px] md:max-w-sm">
          Fuel your body like you mean it. <br className="hidden sm:block"/>
          <span className="text-white opacity-90">20g of clean, crave-worthy protein.</span>
        </p>
      </div>
    </div>
  </section>
);

const BottomMarquee: React.FC = () => (
  <div className="bg-[#228B22] py-3 md:py-4 border-y-4 border-black overflow-hidden relative z-40">
    <div className="animate-marquee flex gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-8 md:gap-12 mx-4 md:mx-6 shrink-0">
          <span className="text-[#FFFF00] heading-font uppercase text-base md:text-2xl tracking-tighter">KLOUD</span>
          <Star className="text-[#FFFF00] fill-[#FFFF00]" size={16} />
          <span className="text-[#FFFF00] heading-font uppercase text-base md:text-2xl tracking-tighter">JUST SUPEYOU</span>
          <Sun className="text-[#FFFF00] fill-[#FFFF00]" size={16} />
          <span className="text-[#FFFF00] heading-font uppercase text-base md:text-2xl tracking-tighter">WORK HARD</span>
          <Sun className="text-[#FFFF00] fill-[#FFFF00]" size={16} />
        </div>
      ))}
    </div>
  </div>
);

const FavesReimagined: React.FC<{ onProductClick: (p: any) => void }> = ({ onProductClick }) => {
  const products = [
    { id: 1, name: "ALMOND CRUNCH", img: "https://github.com/Rohworld/superyou/blob/main/pexels-catscoming-3752065.jpg?raw=true", rotate: "rotate-3", price: 2.99 },
    { id: 2, name: "PEANUT BUTTER", img: "https://github.com/Rohworld/superyou/blob/main/pexels-karola-g-6659686.jpg?raw=true", rotate: "-rotate-2", price: 2.99 },
    { id: 3, name: "CHOCO SWIRL", img: "https://github.com/Rohworld/superyou/blob/main/choco%20swirl.jpg?raw=true", rotate: "rotate-2", price: 2.99 },
    { id: 4, name: "BERRY BLITZ", img: "https://github.com/Rohworld/superyou/blob/main/berry%20blitz.jpg?raw=true", rotate: "-rotate-3", price: 2.99 }
  ];

  return (
    <section className="bg-[#F5F0E6] py-16 px-6 border-b-4 border-black text-center overflow-hidden">
      <div className="mb-12 md:mb-20">
        <h2 className="text-5xl md:text-8xl heading-font uppercase leading-none text-[#FFA500] mb-4 tracking-tighter">RE-IMAGINED.</h2>
        <p className="font-black text-sm md:text-xl text-[#4A2311] max-w-2xl mx-auto uppercase leading-tight italic">CLASSIC DESSERT FLAVORS, PACKED WITH PROTEIN ZERO GUILT, FULL TASTE.</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {products.map((p, i) => (
          <div key={i} className="flex flex-col items-center group cursor-pointer" onClick={() => onProductClick(p)}>
            <div className={`relative bg-white border-4 border-black p-3 md:p-4 pb-12 md:pb-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:rotate-0 group-hover:-translate-y-2 ${p.rotate}`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                   <Paperclip className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="starburst bg-[#00FF00] absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 border-2 border-black flex items-center justify-center p-2 z-10 rotate-12 group-hover:rotate-0 transition-transform">
                <span className="text-[10px] md:text-xs font-black leading-none">NEW</span>
              </div>
              <div className="aspect-square border-2 border-zinc-100 overflow-hidden bg-zinc-50">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
            <p className="mt-8 heading-font text-base md:text-xl text-[#4A2311] uppercase tracking-tighter group-hover:text-[#FFA500] transition-colors">{p.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const PopularFlavors: React.FC<{ onAdd: (p: any) => void }> = ({ onAdd }) => {
  const products = [
    { id: 9, name: "PEANUT POWER", price: 2.99, desc: "Rich & Smooth", img: "https://www.shutterstock.com/image-photo/healthy-protein-chocolate-bars-ingredients-260nw-2530698961.jpg" },
    { id: 10, name: "COCONUT FUEL", price: 2.99, desc: "Tropical Crunch", img: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/d2981037-c7c5-4402-a758-7090226ec4bd.__CR0,0,600,450_PT0_SX600_V1___.jpg" },
    { id: 11, name: "MIX PACK", price: 2.99, desc: "All the Hits", img: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/8851d06d-a9ec-4dad-9ac6-1fd9b834dd3f.__CR0,0,970,600_PT0_SX970_V1___.jpg" },
  ];

  return (
    <section className="bg-[#FFFF00] py-16 px-4 md:px-12 border-b-4 border-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <div key={i} className="bg-white border-2 border-black p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-5px] transition-transform cursor-pointer">
            <div className="aspect-square border-2 border-black overflow-hidden mb-4">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="heading-font text-lg mb-1">{p.name}</h3>
            <p className="font-bold text-xs text-zinc-500 mb-4">{p.desc}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(p); }}
              className="w-full bg-[#4A2311] text-white py-3 heading-font uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              ADD TO CART
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const ScienceBehind: React.FC<{ onLearnMore: () => void }> = ({ onLearnMore }) => (
  <section className="bg-[#109648] py-16 px-6 border-b-4 border-black text-center text-white">
    <h2 className="text-4xl md:text-7xl heading-font uppercase mb-6 tracking-tighter leading-none">THE SCIENCE <br/> <span className="text-[#FFFF00]">BEHIND THE BITE.</span></h2>
    <p className="text-sm md:text-xl font-bold mb-8 opacity-90">Smarter ingredients. Better fuel for body and mind.</p>
    <button onClick={onLearnMore} className="bg-[#FFFF00] text-black border-2 border-black px-8 py-4 heading-font text-base shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">LEARN MORE</button>
  </section>
);

const MeetThePack: React.FC<{ onBuyNow: () => void }> = ({ onBuyNow }) => (
  <section className="bg-[#FF69B4] py-16 px-6 border-b-4 border-black flex flex-col md:flex-row items-center gap-10">
    <div className="flex-1 flex justify-center">
      <img src="https://github.com/Rohworld/superyou/blob/main/Gemini_Generated_Image_sh7lbksh7lbksh7l-removebg-preview.png?raw=true" className="w-full max-w-[300px] md:max-w-[400px] drop-shadow-xl" alt="Pack" />
    </div>
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-4xl md:text-7xl heading-font text-[#4A2311] uppercase leading-none mb-6">MEET THE <br/> <span className="text-white">SUPEYOU PACK.</span></h2>
      <button onClick={onBuyNow} className="bg-[#4A2311] text-white border-2 border-black px-10 py-5 heading-font text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">BUY NOW</button>
    </div>
  </section>
);

const Newsletter: React.FC = () => (
  <section className="bg-[#F5EBE0] py-16 px-4 border-b-4 border-black text-center">
    <h2 className="text-4xl md:text-8xl heading-font text-[#4A2311] uppercase leading-none tracking-tighter mb-8">GET <span className="text-[#FF69B4]">10% OFF</span></h2>
    <div className="max-w-md mx-auto flex flex-col gap-3 border-2 border-black p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <input type="email" placeholder="EMAIL ADDRESS" className="w-full p-4 heading-font text-sm outline-none border-2 border-zinc-100" />
      <button className="bg-black text-white py-4 heading-font text-sm uppercase">SIGN UP</button>
    </div>
  </section>
);

// --- Shop Page ---
const ShopPage: React.FC<{ onAddToCart: (p: any) => void }> = ({ onAddToCart }) => {
  const [flavorFilter, setFlavorFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filtered = flavorFilter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.flavor === flavorFilter);

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col pt-24">
      <section className="bg-[#4A2C1A] py-16 px-6 border-b-4 border-black text-[#FFD700]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-6xl md:text-9xl heading-font uppercase leading-[0.8]">SHOP ALL</h1>
            <p className="heading-font text-[#00FF00] text-xl mt-4 uppercase">All yummy, clean protein bars!</p>
          </div>
          <img src="https://github.com/Rohworld/superyou/blob/main/Gemini_Generated_Image_9lvxil9lvxil9lvx-removebg-preview.png?raw=true" className="w-64 rotate-12 drop-shadow-xl" alt="Bar" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-64 space-y-8">
          <h3 className="heading-font text-2xl uppercase border-b-4 border-black pb-2">Filters</h3>
          <div className="flex flex-col gap-2">
            {['All', 'Almond', 'Peanut', 'Chocolate', 'Berry'].map(f => (
              <button 
                key={f} 
                onClick={() => setFlavorFilter(f)}
                className={`text-left p-3 border-2 border-black font-black uppercase transition-all ${flavorFilter === f ? 'bg-[#FFFF00] translate-x-1' : 'bg-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(p => (
            <div key={p.id} className="bg-white border-4 border-black p-4 brutalist-shadow hover:-translate-y-1 transition-transform group">
              <div className="aspect-square border-2 border-black overflow-hidden mb-4 relative">
                 <img src={p.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={p.name} />
                 <div className="absolute top-2 right-2 bg-black text-[#00FF00] px-2 py-1 heading-font text-xs border border-[#00FF00]">20G</div>
              </div>
              <h3 className="heading-font text-xl uppercase mb-1">{p.name}</h3>
              <p className="font-bold text-xs opacity-60 uppercase mb-4 h-8 line-clamp-2">{p.desc}</p>
              <div className="flex justify-between items-center pt-4 border-t-2 border-black">
                <span className="heading-font text-2xl">${p.price}</span>
                <button onClick={() => onAddToCart(p)} className="bg-[#FFFF00] p-2 border-2 border-black hover:bg-black hover:text-[#FFFF00] transition-all"><Plus /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Best Sellers Page ---
const BestSellersPage: React.FC<{ onAddToCart: (p: any) => void }> = ({ onAddToCart }) => (
  <div className="min-h-screen bg-[#F5F0E6] pt-24 pb-24">
    <section className="bg-[#4A2C1A] py-16 px-6 border-b-4 border-black text-[#FFD700] text-center">
      <h1 className="text-6xl md:text-9xl heading-font uppercase leading-[0.8] mb-6">BEST SELLERS</h1>
      <p className="heading-font text-[#00FF00] text-2xl uppercase">Crowd favorites fueled by clean protein!</p>
    </section>
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
      {PRODUCTS.slice(0, 4).map(p => (
        <div key={p.id} className="group">
           <div className="relative bg-white border-4 border-black p-4 pb-20 brutalist-shadow rotate-2 group-hover:rotate-0 transition-transform">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF69B4] text-white px-4 py-1 border-2 border-black heading-font text-sm uppercase">Bestseller</div>
              <img src={p.img} className="aspect-square object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all duration-500" alt={p.name} />
              <div className="mt-4 flex gap-1 justify-center"><Star size={16} fill="#FFD700" /><Star size={16} fill="#FFD700" /><Star size={16} fill="#FFD700" /><Star size={16} fill="#FFD700" /><Star size={16} fill="#FFD700" /></div>
           </div>
           <div className="mt-8 text-center">
              <h3 className="heading-font text-2xl uppercase">{p.name}</h3>
              <p className="font-bold italic text-sm text-[#4A2311]/60 mb-6">"{p.review}"</p>
              <button onClick={() => onAddToCart(p)} className="w-full bg-[#FFFF00] py-4 border-4 border-black heading-font uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">ADD TO PACK</button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Our Science Page ---
const OurSciencePage: React.FC<{ onShopNow: () => void }> = ({ onShopNow }) => (
  <div className="min-h-screen bg-[#F5F0E6] pt-24">
    <section className="bg-[#4A2C1A] py-16 px-6 text-center border-b-4 border-black text-[#FFD700]">
      <h1 className="text-6xl md:text-9xl heading-font uppercase leading-[0.8] mb-6">OUR SCIENCE</h1>
      <p className="heading-font text-[#109648] text-2xl uppercase">Clean energy, crave-worthy science.</p>
    </section>
    
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Zap size={40} />, title: "20G PROTEIN", desc: "Premium blend of fast & slow absorbing proteins." },
          { icon: <ShieldCheck size={40} />, title: "NO CRASH", desc: "Zero artificial sugars. Clean, steady fuel." },
          { icon: <Beaker size={40} />, title: "BIOAVAILABLE", desc: "Formulated for maximum nutrient absorption." }
        ].map((s, i) => (
          <div key={i} className="bg-white border-4 border-black p-8 brutalist-shadow-yellow text-center">
            <div className="inline-block p-4 bg-[#00FF00] border-2 border-black rounded-full mb-6">{s.icon}</div>
            <h3 className="heading-font text-2xl uppercase mb-4">{s.title}</h3>
            <p className="font-bold opacity-60 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-16 bg-white border-4 border-black p-10 brutalist-shadow-lg">
        <div className="flex-1 space-y-6">
          <h2 className="text-5xl heading-font uppercase">Nutrition That Counts.</h2>
          <p className="font-bold text-lg opacity-80">Our bars are designed by nutritionists who believe food should work as hard as you do.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 font-black text-xl uppercase"><CheckCircle className="text-[#00FF00]" /> 200 Calories</li>
            <li className="flex items-center gap-4 font-black text-xl uppercase"><CheckCircle className="text-[#00FF00]" /> 0g Added Sugars</li>
            <li className="flex items-center gap-4 font-black text-xl uppercase"><CheckCircle className="text-[#00FF00]" /> 7g Prebiotic Fiber</li>
          </ul>
        </div>
        <div className="w-full md:w-80 border-4 border-black p-6 bg-zinc-50 rotate-2">
           <h4 className="heading-font text-xl border-b-4 border-black mb-4 uppercase">Facts</h4>
           <div className="space-y-2 font-black uppercase text-sm">
             <div className="flex justify-between border-b border-black"><span>Protein</span><span>20g</span></div>
             <div className="flex justify-between border-b border-black"><span>Sugars</span><span>0g</span></div>
             <div className="flex justify-between border-b border-black"><span>Calories</span><span>200</span></div>
             <div className="flex justify-between"><span>Carbs</span><span>21g</span></div>
           </div>
        </div>
      </div>
      
      <div className="text-center py-20">
         <button onClick={onShopNow} className="bg-[#FFFF00] text-black border-4 border-black px-12 py-6 heading-font text-2xl uppercase shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">TRY THE SCIENCE</button>
      </div>
    </div>
  </div>
);

// --- The Story Page ---
const TheStoryPage: React.FC = () => (
  <div className="min-h-screen bg-[#F5F0E6] pt-24">
    <section className="bg-[#4A2C1A] py-16 px-6 text-center border-b-4 border-black text-[#FFD700]">
      <h1 className="text-6xl md:text-9xl heading-font uppercase leading-[0.8] mb-6">THE STORY</h1>
      <p className="heading-font text-[#FF69B4] text-2xl uppercase">From garage experiments to your gym bag.</p>
    </section>

    <div className="max-w-4xl mx-auto px-6 py-24 relative">
      <div className="absolute left-1/2 top-48 bottom-48 w-2 bg-black -translate-x-1/2 hidden md:block"></div>
      
      <div className="space-y-24">
        {[
          { year: "2020", title: "THE IDEA", desc: "Fitness fanatics tired of 'chalky' protein bars decide to make their own.", color: "bg-[#00FF00]" },
          { year: "2021", title: "FIRST BATCH", desc: "Sold out within 4 hours. We knew we were onto something big.", color: "bg-[#FFFF00]" },
          { year: "2023", title: "GOING CLEAN", desc: "Committed to 100% organic and zero artificial sweeteners.", color: "bg-[#FF69B4]" },
          { year: "2025", title: "SUPEYOU NATION", desc: "Over 1 million bars shipped worldwide. No excuses, just yummy protein.", color: "bg-[#FFA500]" }
        ].map((m, i) => (
          <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
             <div className="flex-1 w-full">
                <div className={`${m.color} border-4 border-black p-8 brutalist-shadow-lg relative`}>
                   <span className="heading-font text-4xl opacity-20 absolute -top-8 right-4">{m.year}</span>
                   <h3 className="heading-font text-2xl uppercase mb-4">{m.title}</h3>
                   <p className="font-bold opacity-70">{m.desc}</p>
                </div>
             </div>
             <div className="w-12 h-12 bg-black border-4 border-white rounded-full z-10 hidden md:block"></div>
             <div className="flex-1 hidden md:block"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Locations Page ---
const LocationsPage: React.FC = () => (
  <div className="min-h-screen bg-[#F5F0E6] pt-24">
    <section className="bg-[#4A2C1A] py-16 px-6 text-center border-b-4 border-black text-[#FFD700]">
      <h1 className="text-6xl md:text-9xl heading-font uppercase leading-[0.8] mb-6">LOCATIONS</h1>
      <p className="heading-font text-[#FFFF00] text-2xl uppercase">Find us at your favorite gyms & shops!</p>
    </section>
    
    <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {[
        { name: "Iron Temple Gym", addr: "123 Muscle Way, NY", type: "Gym" },
        { name: "Clean Eats Market", addr: "45 Health Ave, LA", type: "Retail" },
        { name: "SupeYou Flagship", addr: "99 Protein Lane, CHI", type: "Store" },
        { name: "Zen Yoga Studio", addr: "22 Flow St, SF", type: "Studio" },
        { name: "Titan Supplements", addr: "88 Gainz Blvd, MIA", type: "Supps" },
        { name: "Urban Fitness", addr: "10 City Ctr, LON", type: "Gym" }
      ].map((l, i) => (
        <div key={i} className="bg-white border-4 border-black p-6 brutalist-shadow flex flex-col items-center text-center">
          <MapPin size={48} className="text-[#FF69B4] mb-4" />
          <h3 className="heading-font text-2xl uppercase mb-2">{l.name}</h3>
          <p className="font-bold opacity-60 text-sm mb-4">{l.addr}</p>
          <span className="bg-[#00FF00] border-2 border-black px-4 py-1 heading-font text-xs uppercase">{l.type}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- Navigation Overlays ---

const MenuOverlay: React.FC<{ isOpen: boolean; onClose: () => void; onNavigate: (page: PageType) => void }> = 
  ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-[#00FF00] flex flex-col transition-all duration-300 animate-in fade-in">
      <div className="p-6 md:p-10 flex justify-between items-center border-b-4 border-black bg-[#00FF00] sticky top-0 z-10">
        <div className="text-4xl md:text-6xl heading-font text-black italic">MENU.</div>
        <button onClick={onClose} className="w-12 h-12 md:w-16 md:h-16 bg-black text-[#00FF00] flex items-center justify-center starburst hover:rotate-90 transition-transform">
          <X size={32} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-8 md:p-16 flex flex-col md:flex-row gap-12 md:gap-24">
        <div className="flex flex-col gap-6 md:gap-10">
          {[
            { label: 'HOME', page: 'home' as const },
            { label: 'SHOP ALL', page: 'shop' as const },
            { label: 'BEST SELLERS', page: 'best-sellers' as const },
            { label: 'OUR SCIENCE', page: 'our-science' as const },
            { label: 'THE STORY', page: 'the-story' as const },
            { label: 'LOCATIONS', page: 'locations' as const }
          ].map((item, i) => (
            <button 
              key={item.label} 
              onClick={() => onNavigate(item.page)}
              className="text-left text-4xl sm:text-6xl md:text-8xl lg:text-9xl heading-font text-black hover:text-white transition-all hover:translate-x-4 uppercase leading-[0.8] tracking-tighter group flex items-baseline gap-4"
            >
              <span className="text-sm md:text-3xl opacity-20 group-hover:opacity-100">0{i+1}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CartOverlay: React.FC<{ isOpen: boolean; onClose: () => void; cart: CartItem[]; onRemove: (id: number) => void; onUpdateQty: (id: number, d: number) => void }> = 
  ({ isOpen, onClose, cart, onRemove, onUpdateQty }) => {
  if (!isOpen) return null;
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-300">
      <div className="w-full sm:w-[450px] md:w-[550px] h-full bg-[#F5EBE0] border-l-4 border-black flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-10 bg-[#FF69B4] border-b-4 border-black flex justify-between items-center text-white">
          <h2 className="text-3xl md:text-5xl heading-font uppercase tracking-tighter">YOUR PACK</h2>
          <button onClick={onClose} className="w-10 h-10 md:w-14 md:h-14 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,184,0,1)]">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          {cart.length > 0 ? cart.map((item) => (
            <div key={item.id} className="bg-white border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-4 md:gap-8 group relative transition-transform hover:-translate-y-1">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-zinc-100 border-4 border-black overflow-hidden flex-shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="heading-font text-lg md:text-2xl uppercase leading-none mb-1">{item.name}</h3>
                  <p className="font-black text-sm md:text-lg text-[#FF69B4]">${item.price}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border-2 border-black bg-white">
                    <button onClick={() => onUpdateQty(item.id, -1)} className="p-2 hover:bg-[#00FF00] transition-colors"><Minus size={14}/></button>
                    <span className="px-4 font-black border-x-2 border-black">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} className="p-2 hover:bg-[#00FF00] transition-colors"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-zinc-300 hover:text-black transition-colors"><Trash2 size={20}/></button>
                </div>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <ShoppingBag size={80} className="mb-4" />
              <p className="heading-font text-3xl uppercase">Pack Empty!</p>
            </div>
          )}
        </div>
        <div className="p-6 md:p-10 border-t-4 border-black bg-white space-y-6">
          <div className="flex justify-between items-end">
            <span className="heading-font text-xl md:text-3xl uppercase">SUBTOTAL</span>
            <span className="heading-font text-3xl md:text-5xl text-[#FF69B4] leading-none tracking-tighter">${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-[#00FF00] text-black py-5 md:py-8 heading-font text-xl md:text-3xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all flex items-center justify-center gap-4">
            CHECKOUT <ArrowRight strokeWidth={4} size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => (
  <footer className="bg-[#4A2C1A] text-[#F5EBE0] py-16 md:py-24 px-6 text-center border-t-2 border-black/20">
    <div onClick={() => onNavigate('home')} className="text-4xl md:text-6xl heading-font text-[#FFA500] mb-8 cursor-pointer hover:scale-105 transition-transform inline-block">Supeyou</div>
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-bold text-sm uppercase mb-12">
      <button onClick={() => onNavigate('shop')} className="hover:text-[#FFA500] transition-colors">Shop</button>
      <button onClick={() => onNavigate('our-science')} className="hover:text-[#FFA500] transition-colors">Science</button>
      <button onClick={() => onNavigate('the-story')} className="hover:text-[#FFA500] transition-colors">Our Story</button>
      <button onClick={() => onNavigate('locations')} className="hover:text-[#FFA500] transition-colors">Locations</button>
    </div>
    <div className="flex justify-center gap-6 mb-12">
      <Instagram size={24} className="hover:text-[#FF69B4] cursor-pointer" />
      <Twitter size={24} className="hover:text-[#00FF00] cursor-pointer" />
      <Mail size={24} className="hover:text-[#FFFF00] cursor-pointer" />
    </div>
    <p className="opacity-30 text-[10px] uppercase tracking-[0.3em]">© 2026 Supeyou Corp. No Excuses. Just Protein.</p>
  </footer>
);

export default App;
