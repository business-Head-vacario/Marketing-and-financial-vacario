/**
 * Demo data for Vacario. Idempotent-ish: it wipes the tables it owns and
 * rebuilds them, so `npm run db:reset` always lands on the same tour.
 *
 * Every account uses the password: vacario123
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const PASSWORD = "vacario123";
const seedImage = (name: string) => `/seed/${name}`;
const json = (values: string[]) => JSON.stringify(values);
const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000);

async function reset() {
  // Order matters: children before parents.
  await db.notification.deleteMany();
  await db.payment.deleteMany();
  await db.booking.deleteMany();
  await db.review.deleteMany();
  await db.comment.deleteMany();
  await db.like.deleteMany();
  await db.save.deleteMany();
  await db.media.deleteMany();
  await db.post.deleteMany();
  await db.itineraryStop.deleteMany();
  await db.itineraryDay.deleteMany();
  await db.itinerary.deleteMany();
  await db.packageDay.deleteMany();
  await db.package.deleteMany();
  await db.agency.deleteMany();
  await db.follow.deleteMany();
  await db.user.deleteMany();
}

async function main() {
  console.log("· resetting");
  await reset();
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  console.log("· users");
  const users = await Promise.all(
    [
      {
        email: "admin@vacario.app",
        username: "vacario",
        name: "Vacario Team",
        role: "ADMIN",
        avatarUrl: seedImage("avatar-admin.svg"),
        coverUrl: seedImage("cover-traveller.svg"),
        bio: "We keep the feed honest and the agencies verified.",
        homeCity: "Bengaluru",
        country: "India",
        interests: json(["Culture & heritage", "Mountains"]),
        travelStyle: "Comfort seeker",
      },
      {
        email: "ananya@vacario.app",
        username: "ananya.rides",
        name: "Ananya Rao",
        role: "TRAVELLER",
        avatarUrl: seedImage("avatar-ananya.svg"),
        coverUrl: seedImage("cover-backpack.svg"),
        bio: "Solo rider. 14 states down. Slow travel, street food, and too many photos of dogs.",
        homeCity: "Bengaluru",
        country: "India",
        website: "instagram.com/ananya.rides",
        interests: json(["Road trips", "Mountains", "Food trails", "Photography", "Solo travel"]),
        travelStyle: "Budget backpacker",
      },
      {
        email: "dev@vacario.app",
        username: "devkapoor",
        name: "Dev Kapoor",
        role: "TRAVELLER",
        avatarUrl: seedImage("avatar-dev.svg"),
        coverUrl: seedImage("cover-luxe.svg"),
        bio: "Product designer, part-time diver. If it has a reef, I've probably queued for it.",
        homeCity: "Mumbai",
        country: "India",
        interests: json(["Beaches", "Scuba & water sports", "Luxury stays", "Workation"]),
        travelStyle: "Digital nomad",
      },
      {
        email: "meera@vacario.app",
        username: "meera.trails",
        name: "Meera Pillai",
        role: "TRAVELLER",
        avatarUrl: seedImage("avatar-meera.svg"),
        coverUrl: seedImage("cover-himalaya.svg"),
        bio: "Trek leader turned travel writer. Altitude is a feeling, not a number.",
        homeCity: "Kochi",
        country: "India",
        interests: json(["Trekking", "Mountains", "Wildlife", "Festivals"]),
        travelStyle: "Solo explorer",
      },
      {
        email: "farah@vacario.app",
        username: "farah.q",
        name: "Farah Qureshi",
        role: "TRAVELLER",
        avatarUrl: seedImage("avatar-farah.svg"),
        coverUrl: seedImage("cover-desert.svg"),
        bio: "Family holidays with two kids and one very opinionated grandmother.",
        homeCity: "Hyderabad",
        country: "India",
        interests: json(["Family holidays", "Culture & heritage", "Beaches"]),
        travelStyle: "Family holidays",
      },
      {
        email: "kabir@vacario.app",
        username: "kabir.360",
        name: "Kabir Mehta",
        role: "TRAVELLER",
        avatarUrl: seedImage("avatar-kabir.svg"),
        coverUrl: seedImage("cover-coastal.svg"),
        bio: "I shoot everything in 360°. Drag my posts around — that's the point.",
        homeCity: "Delhi",
        country: "India",
        interests: json(["Photography", "Mountains", "Beaches", "Festivals"]),
        travelStyle: "Comfort seeker",
      },
      {
        email: "arjun@himalayatrails.in",
        username: "arjun.himalaya",
        name: "Arjun Singh Rawat",
        role: "AGENT",
        avatarUrl: seedImage("avatar-arjun.svg"),
        coverUrl: seedImage("cover-himalaya.svg"),
        bio: "Running small-group treks out of Manali since 2011.",
        homeCity: "Manali",
        country: "India",
        interests: json(["Trekking", "Mountains"]),
        travelStyle: "Group trips",
      },
      {
        email: "hello@coastalcompass.in",
        username: "coastal.compass",
        name: "Nisha Fernandes",
        role: "AGENT",
        avatarUrl: seedImage("avatar-coastal.svg"),
        coverUrl: seedImage("cover-coastal.svg"),
        bio: "Islands, reefs and slow boats. Goa · Andamans · Maldives.",
        homeCity: "Panaji",
        country: "India",
        interests: json(["Beaches", "Scuba & water sports"]),
        travelStyle: "Comfort seeker",
      },
      {
        email: "book@desertroutes.in",
        username: "desert.routes",
        name: "Vikram Rathore",
        role: "AGENT",
        avatarUrl: seedImage("avatar-desert.svg"),
        coverUrl: seedImage("cover-desert.svg"),
        bio: "Rajasthan beyond the postcard: village stays, folk musicians, real dunes.",
        homeCity: "Jaisalmer",
        country: "India",
        interests: json(["Culture & heritage", "Festivals"]),
        travelStyle: "Group trips",
      },
    ].map((data) => db.user.create({ data: { ...data, passwordHash, onboarded: true } })),
  );

  const byUsername = Object.fromEntries(users.map((user) => [user.username, user]));

  console.log("· follows");
  const followPairs: [string, string][] = [
    ["ananya.rides", "meera.trails"],
    ["ananya.rides", "kabir.360"],
    ["ananya.rides", "arjun.himalaya"],
    ["devkapoor", "coastal.compass"],
    ["devkapoor", "ananya.rides"],
    ["meera.trails", "arjun.himalaya"],
    ["meera.trails", "ananya.rides"],
    ["farah.q", "desert.routes"],
    ["farah.q", "coastal.compass"],
    ["kabir.360", "ananya.rides"],
    ["kabir.360", "desert.routes"],
    ["vacario", "arjun.himalaya"],
  ];
  await db.follow.createMany({
    data: followPairs.map(([follower, following]) => ({
      followerId: byUsername[follower].id,
      followingId: byUsername[following].id,
    })),
  });

  console.log("· agencies");
  const himalaya = await db.agency.create({
    data: {
      ownerId: byUsername["arjun.himalaya"].id,
      name: "Himalaya Trails",
      slug: "himalaya-trails",
      tagline: "Small-group treks in Himachal & Ladakh since 2011",
      about:
        "We run groups of eight, never more. Local guides from the valleys we walk through, homestays over hotels wherever the road allows, and a genuine acclimatisation plan instead of a rushed itinerary.\n\nEvery trip is led by a certified mountain leader with wilderness first-aid training. We carry oxygen and a pulse oximeter on all high-altitude departures.",
      logoUrl: seedImage("logo-himalaya.svg"),
      coverUrl: seedImage("cover-himalaya.svg"),
      city: "Manali",
      country: "India",
      address: "Old Manali Road, near HPTDC, Manali 175131",
      phone: "+91 98160 44210",
      email: "hello@himalayatrails.in",
      website: "himalayatrails.in",
      licenseNo: "HP/TOUR/2011/00418",
      gstNo: "02ABCDE1234F1Z5",
      yearsInBusiness: 14,
      teamSize: 12,
      specialties: json(["Adventure & trekking", "Domestic tours", "Custom itineraries", "Corporate & MICE"]),
      languages: json(["English", "Hindi", "Punjabi"]),
      status: "VERIFIED",
    },
  });

  const coastal = await db.agency.create({
    data: {
      ownerId: byUsername["coastal.compass"].id,
      name: "Coastal Compass",
      slug: "coastal-compass",
      tagline: "Islands, reefs and slow boats",
      about:
        "PADI-affiliated dive trips and island-hopping holidays across Goa, the Andamans and the Maldives. We book the boats ourselves, so the schedule is ours to fix when the weather turns.",
      logoUrl: seedImage("logo-coastal.svg"),
      coverUrl: seedImage("cover-coastal.svg"),
      city: "Panaji",
      country: "India",
      address: "Rua de Ourem, Fontainhas, Panaji 403001",
      phone: "+91 90110 77321",
      email: "hello@coastalcompass.in",
      website: "coastalcompass.in",
      licenseNo: "GA/TOUR/2016/01192",
      gstNo: "30ZXCVB9876K1Z2",
      yearsInBusiness: 9,
      teamSize: 7,
      specialties: json(["Adventure & trekking", "Honeymoon", "International tours", "Cruises"]),
      languages: json(["English", "Hindi", "Konkani", "Marathi"]),
      status: "VERIFIED",
    },
  });

  const desert = await db.agency.create({
    data: {
      ownerId: byUsername["desert.routes"].id,
      name: "Desert Routes",
      slug: "desert-routes",
      tagline: "Rajasthan beyond the postcard",
      about:
        "Village homestays, folk musicians who actually live in the villages, and camel routes that avoid the tour-bus dunes. Family-run, three generations in Jaisalmer.",
      logoUrl: seedImage("logo-desert.svg"),
      coverUrl: seedImage("cover-desert.svg"),
      city: "Jaisalmer",
      country: "India",
      address: "Gandhi Chowk, Jaisalmer 345001",
      phone: "+91 94140 22876",
      email: "book@desertroutes.in",
      website: "desertroutes.in",
      licenseNo: "RJ/TOUR/2021/00733",
      yearsInBusiness: 4,
      teamSize: 5,
      specialties: json(["Domestic tours", "Custom itineraries", "Pilgrimage"]),
      languages: json(["English", "Hindi", "Gujarati"]),
      status: "PENDING",
    },
  });

  console.log("· packages");
  type PackageSeed = Parameters<typeof db.package.create>[0]["data"];
  const packageSeeds: PackageSeed[] = [
    {
      agencyId: himalaya.id,
      title: "Spiti Valley circuit — 7 days from Manali",
      slug: "spiti-valley-circuit-7-days",
      destination: "Spiti Valley",
      country: "India",
      startCity: "Manali",
      summary: "High-altitude villages, thousand-year-old monasteries and two 4,000 m passes in a week.",
      description:
        "The classic Spiti loop, paced so your body keeps up: Manali over Kunzum La to Kaza, three days exploring Key, Kibber, Langza and Chandratal, then out via Shimla.\n\nWe travel in a Tempo Traveller with an oxygen cylinder on board and stop at Chandratal for a night under a genuinely absurd number of stars.",
      category: "ADVENTURE",
      durationDays: 7,
      durationNights: 6,
      price: 32500,
      currency: "INR",
      discountPercent: 12,
      minGuests: 2,
      maxGuests: 8,
      inclusions: json([
        "6 nights in homestays & camps",
        "All breakfasts and dinners",
        "Tempo Traveller with driver",
        "Inner-line permits",
        "Certified mountain leader",
        "Oxygen cylinder & first-aid kit",
      ]),
      exclusions: json(["Flights or trains to Manali", "Lunches on transit days", "Travel insurance", "Personal expenses"]),
      highlights: json([
        "Sunrise at Key Monastery",
        "A night at Chandratal lake",
        "Langza fossil hunt at 4,400 m",
        "Kunzum La crossing",
        "Homestay dinner in Kibber",
      ]),
      images: json([seedImage("photo-spiti.svg"), seedImage("photo-kaza.svg"), seedImage("photo-pangong.svg")]),
      coverUrl: seedImage("photo-spiti.svg"),
      availableFrom: daysFromNow(20),
      availableTo: daysFromNow(200),
      instantBook: true,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Manali → Jispa", description: "Early start over Atal Tunnel, lunch at Sissu, easy first day to help you acclimatise.", stay: "Riverside guesthouse, Jispa", meals: "Breakfast, dinner" },
          { dayNumber: 2, title: "Jispa → Kaza via Kunzum La", description: "The long one. Kunzum La at 4,590 m, prayer flags, and the first proper view of Spiti.", stay: "Homestay, Kaza", meals: "Breakfast, dinner" },
          { dayNumber: 3, title: "Key, Kibber and Chicham bridge", description: "Monastery morning, Asia's highest bridge in the afternoon, back to Kaza for momos.", stay: "Homestay, Kaza", meals: "Breakfast, dinner" },
          { dayNumber: 4, title: "Langza · Komic · Hikkim", description: "Fossils at Langza, the world's highest post office at Hikkim — post a card, it takes a month.", stay: "Homestay, Kaza", meals: "Breakfast, dinner" },
          { dayNumber: 5, title: "Kaza → Chandratal", description: "Camp beside the moon lake. Sunset walk around the rim, dinner in the mess tent.", stay: "Alpine camp, Chandratal", meals: "Breakfast, dinner" },
          { dayNumber: 6, title: "Chandratal → Manali", description: "Back over Kunzum La and down through Lahaul.", stay: "Hotel, Manali", meals: "Breakfast" },
          { dayNumber: 7, title: "Manali departure", description: "Late checkout, transfers to the bus stand or Bhuntar airport.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: himalaya.id,
      title: "Ladakh: Leh, Nubra & Pangong — 8 days",
      slug: "ladakh-leh-nubra-pangong-8-days",
      destination: "Leh–Ladakh",
      country: "India",
      startCity: "Leh",
      summary: "Two nights of acclimatising in Leh, then Khardung La, Nubra dunes and a lakeside night at Pangong.",
      description:
        "Ladakh done properly: two full days in Leh before you gain any more altitude, then the north loop through Nubra and the long drive to Pangong Tso.",
      category: "ADVENTURE",
      durationDays: 8,
      durationNights: 7,
      price: 45900,
      currency: "INR",
      discountPercent: 0,
      minGuests: 2,
      maxGuests: 10,
      inclusions: json(["7 nights accommodation", "Breakfast & dinner daily", "Innova with driver", "Inner-line permits", "Monastery entry fees", "Airport transfers"]),
      exclusions: json(["Flights to Leh", "Lunches", "Camel ride at Hunder", "Travel insurance"]),
      highlights: json(["Two acclimatisation days in Leh", "Khardung La at 5,359 m", "Double-humped camels at Hunder", "Night beside Pangong Tso", "Thiksey morning prayers"]),
      images: json([seedImage("photo-pangong.svg"), seedImage("photo-kaza.svg"), seedImage("photo-tawang.svg")]),
      coverUrl: seedImage("photo-pangong.svg"),
      availableFrom: daysFromNow(30),
      availableTo: daysFromNow(240),
      instantBook: false,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Arrive Leh", description: "Airport pickup and a deliberately lazy day. Hydrate, nap, short evening walk.", stay: "Hotel, Leh", meals: "Dinner" },
          { dayNumber: 2, title: "Leh monasteries", description: "Thiksey at dawn, Hemis, Shey palace and the Indus–Zanskar confluence.", stay: "Hotel, Leh", meals: "Breakfast, dinner" },
          { dayNumber: 3, title: "Leh → Nubra via Khardung La", description: "Over the pass, down into the Shyok valley, camel ride on the Hunder dunes.", stay: "Camp, Hunder", meals: "Breakfast, dinner" },
          { dayNumber: 4, title: "Turtuk day trip", description: "The last village before the border, apricot orchards and Balti food.", stay: "Camp, Hunder", meals: "Breakfast, dinner" },
          { dayNumber: 5, title: "Nubra → Pangong", description: "The Shyok river road — rough, spectacular, worth it.", stay: "Lakeside camp, Pangong", meals: "Breakfast, dinner" },
          { dayNumber: 6, title: "Pangong sunrise → Leh", description: "Sunrise over the lake, then back via Chang La.", stay: "Hotel, Leh", meals: "Breakfast, dinner" },
          { dayNumber: 7, title: "Leh market & Shanti Stupa", description: "Free morning, sunset at Shanti Stupa.", stay: "Hotel, Leh", meals: "Breakfast" },
          { dayNumber: 8, title: "Departure", description: "Transfer to Leh airport.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: coastal.id,
      title: "Andaman islands: Havelock & Neil — 6 days",
      slug: "andaman-havelock-neil-6-days",
      destination: "Andaman Islands",
      country: "India",
      startCity: "Port Blair",
      summary: "Radhanagar sunsets, a discover-scuba dive and two islands at ferry pace.",
      description: "Six days across Port Blair, Havelock and Neil with private ferry transfers, a beginner-friendly dive and enough unscheduled beach time to actually rest.",
      category: "BEACH",
      durationDays: 6,
      durationNights: 5,
      price: 38400,
      currency: "INR",
      discountPercent: 15,
      minGuests: 1,
      maxGuests: 14,
      inclusions: json(["5 nights beach resorts", "Daily breakfast", "Private ferry tickets", "Discover-scuba session with PADI instructor", "All island transfers"]),
      exclusions: json(["Flights to Port Blair", "Lunches & dinners", "Water-sports beyond the included dive"]),
      highlights: json(["Radhanagar beach at sunset", "Discover scuba at Elephant Beach", "Bharatpur snorkelling on Neil", "Cellular Jail light & sound show", "Natural rock bridge at low tide"]),
      images: json([seedImage("photo-andaman.svg"), seedImage("photo-maldives.svg"), seedImage("photo-gokarna.svg")]),
      coverUrl: seedImage("photo-andaman.svg"),
      availableFrom: daysFromNow(10),
      availableTo: daysFromNow(300),
      instantBook: true,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Port Blair arrival", description: "Corbyn's Cove, then the Cellular Jail light and sound show.", stay: "Hotel, Port Blair", meals: "Breakfast" },
          { dayNumber: 2, title: "Ferry to Havelock", description: "Morning ferry, afternoon free at Radhanagar for the sunset.", stay: "Beach resort, Havelock", meals: "Breakfast" },
          { dayNumber: 3, title: "Elephant Beach & discover scuba", description: "Boat out to Elephant Beach, guided first dive, snorkelling after.", stay: "Beach resort, Havelock", meals: "Breakfast" },
          { dayNumber: 4, title: "Havelock → Neil", description: "Short ferry, Bharatpur and Laxmanpur beaches, natural rock bridge at low tide.", stay: "Resort, Neil Island", meals: "Breakfast" },
          { dayNumber: 5, title: "Neil → Port Blair", description: "Afternoon ferry back, evening at Aberdeen Bazaar.", stay: "Hotel, Port Blair", meals: "Breakfast" },
          { dayNumber: 6, title: "Departure", description: "Airport transfer.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: coastal.id,
      title: "Maldives honeymoon — 5 nights overwater",
      slug: "maldives-honeymoon-5-nights",
      destination: "Maldives",
      country: "Maldives",
      startCity: "Malé",
      summary: "Overwater villa, seaplane transfers, private sandbank dinner and a house-reef snorkel guide.",
      description: "Five nights in a Baa Atoll overwater villa on half board, with a private sandbank dinner and a guided house-reef snorkel included.",
      category: "HONEYMOON",
      durationDays: 6,
      durationNights: 5,
      price: 189000,
      currency: "INR",
      discountPercent: 8,
      minGuests: 2,
      maxGuests: 2,
      inclusions: json(["5 nights overwater villa", "Half board", "Return seaplane transfers", "Private sandbank dinner", "Guided house-reef snorkel", "Honeymoon amenities"]),
      exclusions: json(["International flights", "Alcohol", "Spa treatments", "Excursions beyond those listed"]),
      highlights: json(["Overwater villa with a glass floor panel", "Private sandbank dinner", "Manta season snorkelling in Baa Atoll", "Sunset dolphin cruise"]),
      images: json([seedImage("photo-maldives.svg"), seedImage("photo-andaman.svg"), seedImage("photo-varkala.svg")]),
      coverUrl: seedImage("photo-maldives.svg"),
      availableFrom: daysFromNow(15),
      availableTo: daysFromNow(330),
      instantBook: false,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Malé → resort by seaplane", description: "Seaplane over the atolls, villa check-in, sunset on your deck.", stay: "Overwater villa", meals: "Breakfast, dinner" },
          { dayNumber: 2, title: "House reef & spa", description: "Guided snorkel in the morning, couples spa slot in the afternoon.", stay: "Overwater villa", meals: "Breakfast, dinner" },
          { dayNumber: 3, title: "Sandbank dinner", description: "Boat to a private sandbank for dinner under the stars.", stay: "Overwater villa", meals: "Breakfast, dinner" },
          { dayNumber: 4, title: "Dolphin cruise", description: "Sunset cruise, then a quiet evening.", stay: "Overwater villa", meals: "Breakfast, dinner" },
          { dayNumber: 5, title: "Free day", description: "Kayaks, the reef, or nothing at all.", stay: "Overwater villa", meals: "Breakfast, dinner" },
          { dayNumber: 6, title: "Departure", description: "Seaplane back to Malé.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: desert.id,
      title: "Jaisalmer desert & village stay — 4 days",
      slug: "jaisalmer-desert-village-stay-4-days",
      destination: "Jaisalmer",
      country: "India",
      startCity: "Jaisalmer",
      summary: "Golden fort, a night in a village homestay and camel-back dunes away from the coach parks.",
      description: "Four days in and around Jaisalmer with a night in Khaba village, Manganiyar musicians around a real fire, and sunrise on dunes that don't have a queue.",
      category: "GROUP",
      durationDays: 4,
      durationNights: 3,
      price: 16800,
      currency: "INR",
      discountPercent: 10,
      minGuests: 2,
      maxGuests: 16,
      inclusions: json(["3 nights (haveli + village homestay + desert camp)", "All breakfasts and dinners", "Camel safari", "Folk music evening", "Jeep transfers"]),
      exclusions: json(["Trains or flights to Jaisalmer", "Lunches", "Monument entry fees"]),
      highlights: json(["Sunset from Jaisalmer Fort ramparts", "Village homestay in Khaba", "Manganiyar folk evening", "Sunrise camel ride on the Sam dunes"]),
      images: json([seedImage("photo-jaisalmer.svg"), seedImage("photo-udaipur.svg"), seedImage("photo-hampi.svg")]),
      coverUrl: seedImage("photo-jaisalmer.svg"),
      availableFrom: daysFromNow(8),
      availableTo: daysFromNow(160),
      instantBook: true,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Arrival & fort walk", description: "Check in to a haveli inside the old city, evening walk around the living fort.", stay: "Haveli, Jaisalmer", meals: "Dinner" },
          { dayNumber: 2, title: "Khaba village stay", description: "Abandoned Paliwal villages, then a homestay dinner cooked over a wood fire.", stay: "Homestay, Khaba", meals: "Breakfast, dinner" },
          { dayNumber: 3, title: "Sam dunes & folk night", description: "Camel safari at sunset, Manganiyar musicians after dinner.", stay: "Desert camp, Sam", meals: "Breakfast, dinner" },
          { dayNumber: 4, title: "Sunrise & departure", description: "Sunrise on the dunes, back to town by mid-morning.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: desert.id,
      title: "Udaipur & Kumbhalgarh weekender",
      slug: "udaipur-kumbhalgarh-weekender",
      destination: "Udaipur",
      country: "India",
      startCity: "Udaipur",
      summary: "Lake Pichola at blue hour, the second-longest wall in the world, and a rooftop dinner.",
      description: "A three-day weekend built for people flying in on a Friday night: lakes, a fort, and no 6am starts.",
      category: "WEEKEND",
      durationDays: 3,
      durationNights: 2,
      price: 14500,
      currency: "INR",
      discountPercent: 0,
      minGuests: 1,
      maxGuests: 12,
      inclusions: json(["2 nights lake-view hotel", "Breakfasts", "Kumbhalgarh day trip with driver", "Sunset boat on Lake Pichola"]),
      exclusions: json(["Flights", "Lunches and dinners", "Monument tickets"]),
      highlights: json(["Sunset boat on Lake Pichola", "Kumbhalgarh fort wall", "City Palace courtyards", "Rooftop dinner in the old city"]),
      images: json([seedImage("photo-udaipur.svg"), seedImage("photo-hampi.svg")]),
      coverUrl: seedImage("photo-udaipur.svg"),
      availableFrom: daysFromNow(5),
      availableTo: daysFromNow(120),
      instantBook: true,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Arrive & lake sunset", description: "Check in, sunset boat, dinner overlooking the water.", stay: "Lake-view hotel", meals: "Breakfast" },
          { dayNumber: 2, title: "Kumbhalgarh", description: "Day trip to the fort and the Ranakpur temples on the way back.", stay: "Lake-view hotel", meals: "Breakfast" },
          { dayNumber: 3, title: "City Palace & departure", description: "Palace museum in the morning, airport drop after lunch.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: himalaya.id,
      title: "Kerala backwaters & Munnar tea trail — 6 days",
      slug: "kerala-backwaters-munnar-6-days",
      destination: "Kerala",
      country: "India",
      startCity: "Kochi",
      summary: "Fort Kochi, a night on a houseboat and two mornings in the tea hills.",
      description: "A gentle Kerala loop for people who'd rather look at things than climb them. Houseboat, tea estates, and a lot of very good food.",
      category: "FAMILY",
      durationDays: 6,
      durationNights: 5,
      price: 27900,
      currency: "INR",
      discountPercent: 5,
      minGuests: 2,
      maxGuests: 10,
      inclusions: json(["5 nights accommodation", "Houseboat full board", "Private car with driver", "Tea estate walk", "Kathakali show tickets"]),
      exclusions: json(["Flights", "Most lunches", "Ayurveda treatments"]),
      highlights: json(["Night on an Alleppey houseboat", "Munnar tea estate walk", "Chinese fishing nets at Fort Kochi", "Kathakali performance"]),
      images: json([seedImage("photo-munnar.svg"), seedImage("photo-varkala.svg"), seedImage("photo-coorg.svg")]),
      coverUrl: seedImage("photo-munnar.svg"),
      availableFrom: daysFromNow(12),
      availableTo: daysFromNow(280),
      instantBook: true,
      status: "PUBLISHED",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Fort Kochi", description: "Fishing nets, Jew Town, an evening Kathakali show.", stay: "Heritage hotel, Kochi", meals: "Breakfast" },
          { dayNumber: 2, title: "Kochi → Alleppey houseboat", description: "Board at noon, drift through the backwaters, dinner on deck.", stay: "Houseboat", meals: "All meals" },
          { dayNumber: 3, title: "Alleppey → Munnar", description: "Up into the hills, waterfalls on the way.", stay: "Estate stay, Munnar", meals: "Breakfast" },
          { dayNumber: 4, title: "Tea country", description: "Estate walk, tea museum, Top Station viewpoint.", stay: "Estate stay, Munnar", meals: "Breakfast" },
          { dayNumber: 5, title: "Munnar → Kochi", description: "Slow drive back with a spice-garden stop.", stay: "Hotel, Kochi", meals: "Breakfast" },
          { dayNumber: 6, title: "Departure", description: "Airport transfer.", stay: "—", meals: "Breakfast" },
        ],
      },
    },
    {
      agencyId: coastal.id,
      title: "Goa workation — 14 nights, north to south",
      slug: "goa-workation-14-nights",
      destination: "Goa",
      country: "India",
      startCity: "Goa",
      summary: "Two weeks, two bases, fibre wifi at both, and a scooter waiting at the airport.",
      description: "A fortnight split between Assagao and Palolem, with desks that work, wifi that holds a call, and weekends organised for you.",
      category: "WORKATION",
      durationDays: 15,
      durationNights: 14,
      price: 64000,
      currency: "INR",
      discountPercent: 20,
      minGuests: 1,
      maxGuests: 4,
      inclusions: json(["14 nights across two villas", "Fibre wifi + backup 5G router", "Scooter for the full stay", "Airport transfers", "Weekend activity each week"]),
      exclusions: json(["Flights", "Food", "Fuel"]),
      highlights: json(["Assagao week: cafés and Saturday night market", "Palolem week: kayaks and quiet beaches", "Dedicated desk in both villas", "Sunday dolphin trip"]),
      images: json([seedImage("photo-goa.svg"), seedImage("photo-gokarna.svg"), seedImage("photo-varkala.svg")]),
      coverUrl: seedImage("photo-goa.svg"),
      availableFrom: daysFromNow(25),
      availableTo: daysFromNow(310),
      instantBook: true,
      status: "DRAFT",
      dayPlans: {
        create: [
          { dayNumber: 1, title: "Arrive Assagao", description: "Airport pickup, villa check-in, scooter handover.", stay: "Villa, Assagao", meals: "—" },
          { dayNumber: 8, title: "Move to Palolem", description: "Transfer south, second villa check-in.", stay: "Villa, Palolem", meals: "—" },
          { dayNumber: 15, title: "Departure", description: "Airport drop.", stay: "—", meals: "—" },
        ],
      },
    },
  ];

  const packages = [];
  for (const data of packageSeeds) packages.push(await db.package.create({ data }));
  const bySlug = Object.fromEntries(packages.map((pkg) => [pkg.slug, pkg]));

  console.log("· itineraries");
  const ladakhPlan = await db.itinerary.create({
    data: {
      authorId: byUsername["ananya.rides"].id,
      title: "Ladakh on a bike for ₹34,000 — 9 days",
      destination: "Leh–Ladakh",
      country: "India",
      summary:
        "Rented a Himalayan in Leh, rode the Nubra–Pangong loop solo, slept in homestays. Every cost below is what I actually paid in September, including the two nights I lost to altitude.",
      days: 4,
      budget: 34000,
      currency: "INR",
      coverUrl: seedImage("photo-pangong.svg"),
      style: "Budget backpacker",
      bestSeason: "June – September",
      tags: json(["ladakh", "roadtrip", "budget", "solo"]),
      isPublic: true,
      dayPlans: {
        create: [
          {
            dayNumber: 1,
            title: "Day 1 — Leh, and doing nothing",
            notes: "Do not ride today. Altitude does not negotiate.",
            stops: {
              create: [
                { order: 0, time: "10:00", title: "Land at Leh, check into guesthouse", place: "Changspa", category: "STAY", cost: 900, note: "₹900/night with hot water. Book only the first night in advance." },
                { order: 1, time: "13:00", title: "Thukpa at Lamayuru Restaurant", place: "Main Bazaar", category: "FOOD", cost: 180 },
                { order: 2, time: "17:30", title: "Sunset at Shanti Stupa", place: "Shanti Stupa", category: "SIGHT", cost: 0, note: "Walk up slowly. Yes, slowly." },
              ],
            },
          },
          {
            dayNumber: 2,
            title: "Day 2 — Bike pickup & Leh loop",
            notes: "Check the bike's brakes yourself before paying.",
            stops: {
              create: [
                { order: 0, time: "09:00", title: "Rent Royal Enfield Himalayan", place: "Old Leh Road", category: "TRANSPORT", cost: 1600, note: "₹1,600/day + fuel. Deposit: original ID." },
                { order: 1, time: "11:00", title: "Thiksey Monastery", place: "Thiksey", category: "SIGHT", cost: 50 },
                { order: 2, time: "15:00", title: "Permit office run", place: "DC Office, Leh", category: "ACTIVITY", cost: 600, note: "Inner-line permit for Nubra + Pangong." },
              ],
            },
          },
          {
            dayNumber: 3,
            title: "Day 3 — Leh → Nubra over Khardung La",
            notes: "Leave by 7am. The pass gets ugly with traffic after 11.",
            stops: {
              create: [
                { order: 0, time: "07:00", title: "Ride to Khardung La", place: "Khardung La, 5,359 m", category: "TRANSPORT", cost: 700, note: "Fuel + tea. Don't linger above 5,000 m." },
                { order: 1, time: "13:00", title: "Hunder dunes & camels", place: "Hunder", category: "ACTIVITY", cost: 400 },
                { order: 2, time: "19:00", title: "Homestay dinner", place: "Sumur", category: "STAY", cost: 1200, note: "Room + dinner + breakfast for ₹1,200." },
              ],
            },
          },
          {
            dayNumber: 4,
            title: "Day 4 — Nubra → Pangong",
            notes: "The Shyok road is a river when it wants to be. Ask locally before you commit.",
            stops: {
              create: [
                { order: 0, time: "08:00", title: "Shyok river road", place: "Shyok", category: "TRANSPORT", cost: 800 },
                { order: 1, time: "16:00", title: "Pangong Tso, first sight", place: "Spangmik", category: "SIGHT", cost: 0 },
                { order: 2, time: "19:00", title: "Lakeside camp", place: "Spangmik", category: "STAY", cost: 1500, note: "Negotiate. Off-season it's half this." },
              ],
            },
          },
        ],
      },
    },
  });

  const keralaPlan = await db.itinerary.create({
    data: {
      authorId: byUsername["meera.trails"].id,
      title: "Slow Kerala: 5 days, no alarm clocks",
      destination: "Kerala",
      country: "India",
      summary: "Kochi, a houseboat and the tea hills, at the pace my parents could actually enjoy.",
      days: 3,
      budget: 22000,
      currency: "INR",
      coverUrl: seedImage("photo-munnar.svg"),
      style: "Comfort seeker",
      bestSeason: "October – March",
      tags: json(["kerala", "family", "slow"]),
      isPublic: true,
      dayPlans: {
        create: [
          {
            dayNumber: 1,
            title: "Day 1 — Fort Kochi",
            notes: "Everything here is walkable. Skip the taxi.",
            stops: {
              create: [
                { order: 0, time: "11:00", title: "Chinese fishing nets", place: "Fort Kochi beach", category: "SIGHT", cost: 0 },
                { order: 1, time: "13:30", title: "Fish thali at Kashi", place: "Burgher Street", category: "FOOD", cost: 700 },
                { order: 2, time: "18:00", title: "Kathakali show", place: "Kerala Kathakali Centre", category: "ACTIVITY", cost: 800, note: "Arrive an hour early for the make-up demonstration." },
              ],
            },
          },
          {
            dayNumber: 2,
            title: "Day 2 — Houseboat",
            notes: "One night is enough. Two gets repetitive.",
            stops: {
              create: [
                { order: 0, time: "12:00", title: "Board at Alleppey", place: "Punnamada", category: "STAY", cost: 9500, note: "Full board, two bedrooms, off-season rate." },
                { order: 1, time: "16:00", title: "Village stop", place: "Kainakary", category: "SIGHT", cost: 0 },
              ],
            },
          },
          {
            dayNumber: 3,
            title: "Day 3 — Munnar",
            notes: "Leave the backwaters by 9 or you'll hit the hill traffic.",
            stops: {
              create: [
                { order: 0, time: "09:00", title: "Drive to Munnar", place: "NH85", category: "TRANSPORT", cost: 4200 },
                { order: 1, time: "16:00", title: "Tea estate walk", place: "Lockhart Gap", category: "ACTIVITY", cost: 300 },
                { order: 2, time: "19:00", title: "Estate stay", place: "Chithirapuram", category: "STAY", cost: 3600 },
              ],
            },
          },
        ],
      },
    },
  });

  const goaPlan = await db.itinerary.create({
    data: {
      authorId: byUsername["devkapoor"].id,
      title: "Goa in the monsoon — the underrated season",
      destination: "Goa",
      country: "India",
      summary: "Half price, no crowds, and the greenest the state ever gets. Two days of what actually stays open.",
      days: 2,
      budget: 9500,
      currency: "INR",
      coverUrl: seedImage("photo-goa.svg"),
      style: "Digital nomad",
      bestSeason: "June – September",
      tags: json(["goa", "monsoon", "workation", "budget"]),
      isPublic: true,
      dayPlans: {
        create: [
          {
            dayNumber: 1,
            title: "Day 1 — North Goa in the rain",
            notes: "Shacks close, cafés don't.",
            stops: {
              create: [
                { order: 0, time: "10:00", title: "Work morning at Bean Me Up", place: "Assagao", category: "FOOD", cost: 600, note: "Fast wifi, plug points at half the tables." },
                { order: 1, time: "16:00", title: "Chapora fort in the drizzle", place: "Chapora", category: "SIGHT", cost: 0 },
                { order: 2, time: "20:00", title: "Villa for the night", place: "Assagao", category: "STAY", cost: 2800, note: "Monsoon rate — the same villa is ₹9k in December." },
              ],
            },
          },
          {
            dayNumber: 2,
            title: "Day 2 — Waterfalls & south",
            notes: "Dudhsagar needs a jeep booking; don't try to ride there.",
            stops: {
              create: [
                { order: 0, time: "08:00", title: "Dudhsagar jeep safari", place: "Mollem", category: "ACTIVITY", cost: 1400 },
                { order: 1, time: "15:00", title: "Drive to Palolem", place: "Palolem", category: "TRANSPORT", cost: 900 },
                { order: 2, time: "19:00", title: "Beach hut", place: "Palolem", category: "STAY", cost: 1800 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("· posts");
  type PostSeed = {
    author: string;
    type: string;
    caption: string;
    locationName?: string;
    country?: string;
    tags: string[];
    budget?: number;
    tripMonth?: string;
    rating?: number;
    media: { url: string; kind: string; alt?: string }[];
    itineraryId?: string;
    packageId?: string;
    daysAgo: number;
  };

  const postSeeds: PostSeed[] = [
    {
      author: "ananya.rides",
      type: "PHOTO",
      caption:
        "Six hours from Leh, two wrong turns and one very cold lunch later — Pangong. Nobody tells you the blue changes every twenty minutes. Full cost breakdown is in the itinerary below. 💙",
      locationName: "Pangong Tso",
      country: "India",
      tags: ["ladakh", "roadtrip", "solo", "budget"],
      budget: 34000,
      tripMonth: "Sep",
      rating: 5,
      media: [
        { url: seedImage("photo-pangong.svg"), kind: "IMAGE", alt: "Pangong Tso at midday" },
        { url: seedImage("photo-kaza.svg"), kind: "IMAGE", alt: "Camp at altitude" },
      ],
      itineraryId: ladakhPlan.id,
      daysAgo: 1,
    },
    {
      author: "kabir.360",
      type: "THREESIXTY",
      caption: "Drag this one around. Standing on the shore at Pangong at 7am, wind on your left, mountains everywhere else.",
      locationName: "Pangong Tso",
      country: "India",
      tags: ["360", "ladakh", "sunrise"],
      tripMonth: "Sep",
      media: [{ url: seedImage("pano-pangong.png"), kind: "PANORAMA", alt: "360 panorama at Pangong Tso" }],
      daysAgo: 2,
    },
    {
      author: "meera.trails",
      type: "REEL",
      caption: "Key Monastery at 6:04am. The monks were already up. I was not ready. 🎧 sound on for the horns.",
      locationName: "Key Monastery",
      country: "India",
      tags: ["spiti", "monastery", "sunrise"],
      tripMonth: "Jun",
      rating: 5,
      media: [{ url: seedImage("reel-spiti.svg"), kind: "IMAGE", alt: "Key Monastery at sunrise" }],
      packageId: bySlug["spiti-valley-circuit-7-days"].id,
      daysAgo: 3,
    },
    {
      author: "arjun.himalaya",
      type: "PHOTO",
      caption:
        "Group 41 at Chandratal last week. Eight people, one cook, zero phone signal for 30 hours. Two seats left on the September departure.",
      locationName: "Chandratal",
      country: "India",
      tags: ["spiti", "camping", "smallgroup"],
      tripMonth: "Aug",
      media: [
        { url: seedImage("photo-kaza.svg"), kind: "IMAGE" },
        { url: seedImage("photo-spiti.svg"), kind: "IMAGE" },
      ],
      packageId: bySlug["spiti-valley-circuit-7-days"].id,
      daysAgo: 4,
    },
    {
      author: "devkapoor",
      type: "PHOTO",
      caption: "Monsoon Goa is the actual Goa. Half the price, none of the queue, and the whole state turns green.",
      locationName: "Palolem",
      country: "India",
      tags: ["goa", "monsoon", "workation"],
      budget: 9500,
      tripMonth: "Jul",
      rating: 4,
      media: [{ url: seedImage("photo-goa.svg"), kind: "IMAGE" }],
      itineraryId: goaPlan.id,
      daysAgo: 5,
    },
    {
      author: "kabir.360",
      type: "THREESIXTY",
      caption: "Sam dunes, ten minutes before the coaches arrive. Look behind you — that's the direction nobody photographs.",
      locationName: "Sam Sand Dunes",
      country: "India",
      tags: ["360", "rajasthan", "desert"],
      tripMonth: "Nov",
      media: [{ url: seedImage("pano-jaisalmer.png"), kind: "PANORAMA", alt: "360 panorama of the Sam dunes" }],
      packageId: bySlug["jaisalmer-desert-village-stay-4-days"].id,
      daysAgo: 6,
    },
    {
      author: "farah.q",
      type: "PHOTO",
      caption:
        "Took the kids and my mother to Kerala. The houseboat won. One night is plenty — by hour 20 the nine-year-old had renamed it 'the slow bus'.",
      locationName: "Alleppey",
      country: "India",
      tags: ["kerala", "family", "houseboat"],
      budget: 22000,
      tripMonth: "Dec",
      rating: 4,
      media: [{ url: seedImage("photo-munnar.svg"), kind: "IMAGE" }],
      packageId: bySlug["kerala-backwaters-munnar-6-days"].id,
      daysAgo: 7,
    },
    {
      author: "meera.trails",
      type: "ITINERARY",
      caption: "Five days in Kerala with my parents, no alarm clocks, ₹22,000 all in. Every stop and cost is in the plan.",
      locationName: "Kerala",
      country: "India",
      tags: ["kerala", "slow", "family"],
      budget: 22000,
      media: [{ url: seedImage("photo-munnar.svg"), kind: "IMAGE" }],
      itineraryId: keralaPlan.id,
      daysAgo: 8,
    },
    {
      author: "coastal.compass",
      type: "REEL",
      caption: "Discover-scuba at Elephant Beach — first breath underwater, every single time, that face. 🤿",
      locationName: "Havelock",
      country: "India",
      tags: ["andaman", "scuba", "reef"],
      media: [{ url: seedImage("reel-andaman.svg"), kind: "IMAGE" }],
      packageId: bySlug["andaman-havelock-neil-6-days"].id,
      daysAgo: 9,
    },
    {
      author: "kabir.360",
      type: "THREESIXTY",
      caption: "An overwater villa deck in Baa Atoll, 6:40pm. This is the shot the brochures can't do.",
      locationName: "Baa Atoll",
      country: "Maldives",
      tags: ["360", "maldives", "honeymoon"],
      media: [{ url: seedImage("pano-maldives.png"), kind: "PANORAMA", alt: "360 panorama from an overwater villa" }],
      packageId: bySlug["maldives-honeymoon-5-nights"].id,
      daysAgo: 10,
    },
    {
      author: "ananya.rides",
      type: "REEL",
      caption: "Khardung La in one take. 5,359 m, hands frozen to the bars, absolutely worth it.",
      locationName: "Khardung La",
      country: "India",
      tags: ["ladakh", "motorcycle", "pass"],
      tripMonth: "Sep",
      media: [{ url: seedImage("reel-pangong.svg"), kind: "IMAGE" }],
      daysAgo: 11,
    },
    {
      author: "desert.routes",
      type: "PHOTO",
      caption:
        "Khaba village, dinner cooked on a wood fire, Manganiyar musicians who live two doors down. This is the night guests write to us about, months later.",
      locationName: "Khaba",
      country: "India",
      tags: ["rajasthan", "homestay", "folk"],
      media: [
        { url: seedImage("photo-jaisalmer.svg"), kind: "IMAGE" },
        { url: seedImage("photo-udaipur.svg"), kind: "IMAGE" },
      ],
      packageId: bySlug["jaisalmer-desert-village-stay-4-days"].id,
      daysAgo: 12,
    },
    {
      author: "devkapoor",
      type: "THREESIXTY",
      caption: "Palolem at sunset in 360°. Turn left for the beach huts, right for the headland. Sound of the dogs not included.",
      locationName: "Palolem",
      country: "India",
      tags: ["360", "goa", "sunset"],
      media: [{ url: seedImage("pano-goa.png"), kind: "PANORAMA", alt: "360 panorama at Palolem beach" }],
      daysAgo: 13,
    },
    {
      author: "meera.trails",
      type: "PHOTO",
      caption: "Munnar at first light. Tea pickers were out before the mist lifted; I was out before the coffee worked.",
      locationName: "Munnar",
      country: "India",
      tags: ["kerala", "tea", "sunrise"],
      rating: 5,
      media: [
        { url: seedImage("photo-munnar.svg"), kind: "IMAGE" },
        { url: seedImage("photo-coorg.svg"), kind: "IMAGE" },
      ],
      daysAgo: 14,
    },
    {
      author: "farah.q",
      type: "PHOTO",
      caption: "Radhanagar. Third time here, still the best beach in the country. Fight me in the comments. 🏝️",
      locationName: "Radhanagar Beach",
      country: "India",
      tags: ["andaman", "beach", "family"],
      rating: 5,
      media: [{ url: seedImage("photo-andaman.svg"), kind: "IMAGE" }],
      packageId: bySlug["andaman-havelock-neil-6-days"].id,
      daysAgo: 15,
    },
    {
      author: "ananya.rides",
      type: "ITINERARY",
      caption: "Everything I spent riding Ladakh solo for nine days — bike, permits, homestays, the lot. ₹34,000.",
      locationName: "Leh–Ladakh",
      country: "India",
      tags: ["ladakh", "budget", "roadtrip"],
      budget: 34000,
      media: [{ url: seedImage("photo-pangong.svg"), kind: "IMAGE" }],
      itineraryId: ladakhPlan.id,
      daysAgo: 16,
    },
    {
      author: "kabir.360",
      type: "PHOTO",
      caption: "Sela Pass, 4,170 m, Arunachal. The lake was still frozen in April and the tea stall was still open.",
      locationName: "Sela Pass",
      country: "India",
      tags: ["arunachal", "northeast", "pass"],
      tripMonth: "Apr",
      media: [{ url: seedImage("photo-tawang.svg"), kind: "IMAGE" }],
      daysAgo: 17,
    },
    {
      author: "arjun.himalaya",
      type: "THREESIXTY",
      caption: "Stand in the middle of Spiti and turn around. That's the pitch. That's the whole pitch.",
      locationName: "Spiti Valley",
      country: "India",
      tags: ["360", "spiti", "himalaya"],
      media: [{ url: seedImage("pano-spiti.png"), kind: "PANORAMA", alt: "360 panorama in Spiti Valley" }],
      packageId: bySlug["spiti-valley-circuit-7-days"].id,
      daysAgo: 18,
    },
    {
      author: "devkapoor",
      type: "PHOTO",
      caption: "Hampi boulders at golden hour. Two days here and I still didn't see half of it.",
      locationName: "Hampi",
      country: "India",
      tags: ["hampi", "karnataka", "heritage"],
      rating: 5,
      media: [{ url: seedImage("photo-hampi.svg"), kind: "IMAGE" }],
      daysAgo: 19,
    },
    {
      author: "coastal.compass",
      type: "THREESIXTY",
      caption: "Munnar tea country in 360° — a client shot this on our Kerala trail and let us post it.",
      locationName: "Munnar",
      country: "India",
      tags: ["360", "kerala", "tea"],
      media: [{ url: seedImage("pano-munnar.png"), kind: "PANORAMA", alt: "360 panorama in Munnar tea estates" }],
      daysAgo: 20,
    },
  ];

  const posts = [];
  for (const seed of postSeeds) {
    posts.push(
      await db.post.create({
        data: {
          authorId: byUsername[seed.author].id,
          type: seed.type,
          caption: seed.caption,
          locationName: seed.locationName ?? null,
          country: seed.country ?? null,
          tags: json(seed.tags),
          budget: seed.budget ?? null,
          tripMonth: seed.tripMonth ?? null,
          rating: seed.rating ?? null,
          itineraryId: seed.itineraryId ?? null,
          packageId: seed.packageId ?? null,
          agencyId:
            seed.author === "arjun.himalaya"
              ? himalaya.id
              : seed.author === "coastal.compass"
                ? coastal.id
                : seed.author === "desert.routes"
                  ? desert.id
                  : null,
          createdAt: daysFromNow(-seed.daysAgo),
          media: {
            create: seed.media.map((item, index) => ({
              url: item.url,
              kind: item.kind,
              alt: item.alt ?? null,
              order: index,
            })),
          },
        },
      }),
    );
  }

  console.log("· likes, saves, comments");
  const allUsers = users;
  const likeRows: { postId: string; userId: string }[] = [];
  const saveRows: { postId: string; userId: string }[] = [];
  posts.forEach((post, postIndex) => {
    allUsers.forEach((user, userIndex) => {
      if (user.id === post.authorId) return;
      // deterministic spread so counts look organic but the seed stays stable
      if ((postIndex * 7 + userIndex * 3) % 4 !== 0) likeRows.push({ postId: post.id, userId: user.id });
      if ((postIndex * 5 + userIndex * 2) % 9 === 0) saveRows.push({ postId: post.id, userId: user.id });
    });
  });
  await db.like.createMany({ data: likeRows });
  await db.save.createMany({ data: saveRows });

  const commentTexts = [
    "Saving this for September 🙌",
    "How bad was the road after the landslide?",
    "That colour is unreal.",
    "Booked the same trip last year — the Chandratal night is the one you remember.",
    "What did the permits cost in the end?",
    "Adding this to my list immediately.",
    "The 360 is such a good idea, I felt like I was standing there.",
    "Did you need an oximeter or was it fine?",
  ];
  const commentRows = posts.flatMap((post, postIndex) =>
    [0, 1].map((offset) => {
      const commenter = allUsers[(postIndex + offset + 2) % allUsers.length];
      if (commenter.id === post.authorId) return null;
      return {
        postId: post.id,
        userId: commenter.id,
        body: commentTexts[(postIndex + offset) % commentTexts.length],
        createdAt: new Date(post.createdAt.getTime() + (offset + 1) * 3600000),
      };
    }),
  ).filter(Boolean) as { postId: string; userId: string; body: string; createdAt: Date }[];
  await db.comment.createMany({ data: commentRows });

  console.log("· bookings & payments");
  const bookingSeeds = [
    { user: "farah.q", pkg: "andaman-havelock-neil-6-days", guests: 4, inDays: 34, status: "CONFIRMED", method: "MOCK_CARD" },
    { user: "devkapoor", pkg: "goa-workation-14-nights", guests: 1, inDays: 60, status: "PENDING", method: "MOCK_UPI" },
    { user: "ananya.rides", pkg: "spiti-valley-circuit-7-days", guests: 2, inDays: 45, status: "CONFIRMED", method: "MOCK_UPI" },
    { user: "meera.trails", pkg: "jaisalmer-desert-village-stay-4-days", guests: 3, inDays: 21, status: "PENDING", method: "PAY_AT_AGENCY" },
    { user: "kabir.360", pkg: "maldives-honeymoon-5-nights", guests: 2, inDays: 90, status: "PENDING", method: "MOCK_CARD" },
    { user: "farah.q", pkg: "kerala-backwaters-munnar-6-days", guests: 4, inDays: -40, status: "COMPLETED", method: "MOCK_CARD" },
    { user: "devkapoor", pkg: "andaman-havelock-neil-6-days", guests: 2, inDays: -70, status: "COMPLETED", method: "MOCK_CARD" },
  ];

  const reference = (index: number) => `VC-${(1000 + index * 137).toString(36).toUpperCase().padStart(4, "0")}${index}`;
  let bookingIndex = 0;
  for (const seed of bookingSeeds) {
    const pkg = bySlug[seed.pkg];
    const user = byUsername[seed.user];
    const unit = Math.round(pkg.price * (1 - pkg.discountPercent / 100));
    const subtotal = pkg.price * seed.guests;
    const discount = (pkg.price - unit) * seed.guests;
    const taxes = Math.round((subtotal - discount) * 0.05);
    const paid = seed.method !== "PAY_AT_AGENCY";

    await db.booking.create({
      data: {
        reference: reference(bookingIndex++),
        packageId: pkg.id,
        agencyId: pkg.agencyId,
        userId: user.id,
        travelDate: daysFromNow(seed.inDays),
        guests: seed.guests,
        travellerName: user.name,
        travellerEmail: user.email,
        travellerPhone: "+91 98000 0000" + bookingIndex,
        notes: seed.guests > 2 ? "Two rooms please, and one vegetarian meal plan." : "",
        subtotal,
        discount,
        taxes,
        total: subtotal - discount + taxes,
        currency: pkg.currency,
        status: seed.status,
        createdAt: daysFromNow(seed.inDays > 0 ? -Math.min(20, seed.inDays / 2) : seed.inDays - 30),
        payment: {
          create: {
            amount: subtotal - discount + taxes,
            currency: pkg.currency,
            method: seed.method,
            status: paid ? "PAID" : "UNPAID",
            reference: `SIM-${(Date.now() + bookingIndex).toString(36).toUpperCase()}`,
          },
        },
      },
    });
  }

  console.log("· reviews");
  await db.review.createMany({
    data: [
      {
        agencyId: coastal.id,
        userId: byUsername["farah.q"].id,
        packageId: bySlug["andaman-havelock-neil-6-days"].id,
        rating: 5,
        body: "Ferries, transfers and the dive were all handled — with two kids that's worth the whole fee. Nisha answered WhatsApps at 11pm.",
        createdAt: daysFromNow(-30),
      },
      {
        agencyId: coastal.id,
        userId: byUsername["devkapoor"].id,
        packageId: bySlug["andaman-havelock-neil-6-days"].id,
        rating: 4,
        body: "Great trip. Only gripe: the Port Blair hotel on the last night was a step down from the rest.",
        createdAt: daysFromNow(-60),
      },
      {
        agencyId: himalaya.id,
        userId: byUsername["ananya.rides"].id,
        packageId: bySlug["spiti-valley-circuit-7-days"].id,
        rating: 5,
        body: "Arjun's acclimatisation plan is the reason nobody in our group got sick. The Chandratal night alone was worth it.",
        createdAt: daysFromNow(-14),
      },
      {
        agencyId: himalaya.id,
        userId: byUsername["farah.q"].id,
        packageId: bySlug["kerala-backwaters-munnar-6-days"].id,
        rating: 5,
        body: "Paced for my parents without ever feeling slow. The houseboat crew were lovely.",
        createdAt: daysFromNow(-35),
      },
      {
        agencyId: himalaya.id,
        userId: byUsername["meera.trails"].id,
        rating: 4,
        body: "Second trip with them. Guides are excellent; the vehicle on the Shimla leg was tired.",
        createdAt: daysFromNow(-90),
      },
    ],
  });

  console.log("· notifications");
  await db.notification.createMany({
    data: [
      {
        userId: byUsername["arjun.himalaya"].id,
        actorId: byUsername["ananya.rides"].id,
        type: "BOOKING",
        message: "New booking for Spiti Valley circuit — 2 guests · ₹61,160",
        href: "/dashboard/bookings",
        read: false,
      },
      {
        userId: byUsername["arjun.himalaya"].id,
        type: "AGENCY_STATUS",
        message: "Himalaya Trails is now a verified Vacario agency 🎉",
        href: "/agencies/himalaya-trails",
        read: true,
      },
      {
        userId: byUsername["ananya.rides"].id,
        actorId: byUsername["kabir.360"].id,
        type: "LIKE",
        message: "Kabir Mehta liked your post",
        href: `/p/${posts[0].id}`,
        read: false,
      },
      {
        userId: byUsername["ananya.rides"].id,
        actorId: byUsername["meera.trails"].id,
        type: "COMMENT",
        message: 'Meera Pillai commented: "What did the permits cost in the end?"',
        href: `/p/${posts[0].id}`,
        read: false,
      },
      {
        userId: byUsername["desert.routes"].id,
        type: "AGENCY_STATUS",
        message: "Desert Routes was submitted for verification. You can publish packages right away.",
        href: "/dashboard",
        read: false,
      },
    ],
  });

  const counts = {
    users: await db.user.count(),
    agencies: await db.agency.count(),
    packages: await db.package.count(),
    posts: await db.post.count(),
    itineraries: await db.itinerary.count(),
    bookings: await db.booking.count(),
  };
  console.log("\n✓ seeded", counts);
  console.log("\nDemo logins (password: vacario123)");
  console.log("  traveller  ananya@vacario.app");
  console.log("  agent      arjun@himalayatrails.in");
  console.log("  admin      admin@vacario.app\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
