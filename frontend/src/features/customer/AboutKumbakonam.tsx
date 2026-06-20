import React from 'react';
import { motion } from 'framer-motion';

// Asset Imports
import heroImg from '../../assets/aboutkumbakonam/old-kumbakonam-hero.jpg';
import tankImg from '../../assets/aboutkumbakonam/mahamaham-tank.jpg';
import corridorImg from '../../assets/aboutkumbakonam/temple-corridors.jpg';
import coffeeImg from '../../assets/aboutkumbakonam/coffee-hotel-street.jpg';
import townStreetImg from '../../assets/aboutkumbakonam/IMG_5721.PNG';
import img5710 from '../../assets/aboutkumbakonam/IMG_5710 (2).PNG';
import img5713 from '../../assets/aboutkumbakonam/IMG_5713.PNG';
import insideImg from '../../assets/aboutkumbakonam/inside.PNG';
import streetImg from '../../assets/aboutkumbakonam/street.PNG';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
};

const AboutKumbakonam: React.FC = () => {
  return (
    <div id="about-kumbakonam" className="min-h-screen font-inter selection:bg-catalogue-gold selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h1 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black leading-tight mb-6 uppercase tracking-tight">
            WHY KUMBAKONAM IS CALLED<br />THE TEMPLE TOWN
          </h1>
          <p className="font-playfair text-lg md:text-xl text-catalogue-gold italic font-bold">
            "A sacred city where devotion, heritage and living tradition meet."
          </p>
          <div className="mt-12 max-w-3xl mx-auto text-left bg-white/50 backdrop-blur-sm p-8 border border-catalogue-gold/20 shadow-lg">
            <h2 className="font-playfair text-2xl md:text-3xl text-catalogue-green font-black mb-6 uppercase tracking-tight text-center">
              Why Kumbakonam is Called Kumbakonam
            </h2>
            <div className="space-y-4 text-catalogue-green/90 font-medium leading-relaxed">
              <p>
                The name Kumbakonam carries a beautiful traditional meaning that reflects the town’s sacred identity. In Tamil, “Konam” means direction or angle, and “Kumbam” refers to the holy temple kalasam or sacred pot-like crown seen on top of temples.
              </p>
              <p>
                In the olden days, Kumbakonam was filled with ancient temples, divine towers, and sacred streets. It is believed that wherever one stood within the town and looked in any direction, a temple kumbam would be visible. Every angle of the town carried the sight of divinity, and every direction reminded people of faith, tradition, and temple culture.
              </p>
              <p>
                This is why the land came to be lovingly known as Kumbakonam — a place where the Kumbam of a temple could be seen from every Konam. Though modern buildings have now changed the view in many places, the spiritual identity of Kumbakonam remains untouched. Even today, the town stands as a timeless temple town, where devotion lives in its streets, history rests in its walls, and divine grace rises above its skyline.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white p-4 shadow-2xl border border-catalogue-gold/10 overflow-hidden relative group">
            <div className="absolute inset-0 border-[12px] border-white/50 pointer-events-none z-10" />
            <img 
              src={heroImg} 
              alt="Old Kumbakonam Hero" 
              className="w-full h-auto object-cover aspect-[21/9]"
            />
            <div className="mt-6 text-center border-t border-catalogue-gold/20 pt-4">
              <p className="font-playfair text-sm text-catalogue-green/60 italic font-bold tracking-widest uppercase">
                Old Kumbakonam - a sacred town shaped by temples, tanks and timeless devotion.
              </p>
            </div>
          </div>
          
          <div className="mt-16 max-w-4xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-md p-10 md:p-16 shadow-2xl border border-catalogue-gold/20 relative">
              <div className="absolute inset-4 border border-catalogue-gold/10 pointer-events-none" />
              <div className="w-24 h-1 bg-catalogue-gold mx-auto mb-8" />
              <div className="space-y-8">
                <p className="font-playfair text-lg md:text-xl text-catalogue-green leading-relaxed font-semibold">
                  Kumbakonam is one of Tamil Nadu's most treasured spiritual towns, lovingly known as the Temple Town. The name is not just a title; it reflects the way temples, sacred tanks, traditional streets, rituals, festivals and daily life are deeply connected here.
                </p>
                <p className="font-playfair text-lg md:text-xl text-catalogue-green leading-relaxed font-semibold">
                  In Kumbakonam, temples are not separate tourist spots. They are part of the town's identity. Every street carries a sense of devotion, every gopuram tells a story, and every sacred tank reminds visitors of the spiritual traditions that have lived here for centuries.
                </p>
              </div>
              <div className="pt-12">
                 <div className="bg-catalogue-green py-6 px-4 border-y-2 border-catalogue-gold">
                    <p className="font-playfair text-xl md:text-2xl text-white font-bold uppercase tracking-widest text-center">
                      Stay Blessed. Stay Comfortable. Stay With Subra.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* DETAILED CONTENT SECTIONS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-24">
        
        {/* 1. A Town Woven Around Temples */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp} className="bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
            <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-playfair text-2xl font-black text-catalogue-green uppercase tracking-tight">A Town Woven Around Temples</h2>
              <div className="space-y-4 text-catalogue-green/90 font-medium leading-relaxed">
                <p>
                  Kumbakonam is called the Temple Town because temples are woven into the daily rhythm of the town. The streets, neighbourhoods and sacred water bodies are surrounded by shrines, temple towers, mandapams and traditional houses.
                </p>
                <p>
                  The town's spiritual character can be felt in many small details - the sound of temple bells, the fragrance of flowers near temple streets, evening lamps, devotional chants, local rituals and the movement of pilgrims from one shrine to another.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="relative bg-white p-3 shadow-xl border border-catalogue-gold/10">
            <img src={townStreetImg} alt="Temple Streets" className="w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute inset-0 border-[8px] border-white/40 pointer-events-none" />
            <p className="mt-3 text-[11px] text-center italic text-catalogue-green/60 font-bold uppercase tracking-wider">Temple streets of Kumbakonam reflect the town's living spiritual culture.</p>
          </motion.div>
        </div>

        {/* 2. The Sacred Identity of Mahamaham Tank */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp} className="md:order-2 bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
            <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-playfair text-2xl font-black text-catalogue-green uppercase tracking-tight">The Sacred Identity of Mahamaham Tank</h2>
              <div className="space-y-4 text-catalogue-green/90 font-medium leading-relaxed">
                <p>
                  Mahamaham Tank is one of the most important sacred landmarks of Kumbakonam. It is deeply connected with the religious identity of the town and is especially known for the Mahamaham festival, celebrated once in twelve years.
                </p>
                <p>
                  During the Mahamaham festival, devotees gather for holy bathing rituals and temple ceremonies. The sacred tank, the temples around it and the spiritual energy of the festival make Kumbakonam one of Tamil Nadu's most meaningful pilgrimage destinations.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="md:order-1 relative bg-white p-3 shadow-xl border border-catalogue-gold/10">
            <img src={tankImg} alt="Mahamaham Tank" className="w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute inset-0 border-[8px] border-white/40 pointer-events-none" />
            <p className="mt-3 text-[11px] text-center italic text-catalogue-green/60 font-bold uppercase tracking-wider">Mahamaham Tank - the sacred heart of Kumbakonam's temple tradition.</p>
          </motion.div>
        </div>

        {/* 3. The Origin Legend */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp} className="bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
            <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-playfair text-2xl font-black text-catalogue-green uppercase tracking-tight">The Origin Legend and Adi Kumbeswarar Temple</h2>
              <div className="space-y-4 text-catalogue-green/90 font-medium leading-relaxed">
                <p>
                  One of the most important spiritual landmarks of Kumbakonam is Arulmigu Adi Kumbeswarar Temple. This temple is closely connected with the origin legend of Kumbakonam and the sacred identity of the town.
                </p>
                <p>
                  The name Kumbakonam is traditionally linked with the divine pot, or kumbam, from which the sacred story of the town is believed to have emerged. Adi Kumbeswarar Temple stands as one of the most important Shiva temples connected with this legend.
                </p>
                <p>
                  For devotees, this temple is not only a place of worship but also a spiritual anchor of the town. It gives Kumbakonam its sacred foundation and continues to attract pilgrims who come to experience the town's ancient Shiva tradition.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="relative bg-white p-3 shadow-xl border border-catalogue-gold/10">
            <img src={img5710} alt="Adi Kumbeswarar" className="w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute inset-0 border-[8px] border-white/40 pointer-events-none" />
            <p className="mt-3 text-[11px] text-center italic text-catalogue-green/60 font-bold uppercase tracking-wider">Temple towers and sacred water bodies shape the visual soul of Kumbakonam.</p>
          </motion.div>
        </div>

        {/* 4. Shaivite and Vaishnavite Traditions */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp} className="md:order-2 bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
            <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-playfair text-2xl font-black text-catalogue-green uppercase tracking-tight">A Rare Meeting Place of Shaivite and Vaishnavite Traditions</h2>
              <div className="space-y-4 text-catalogue-green/90 font-medium leading-relaxed">
                <p>
                  Kumbakonam is spiritually rich because it carries both Shaivite and Vaishnavite traditions with great importance. Shaivite temples such as Arulmigu Adi Kumbeswarar Temple, Kasi Viswanathar Temple and Nageswaran Temple reflect the town's deep connection with Lord Shiva worship.
                </p>
                <p>
                  At the same time, Vaishnavite temples such as Sarangapani Temple and Arulmigu Sri Oppiliappan Temple represent the town's rich Vishnu temple heritage. Sarangapani Temple is one of the major spiritual landmarks of Kumbakonam and is especially known for its grand structure and Divya Desam significance.
                </p>
                <div className="py-6 border-l-4 border-catalogue-gold pl-8 bg-catalogue-green/5 rounded-r-lg">
                  <p className="font-playfair text-xl text-catalogue-green font-bold italic">
                    Kumbakonam brings together Shaivite and Vaishnavite traditions in one sacred town.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="md:order-1 relative bg-white p-3 shadow-xl border border-catalogue-gold/10">
            <img src={img5713} alt="Temple Heritage" className="w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute inset-0 border-[8px] border-white/40 pointer-events-none" />
          </motion.div>
        </div>

        {/* 5. Temple Architecture */}
        <div className="space-y-12">
           <motion.div {...fadeInUp} className="text-center max-w-4xl mx-auto">
             <div className="bg-white/90 backdrop-blur-md p-10 md:p-16 shadow-2xl border border-catalogue-gold/20 relative">
                <div className="absolute inset-4 border border-catalogue-gold/10 pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <h2 className="font-playfair text-3xl font-black text-catalogue-green uppercase tracking-tight">Temple Architecture That Carries Centuries of Craftsmanship</h2>
                  <p className="text-catalogue-green/90 font-medium leading-relaxed text-lg">
                    Kumbakonam and its surrounding region are known for beautiful South Indian temple architecture. The temples here display tall gopurams, sculpted stone walls, pillared corridors, carved mandapams, sacred tanks and traditional temple layouts.
                  </p>
                  <p className="text-catalogue-green/90 font-medium leading-relaxed">
                    The architecture is not only decorative. Every carving, pillar, tower and sculpture reflects devotion, mythology, craftsmanship and the artistic skill of earlier generations.
                  </p>
                </div>
             </div>
           </motion.div>
           
           <div className="grid md:grid-cols-2 gap-12">
              <motion.div {...fadeInUp} className="bg-white p-4 shadow-2xl border border-catalogue-gold/10 relative">
                 <img src={corridorImg} alt="Pillared Mandapam" className="w-full h-80 object-cover" />
                 <p className="mt-4 text-[11px] text-center italic text-catalogue-green/60 uppercase tracking-widest font-black">Pillared mandapams preserve the rhythm of South Indian stone architecture.</p>
              </motion.div>
              <motion.div {...fadeInUp} className="bg-white p-4 shadow-2xl border border-catalogue-gold/10 relative">
                 <img src={insideImg} alt="Sculptural Panel" className="w-full h-80 object-cover" />
                 <p className="mt-4 text-[11px] text-center italic text-catalogue-green/60 uppercase tracking-widest font-black">Sculptural panels show the detail and devotion of temple craftsmanship.</p>
              </motion.div>
           </div>

           <motion.div {...fadeInUp} className="bg-white/90 backdrop-blur-md p-10 border border-catalogue-gold/20 shadow-xl relative rounded-xl overflow-hidden">
              <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <p className="text-catalogue-green/90 font-medium leading-relaxed text-lg text-center max-w-4xl mx-auto">
                  Nearby Darasuram is home to Airavatesvara Temple, a Chola-era architectural masterpiece. Its sculpted stone work, mandapams and detailed carvings represent the excellence of Chola temple art. This makes the Kumbakonam region important for heritage lovers, photographers, and cultural travellers.
                </p>
                <div className="relative bg-white p-3 shadow-xl border border-catalogue-gold/10 max-w-4xl mx-auto">
                   <img src={streetImg} alt="Temple Corridors" className="w-full h-auto object-cover aspect-[21/9]" />
                   <p className="mt-4 text-[12px] text-center italic text-catalogue-green/60 font-bold">Inside temple corridors, stone pillars and shadows create the timeless devotional mood of Kumbakonam.</p>
                </div>
              </div>
           </motion.div>
        </div>

        {/* 6 & 7. Rituals & Streets */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp} className="bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
            <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
            <div className="relative z-10 space-y-12">
              <div className="space-y-6">
                <h2 className="font-playfair text-3xl font-bold text-catalogue-green">Living Rituals, Festivals and Devotional Culture</h2>
                <p className="text-catalogue-green/90 font-medium leading-relaxed">
                  Kumbakonam's temple identity is alive because rituals continue every day. The town is known for regular poojas, temple festivals, processions, lamps, alankarams, music and local devotional traditions.
                </p>
                <p className="text-catalogue-green/90 font-medium leading-relaxed">
                  During festival days, temple streets become lively with devotees, flowers, lamps, traditional sounds and sacred processions. The town carries an atmosphere where history is not silent; it continues through worship and community participation.
                </p>
              </div>
              <div className="space-y-6">
                <h2 className="font-playfair text-3xl font-bold text-catalogue-green">Sacred Tanks and Temple Streets</h2>
                <p className="text-catalogue-green/90 font-medium leading-relaxed">
                  Sacred tanks are an important part of Kumbakonam's spiritual geography. These water bodies are connected with temple rituals, festivals, purification practices and local tradition.
                </p>
                <p className="text-catalogue-green/90 font-medium leading-relaxed">
                  The temple streets around the town add to its old-world charm. Traditional houses, small shops, flower sellers, coffee hotels, pilgrims, autos, carts and temple towers together create a visual identity that belongs only to a temple town.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="sticky top-24 space-y-8">
             <div className="bg-white p-3 shadow-xl border border-catalogue-gold/10">
                <img src={coffeeImg} alt="Coffee Hotel Street" className="w-full h-auto object-cover aspect-[4/3]" />
                <p className="mt-3 text-[11px] text-center italic text-catalogue-green/60 font-bold uppercase tracking-wider">Temple streets, old markets and coffee culture together form the everyday soul of Kumbakonam.</p>
             </div>
          </motion.div>
        </div>

        {/* 8, 9, 10. Conclusion */}
        <div className="space-y-24">
           <div className="grid md:grid-cols-2 gap-16">
              <motion.div {...fadeInUp} className="bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
                 <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
                 <div className="relative z-10 space-y-6">
                   <h2 className="font-playfair text-3xl font-bold text-catalogue-green">A Gateway to Nearby Sacred Destinations</h2>
                   <p className="text-catalogue-green/90 font-medium leading-relaxed">
                      Kumbakonam is also called the Temple Town because it serves as a convenient base for visiting several important temples nearby. From Kumbakonam, guests can visit Darasuram, Oppiliappan Temple, Swamimalai, Thiruvidaimarudur and other sacred places.
                   </p>
                   <p className="text-catalogue-green/90 font-medium leading-relaxed">
                      For families, senior citizens and spiritual travellers, staying in Kumbakonam allows them to plan both short temple visits and extended spiritual routes comfortably. Subra Residency offers guests a practical base to explore this sacred region with ease.
                   </p>
                 </div>
              </motion.div>
              <motion.div {...fadeInUp} className="bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-xl border border-catalogue-gold/20 relative">
                 <div className="absolute inset-2 border border-catalogue-gold/10 pointer-events-none" />
                 <div className="relative z-10 space-y-6">
                   <h2 className="font-playfair text-3xl font-bold text-catalogue-green">Why Visitors Feel a Deep Connection With Kumbakonam</h2>
                   <p className="text-catalogue-green/90 font-medium leading-relaxed">
                      People visit Kumbakonam for many reasons. Some come for temple darshan, some for family rituals, others for architecture or festivals. What makes Kumbakonam special is that it offers all these experiences together.
                   </p>
                   <p className="text-catalogue-green/90 font-medium leading-relaxed">
                      Visitors often remember the town for its temple towers, sacred tanks, traditional streets, morning darshan, evening lamps, old coffee culture, devotional sounds and the calm feeling of being in a place shaped by faith.
                   </p>
                 </div>
              </motion.div>
           </div>

           <motion.div 
             {...fadeInUp}
             className="bg-catalogue-green text-white p-12 md:p-20 text-center rounded-3xl relative overflow-hidden"
           >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <img src={heroImg} className="w-full h-full object-cover" alt="Background" />
              </div>
              <div className="relative z-10 space-y-8">
                 <h2 className="font-playfair text-4xl md:text-5xl font-bold">Stay Close to the Spirit of the Temple Town</h2>
                 <p className="max-w-3xl mx-auto text-white/80 text-lg leading-relaxed font-medium">
                    Subra Residency places guests close to the heart of Kumbakonam. With easy access to the railway station, bus stand, temples, sacred tanks and nearby spiritual landmarks, the property is suitable for pilgrims, families, senior citizens, heritage travellers and guests visiting for functions or celebrations.
                 </p>
                 <p className="max-w-3xl mx-auto text-white/80 text-lg leading-relaxed font-medium">
                    Guests can begin the day with temple darshan, explore the sacred streets, visit nearby shrines, return for a peaceful stay and continue their journey with comfort. Subra Residency is not just a place to stay. It is a comfortable gateway to the spiritual experience of Kumbakonam.
                 </p>
                 
                 <div className="pt-10 space-y-4">
                    <p className="font-playfair text-2xl md:text-3xl text-catalogue-gold font-black uppercase tracking-[0.2em]">
                       Sacred Heritage. Timeless Devotion.
                    </p>
                    <p className="font-playfair text-xl md:text-2xl text-white italic font-bold">
                       The Living Spirit of Kumbakonam.
                    </p>
                    <div className="mt-12 py-6 border-y border-catalogue-gold/30">
                       <p className="font-playfair text-2xl md:text-3xl text-catalogue-gold font-bold uppercase tracking-widest">
                          Stay Blessed. Stay Comfortable. Stay With Subra.
                       </p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>

      </section>
    </div>
  );
};

export default AboutKumbakonam;

