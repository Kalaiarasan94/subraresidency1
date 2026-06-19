import room1 from '../../../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_38 PM (3).png';
import room2 from '../../../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_42 PM (6).png';
import room3 from '../../../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_42 PM (7).png';
import room4 from '../../../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_42 PM (8).png';
import room5 from '../../../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_43 PM (10).png';
import room6 from '../../../assets/hotel/rooms/ChatGPT Image May 16, 2026, 07_23_43 PM (9).png';
import hidden1 from '../../../assets/hidden/IMG_5703.PNG';
import hidden2 from '../../../assets/hidden/IMG_5704.PNG';
import hidden3 from '../../../assets/hidden/IMG_5705.PNG';
import hidden4 from '../../../assets/hidden/IMG_5706.PNG';
import hidden5 from '../../../assets/hidden/IMG_5707.PNG';
import hidden6 from '../../../assets/hidden/IMG_5709.PNG';
import { airavatesvaraImg, mahamahamImg, ramaswamyImg, sarangapaniImg, uppiliappanImg } from './assets';
export const ROOMS_DATA = [
  {
    id: 'deluxe',
    title: "Deluxe Room",
    price: "₹3,500",
    image: room1,
    images: [room1, room4],
    desc: "A comfortable and thoughtfully arranged room for a calm, restful stay. Ideal for up to 2 guests. (Kids can be allowed if any).",
    details: {
      bed: "King Size Bed",
      ac: "Fully Air Conditioned",
      wifi: "High Speed Free Wi-Fi",
      tv: "42 inch Smart TV",
      view: "City View"
    }
  },
  {
    id: 'super-deluxe',
    title: "Super Deluxe Room",
    price: "₹4,500",
    image: room2,
    images: [room2, room5],
    desc: "A spacious 1 BHK-style stay with added living comfort. Suitable for 2 or 3 guests.",
    details: {
      bed: "Queen Size + Single Bed",
      ac: "Fully Air Conditioned",
      wifi: "High Speed Free Wi-Fi",
      tv: "50 inch Smart TV",
      view: "Temple View"
    }
  },
  {
    id: 'executive-family',
    title: "Executive Family Suite Room",
    price: "₹7,500",
    image: room3,
    images: [room3, room6],
    desc: "A premium family stay with spacious interiors and enhanced comfort. Suitable for 4 to 6 guests.",
    details: {
      bed: "2 King Size Beds",
      ac: "Centrally Air Conditioned",
      wifi: "High Speed Free Wi-Fi",
      tv: "55 inch Smart TV",
      view: "Panoramic View"
    }
  }
];

export const ATTRACTIONS_DATA = [
  {
    title: "Mahamaham Tank",
    dist: "700 meters",
    preferred: "Walk / auto",
    image: mahamahamImg
  },
  {
    title: "Kasi Viswanathar Temple",
    dist: "700 meters",
    preferred: "Walk / auto",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Nageswaran Temple",
    dist: "1.2 kilometers",
    preferred: "Auto preferred",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sarangapani Temple",
    dist: "1.8 kilometers",
    preferred: "Auto",
    image: sarangapaniImg
  },
  {
    title: "Arulmigu Adi Kumbeswarar Temple",
    dist: "2.3 kilometers",
    preferred: "Auto / cab",
    image: ramaswamyImg // Using ramaswamy as a proxy if not specific
  },
  { title: "Chakrapani Temple", dist: "2.8 kilometers", preferred: "Auto", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { title: "Airavatesvara Temple", dist: "4.5 kilometers", preferred: "Auto / cab", image: airavatesvaraImg },
  { title: "Sri Oppiliappan Temple", dist: "6.6 kilometers", preferred: "Cab / auto", image: uppiliappanImg },
  { title: "Sri Swarnapureeswarar Temple", dist: "6.6 kilometers", preferred: "Cab recommended", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { title: "Swamimalai Murugan Temple", dist: "7.9 kilometers", preferred: "Cab recommended", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { title: "Mahalinga Swamy Temple", dist: "10 kilometers", preferred: "Cab recommended", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" }
];

export const HIDDEN_TRAILS_DATA = [
  {
    title: "Azhagaputhur Swarnapureeswarar Temple",
    dist: "6–7 km",
    speciality: "Rare Murugan holding Sangu and Chakra instead of Vel.",
    prayer: "Courage, protection, family welfare, ancestral blessings.",
    image: hidden1
  },
  {
    title: "Abhi Mukheswarar Temple",
    dist: "1 km",
    speciality: "Mahamaham-associated Shiva temple.",
    prayer: "Health, planetary harmony, peace.",
    image: hidden2
  },
  {
    title: "Karkadeswarar Temple, Thirundudevankudi",
    dist: "10 km",
    speciality: "Cancer Rasi and Ayilyam star temple tradition.",
    prayer: "Health, emotional wellbeing, planetary relief.",
    image: hidden3
  },
  {
    title: "Innambur Ezhutharinathar Temple",
    dist: "10 km",
    speciality: "Temple of learning, writing and Vidyabhyasam.",
    prayer: "Education, wisdom, learning ability, exam confidence.",
    image: hidden4
  },
  {
    title: "Thiruvalanchuzhi Swetha Vinayagar Temple",
    dist: "6–7 km",
    speciality: "Rare White Vinayagar formed from sea foam tradition.",
    prayer: "Obstacle removal, auspicious beginnings, prosperity.",
    image: hidden5
  },
  {
    title: "Kottaiyur Kodeeswarar Temple",
    dist: "5 km",
    speciality: "Unique Navagraha arrangement.",
    prayer: "Prosperity, family peace, planetary balance.",
    image: hidden6
  },
  {
    title: "Sakkottai Amirthakadeswarar Temple",
    dist: "5–6 km",
    speciality: "Connected to the sacred Amirtha Kalasam legend.",
    prayer: "Life renewal, spiritual cleansing, family welfare.",
    image: hidden1
  },
  {
    title: "Thirupurambiyam Sakshinatheswarar Temple",
    dist: "8–10 km",
    speciality: "Pralayam Katha Vinayagar tradition.",
    prayer: "Protection, education, child blessings.",
    image: hidden2
  },
  {
    title: "Patteeswaram Dhenupureeswarar Temple",
    dist: "8 km",
    speciality: "Famous Durga shrine.",
    prayer: "Courage, protection, overcoming obstacles.",
    image: hidden3
  },
  {
    title: "Thirucherai Sara Parameswarar Temple",
    dist: "15 km",
    speciality: "Rina Vimochana Lingeswarar tradition.",
    prayer: "Debt relief, financial peace, family stability.",
    image: hidden4
  },
  {
    title: "Thirucherai Saranatha Perumal Temple",
    dist: "15 km",
    speciality: "Rare Divya Desam with five consorts.",
    prayer: "Family harmony, marriage blessings, prosperity.",
    image: hidden5
  },
  {
    title: "Nachiyar Koil Kal Garuda Temple",
    dist: "10 km",
    speciality: "Famous Kal Garuda procession tradition.",
    prayer: "Protection, prosperity and dosha relief.",
    image: hidden6
  },
  {
    title: "Thirubhuvanam Kampaheswarar Temple",
    dist: "7 km",
    speciality: "Sarabeswarar shrine and Chola architecture.",
    prayer: "Protection, legal relief, fear removal.",
    image: hidden1
  },
  {
    title: "Thiruvisanallur Sivayoginathar Temple",
    dist: "8–10 km",
    speciality: "Chatur Kala Bhairava worship.",
    prayer: "Business growth, prosperity and protection.",
    image: hidden2
  }
];

export const RECOMMENDED_TRAILS_DATA = [
  {
    title: "Trail 1: Short Hidden Trail (3–4 Hours)",
    route: "Azhagaputhur Swarnapureeswarar Temple → Kottaiyur Kodeeswarar Temple → Thiruvalanchuzhi Swetha Vinayagar Temple",
    bestFor: "Rare Murugan Darshan, Navagraha worship and Vinayagar blessings."
  },
  {
    title: "Trail 2: Education & Blessings Trail",
    route: "Innambur Ezhutharinathar Temple → Thirupurambiyam Sakshinatheswarar Temple → Azhagaputhur Swarnapureeswarar Temple",
    bestFor: "Students, children and families seeking education-related blessings."
  },
  {
    title: "Trail 3: Parihara & Protection Trail",
    route: "Abhi Mukheswarar Temple → Thirucherai Sara Parameswarar Temple → Thirubhuvanam Kampaheswarar Temple → Thiruvisanallur Sivayoginathar Temple",
    bestFor: "Health, debt relief, protection and spiritual wellbeing."
  },
  {
    title: "Trail 4: Full Day Sacred Discovery",
    route: "Patteeswaram Dhenupureeswarar Temple → Thirucherai Temples → Nachiyar Koil Kal Garuda Temple → Thirubhuvanam Kampaheswarar Temple",
    bestFor: "Complete spiritual exploration covering Shiva, Vishnu and Durga traditions."
  }
];

export const TEMPLE_DETAILS_DATA = [
  {
    name: "Mahamaham Tank",
    dist: "Approximately 700 meters",
    mode: "Walk / Auto",
    timing: "6:00 AM–10:00 AM and 4:30 PM–7:00 PM",
    dressCode: "Modest attire recommended",
    specialFor: "Mahamaham festival, holy bathing rituals, sacred tank visit and spiritual photography.",
    desc: "Mahamaham Tank is one of the most sacred landmarks of Kumbakonam and closely connected with the spiritual identity of the town. It is especially known for the Mahamaham festival, celebrated once in twelve years and visited by devotees from many places. The tank is associated with holy bathing rituals and temple traditions.",
    guestNote: "Since it is very close to Subra Residency, guests can visit by walk or auto.",
    image: mahamahamImg
  },
  {
    name: "Kasi Viswanathar Temple",
    dist: "Approximately 700 meters",
    mode: "Walk / Auto",
    timing: "7:00 AM–12:00 PM and 4:00 PM–8:00 PM",
    dressCode: "Traditional / modest attire recommended",
    specialFor: "Shiva darshan, Mahamaham-area temple visit and peaceful spiritual atmosphere.",
    desc: "Kasi Viswanathar Temple is a revered Shiva temple located near Mahamaham Tank. It is an important temple for devotees seeking Lord Shiva's blessings and is closely connected with the sacred character of Kumbakonam. The temple is suitable for peaceful darshan and can be easily combined with a visit to Mahamaham Tank.",
    guestNote: "This is a convenient short visit from the hotel.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Nageswaran Temple",
    dist: "Approximately 1.2 kilometers",
    mode: "Auto preferred",
    timing: "6:00 AM–12:00 PM and 4:00 PM–8:30 PM",
    dressCode: "Modest traditional attire recommended",
    specialFor: "Chola-era architecture, Shiva worship, peaceful darshan and heritage interest.",
    desc: "Nageswaran Temple is an ancient Shiva temple admired for its Chola-era architectural style and calm spiritual setting. It is one of the important temples within Kumbakonam town and is visited by devotees as well as heritage lovers. The temple's traditional structure, stone work and peaceful ambience make it a meaningful stop in the in-town spiritual trail.",
    guestNote: "Auto is preferred for a comfortable visit.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sarangapani Temple",
    dist: "Approximately 1.8 kilometers",
    mode: "Auto",
    timing: "6:00 AM–12:30 PM and 4:00 PM–9:00 PM",
    dressCode: "Traditional / modest attire recommended",
    specialFor: "Divya Desam worship, Lord Vishnu darshan, chariot-style sanctum and grand temple architecture.",
    desc: "Sarangapani Temple is one of the most important Vishnu temples in Kumbakonam and is associated with the Divya Desam tradition. The temple is known for its grand structure, deep Vaishnavite significance and impressive chariot-style sanctum. It is one of the must-visit temples for guests exploring the spiritual identity of Kumbakonam.",
    guestNote: "Suitable for both pilgrims and heritage travellers.",
    image: sarangapaniImg
  },
  {
    name: "Arulmigu Adi Kumbeswarar Temple",
    dist: "Approximately 2.3 kilometers",
    mode: "Auto / Cab",
    timing: "5:30 AM–12:00 PM and 4:00 PM–8:30 PM",
    dressCode: "Fully covered traditional / modest attire recommended",
    specialFor: "Major Shiva temple, Kumbakonam origin legend, Mahamaham connection and traditional worship.",
    desc: "Arulmigu Adi Kumbeswarar Temple is one of the most important Shiva temples in Kumbakonam. It is closely connected with the origin legend of Kumbakonam and the sacred Mahamaham tradition. The temple is one of the main spiritual landmarks of the town and is considered an essential visit for pilgrims coming to Kumbakonam.",
    guestNote: "Plan extra time during festival days, Pradosham and auspicious occasions.",
    image: ramaswamyImg
  },
  {
    name: "Chakrapani Temple",
    dist: "Approximately 2.8 kilometers",
    mode: "Auto",
    timing: "6:00 AM–12:00 PM and 4:00 PM–8:30 PM",
    dressCode: "Traditional / modest attire recommended",
    specialFor: "Sudarshana Chakra worship, Vishnu temple tradition and peaceful darshan.",
    desc: "Chakrapani Temple is a historic Vishnu temple dedicated to Sudarshana Chakra. It is known for its unique iconography and peaceful temple atmosphere. The temple is an important Vaishnavite spiritual stop within Kumbakonam and can be included along with other nearby town temples.",
    guestNote: "Can be combined with Sarangapani Temple and other nearby temples.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Airavatesvara Temple, Darasuram",
    dist: "Approximately 4.5 kilometers",
    mode: "Auto / Cab",
    timing: "6:00 AM–12:00 PM and 4:00 PM–8:00 PM",
    dressCode: "Modest attire recommended",
    specialFor: "Chola architecture, UNESCO-recognised heritage, sculptural beauty and stone carvings.",
    desc: "Airavatesvara Temple at Darasuram is one of the finest examples of Chola temple architecture near Kumbakonam. It is admired for its stone carvings, sculpted mandapams, detailed pillars and artistic beauty. The temple is especially suitable for guests who love heritage, sculpture, photography and South Indian temple architecture.",
    guestNote: "Cab or auto is recommended for a comfortable visit.",
    image: airavatesvaraImg
  },
  {
    name: "Arulmigu Sri Oppiliappan Temple",
    dist: "Approximately 6.2 kilometers",
    mode: "Cab / Auto",
    timing: "6:00 AM–1:00 PM and 4:00 PM–9:00 PM",
    dressCode: "Traditional / modest attire recommended",
    specialFor: "Divya Desam worship, salt-free prasadam, Lord Vishnu darshan and family prayers.",
    desc: "Arulmigu Sri Oppiliappan Temple is a sacred Divya Desam dedicated to Lord Vishnu. The temple is especially known for its prasadam prepared without salt and its strong Vaishnavite tradition. It is a major pilgrimage destination near Kumbakonam and is highly suitable for families and devotees.",
    guestNote: "Cab is recommended for families and senior citizens.",
    image: uppiliappanImg
  },
  {
    name: "Sri Swarnapureeswarar Temple",
    dist: "Approximately 6.6 kilometers",
    mode: "Cab recommended",
    timing: "6:00 AM–12:00 PM and 4:30 PM–8:30 PM",
    dressCode: "Modest traditional attire recommended",
    specialFor: "Shiva worship, calm temple atmosphere, local spiritual tradition and peaceful darshan.",
    desc: "Sri Swarnapureeswarar Temple is a revered Shiva temple known for its peaceful ambience, spiritual significance and traditional local worship practices. It is a meaningful stop for guests who wish to explore a quieter temple away from the busier town centre.",
    guestNote: "Best visited by cab for a smoother travel experience.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Swamimalai Murugan Temple",
    dist: "Approximately 7.9 kilometers",
    mode: "Cab recommended",
    timing: "6:00 AM–12:00 PM and 4:00 PM–8:30 PM",
    dressCode: "Traditional / modest attire recommended",
    specialFor: "Arupadai Veedu temple, Lord Murugan worship, Pranava mantra legend and family pilgrimage.",
    desc: "Swamimalai Murugan Temple is one of the six sacred abodes of Lord Murugan. The temple is celebrated for the legend of Lord Murugan teaching the meaning of the Pranava mantra. It is one of the most important Murugan temples near Kumbakonam and is a must-visit for Lord Murugan devotees.",
    guestNote: "Cab is recommended, especially for families and elderly guests.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Thiruvidaimarudur Mahalinga Swamy Temple",
    dist: "Approximately 10 kilometers",
    mode: "Cab recommended",
    timing: "5:30 AM–12:30 PM and 4:00 PM–9:00 PM",
    dressCode: "Traditional / modest attire recommended",
    specialFor: "Major Shiva worship, grand temple corridors, powerful spiritual atmosphere and traditional darshan.",
    desc: "Thiruvidaimarudur Mahalinga Swamy Temple is a major Shiva sthalam known for its grand scale, majestic corridors and powerful spiritual atmosphere. It is one of the important Shiva temples near Kumbakonam. The temple's size, traditional ambience and sanctity make it a meaningful part of the extended temple trail.",
    guestNote: "Cab is preferred due to the distance from the property.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  }
];

