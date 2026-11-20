# Buddy's first Vacario™ trip: full film script for Google Flow

**Vacario™ · The Next Generation of Travel™**
One continuous brand film of **3 minutes 45 seconds**, built from **15 scenes of 15 seconds**. Made with Google Flow (Veo) and joined in your editor. Every scene is linked to the *V12.0 Vacario Brand Bible*.

---

## The story in one line

Buddy is stuck at home with a dusty guidebook, finds real stories from locals and guests on Vacario™, plans a Kerala trip with AI, books it, lives it through the people met along the way, and ends by sharing a story that inspires someone else to go.

This follows the brand promise exactly (Brand story, p.2):
> *"Help you **feel the world before you arrive**, **find connection when you get there**, and **return with a story that inspires someone else to go**."*

| Act | Scenes | Time | Brand promise | Brand experience (p.1) |
|---|---|---|---|---|
| **1. Before you arrive** | 01–05 | 0:00–1:15 | Feel the world before you arrive | **Discover:** real stories, local insight |
| **2. When you get there** | 06–12 | 1:15–3:00 | Find connection when you get there | **Connect:** creators, guests and partners |
| **3. The story you bring back** | 13–15 | 3:00–3:45 | Return with a story that inspires someone else | **Experience:** memories worth sharing |

---

## Full dialogue read-through (3:45)

Read this aloud with a timer before you generate anything. If it sounds right at this pace, the film will too.

| # | Time | Scene | Buddy's lines (other speakers marked) |
|---|---|---|---|
| 01 | 0:00 | Rainy day, old guidebook | "Same guidebook. Same photos. Same 'top ten'..." / "There's got to be more to the world than this." |
| 02 | 0:15 | Opens Vacario™ | "Wait... these are real people. Sharing it right now." / "A hidden beach... from this morning?" |
| 03 | 0:30 | The question changes | "I used to ask, 'Where should I stay?'" / "Now I'm asking: who will I meet?" |
| 04 | 0:45 | Plans with AI | "Okay. A relaxed four-day trip to Kerala." / "Backwaters, tea hills... and whatever the locals love." |
| 05 | 1:00 | Books and packs | "Stay and experiences, booked in one place." / "Kerala... here I come!" |
| 06 | 1:15 | Arrival, homestay partner | *Host:* "Welcome! Come, you must be hungry." / "Okay... I already feel at home." |
| 07 | 1:30 | Hidden gem café | "A local said, 'Turn left at the blue door.'" / "Hidden gem. Officially." |
| 08 | 1:45 | Vibe check at the beach | "Vibe check. Slow morning... ocean air..." / "...and a café I can walk to. Passed." |
| 09 | 2:00 | Travel dump | "Day three travel dump. Rain... roadside chai..." / "...and one very good detour." |
| 10 | 2:15 | A live tip, a festival | "Someone just posted this. Tonight. Ten minutes away." / "Oh, I can hear it from here!" |
| 11 | 2:30 | Festival, belonging | *Local:* "Come, dance with us!" / "Okay... I'm not just visiting anymore." |
| 12 | 2:45 | Jeep into the tea hills | "Windows down. Hills ahead." / "Main character moment. No skipping this one." |
| 13 | 3:00 | Sunrise, worth the hype | "Everyone says this sunrise is worth the hype..." / *Creator:* "No cap, worth the 4 a.m. alarm." / "Okay. I see it now." |
| 14 | 3:15 | Last night, houseboat | "Four days ago, I didn't know any of you." / "Core memory unlocked." |
| 15 | 3:30 | Sharing the story, finale | "I found this trip through someone's story. Now it's my turn." / "This is the next generation of travel. Come be part of it." |

Brand language check on the dialogue:
- Buddy never says "users", "travellers" or "Gen Z'ers".
- Gen Z phrases come from the approved list (p.10), and each one points to something real.
- "No cap" is said by a creator, not Buddy.
- Scene 05 (booking) uses plain words and has no prices.

---

## How to build the film in Google Flow

### Step 0: Create Buddy once (reference image)

Make this image first, save it as an **Ingredient**, and attach it to every Shot A in all 15 scenes.

```
Character reference sheet of "Buddy", a friendly 3D-animated rabbit mascot for a travel brand, high-end animated-feature-film style. Soft cream-white fur, tall upright ears with warm orange inner ears, big curious dark-brown eyes, small pink nose, gentle confident smile. Wears a sunset-orange (#EB8B30) zip hoodie, a leaf-green (#50752E) neck scarf, charcoal-grey (#252825) sneakers, a small orange teardrop map-pin pendant with a green leaf on a cord, and a small canvas backpack. Full body, front view and three-quarter view, standing on a plain white background, soft even studio light. No text, no logos.
```

The design follows the brand bible: the brand orange and green, a pendant shaped like the Vacario™ pin, and charcoal like the brand's text colour.

### Step 1: Generate each scene as two shots

| Part | Length | In Flow |
|---|---|---|
| **Shot A** | 0–8 s | *Ingredients to Video* with the Buddy image, using the Shot A prompt. For scenes 02–15 you can instead use **Jump to** from the previous scene, which keeps Buddy and moves to a new setting. |
| **Shot B** | 8–15 s | Select Shot A → **Extend** → paste the Shot B prompt. Trim to 7 s. |

### Step 2: Assemble (in Flow's Scenebuilder or any editor)

1. Put scenes 01–15 in order. Each scene is 15 s, for a total of 3:45.
2. Use the transition named at the end of each scene. Most are hard cuts or match cuts that are already built into the action.
3. **Music:** lay **one continuous music bed** under the whole film (see the music map below) and turn the Veo music down. Keep Veo's dialogue and sound effects.
4. **Logo and text:** add these **only in the editor**: the final end card at 3:40–3:45, plus an optional small wordmark in a corner. Never put the logo in a Flow prompt (Artwork handling, p.12; asset rules, p.58).
5. Captions and subtitles go in the editor too: Arial, sentence case, white or charcoal.

### Continuity rules (so it feels like one film, not 15 clips)

- Buddy's **outfit never changes**: orange hoodie, green scarf, charcoal sneakers, pin pendant, backpack. If a clip changes it, regenerate it.
- **Same voice phrase in every prompt:** *"warm, upbeat, friendly voice"*. If the voice drifts between scenes, record one voice actor for all lines and replace the audio.
- **Time of day runs forward through the story:** rainy home → night planning → morning flight → day 1 Fort Kochi → day 2 beach → day 3 rain → day 3 night festival → day 4 hills → day 4 sunrise → final night houseboat → finale.
- Every prompt ends with `No on-screen text, no subtitles, no logos, no watermarks.` Keep it.

---

# ACT 1: Before you arrive

### Scene 01 · 0:00–0:15 · "There's got to be more"

**Brand link:** Our belief, *Go beyond the guidebook* (p.1). The "before" picture: "Predictable. Distant. Slightly disconnected." (How our guests feel, p.6)

**Shot A (0:00–0:08)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. A grey rainy afternoon in a small city apartment. Buddy slumps at the window seat, flipping slowly through a thick, dusty travel guidebook full of faded postcard photos. Rain streaks the glass. Buddy sighs and says in a warm, upbeat, friendly voice, a little bored: "Same guidebook. Same photos. Same 'top ten'..." Slow push-in on Buddy's face. Sound: rain on glass, a clock ticking. Style: cinematic, desaturated cool grey-blue light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (0:08–0:15), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, closes the guidebook with a soft thump and a puff of dust, rests chin on paws, and looks out at the rain. Buddy says quietly, almost to themself: "There's got to be more to the world than this." On the windowsill next to Buddy, a smartphone lights up with a warm orange glow and buzzes. Buddy's ears twitch toward it. Hold on the glowing phone for the last second. Sound: rain, then a single soft notification chime. Style: cinematic, cool grey light with one warm orange glow. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 02:** cut on the phone glow.

---

### Scene 02 · 0:15–0:30 · "These are real people"

**Brand link:** "People weren't just posting destinations, they were living them in real time" (How our guests feel, p.6). "A hidden beach someone discovered this morning" (p.2).

**Shot A (0:15–0:23)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Close-up: Buddy picks up the glowing phone and scrolls. Warm golden light from the screen fills Buddy's face; the screen itself is not readable. Faint real-world sounds spill from the phone: laughter, street music, waves. Buddy's eyes widen and ears rise slowly. Buddy says in a warm, upbeat, friendly voice, amazed: "Wait... these are real people. Sharing it right now." Sound: rain fading, phone sounds growing. Style: cinematic, cool room light turning warm orange. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (0:23–0:30), Extend**
```
The rainy apartment walls around Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, gently dissolve like mist into a vision of a quiet hidden beach at sunrise, with turquoise water and palm shadows, as if Buddy can almost step into it. Buddy reaches a paw out toward the waves and whispers: "A hidden beach... from this morning?" The vision fades back to the apartment, now lit warm and golden; the rain has stopped. Sound: waves, seagulls, a soft magical swell. Style: cinematic, deep teal-blue and golden-orange grade. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 03:** match cut on Buddy's face.

---

### Scene 03 · 0:30–0:45 · "Who will I meet?"

**Brand link:** *From transaction to transformation* (How we speak, p.5). "Suddenly I wasn't asking 'Where should I stay?'" (p.6)

**Shot A (0:30–0:38)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Buddy, now standing in the warm-lit apartment, holds up an old printed hotel booking confirmation, looks at it, and crumples it into a ball with a cheeky shrug. Buddy says to camera in a warm, upbeat, friendly voice: "I used to ask, 'Where should I stay?'" Buddy tosses the paper ball over a shoulder into a basket. Medium shot. Sound: paper crumple, a playful pluck. Style: cinematic, warm evening light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (0:38–0:45), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, steps closer to the camera; around Buddy, soft floating glimpses appear like warm light bubbles: a smiling street-food cook, a local musician, a group of friendly guests laughing on a rooftop. Buddy looks straight into the camera with a bright, curious smile and says: "Now I'm asking: who will I meet?" Buddy grabs the phone off the table with determination. Sound: gentle upbeat music begins. Style: cinematic, teal-blue and golden-orange glow. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 04:** whip-pan to the sofa.

---

### Scene 04 · 0:45–1:00 · Planning with AI

**Brand link:** The vacario.ai homepage, "Keep AI planning first", and the sample prompt *"A relaxed 4-day trip to Kerala for two"* (p.24). Mission: discover, plan, book (p.1).

**Shot A (0:45–0:53)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Night. Buddy sits cross-legged on a cosy sofa with the phone, speaking the idea out loud in a warm, upbeat, friendly voice: "Okay. A relaxed four-day trip to Kerala." Soft glowing orange and green light ribbons rise from the phone and swirl gently around Buddy; the screen is not readable. Close-up, then slow pull-back. Sound: soft chime, gentle whoosh. Style: cinematic, cosy lamp light, teal-blue night and orange glow. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (0:53–1:00), Extend**
```
The light ribbons around Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, form small floating glowing scenes in the air, like a living itinerary: a wooden houseboat on palm-lined backwaters, misty green tea hills, a lantern-lit festival, a beach at sunrise. Buddy taps each one happily and says: "Backwaters, tea hills... and whatever the locals love." The scenes settle into a neat glowing row. Buddy grins at camera. Sound: four soft chimes, music building. Style: cinematic, glowing teal-blue and golden-orange light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 05:** the glowing row folds into the phone, then cut.

---

### Scene 05 · 1:00–1:15 · Booked and packed

**Brand link:** "Book the stays and experiences that fit" (p.1). Booking and checkout (p.31). **Plain, direct language: no slang and no prices** (p.10).

**Shot A (1:00–1:08)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Morning. Buddy presses one glowing orange button on the phone with a satisfying click and a soft confirmation chime; the screen is not readable. Buddy nods, calm and confident, and says clearly in a warm, upbeat, friendly voice: "Stay and experiences, booked in one place." Then a quick, fun packing sequence: Buddy rolls a T-shirt, adds sunglasses and sandals into the small canvas backpack. Sound: confirmation chime, zips, upbeat music. Style: cinematic, bright morning light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (1:08–1:15), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, zips the backpack shut, swings it on, and runs out the front door. Quick cut: Buddy at an airplane window seat, nose pressed to the glass, watching green coastline, palm trees and winding rivers appear below the clouds. Buddy whispers excitedly: "Kerala... here I come!" Sound: door slam, jet engine hum, music lifts. Style: cinematic, bright daylight, lush greens, teal-blue sea, golden sun. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 06:** cut from the aerial view to the ground.

---

# ACT 2: When you get there

### Scene 06 · 1:15–1:30 · Welcomed like family

**Brand link:** Mission, "the people who bring places to life" (p.1). Hosts and property owners are our **partners** (p.5). "Step into it like I already belong there" (p.7).

**Shot A (1:15–1:23)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf, small canvas backpack. Afternoon in a leafy old neighbourhood of Fort Kochi, Kerala: colonial-era houses, bougainvillea, bicycles. Buddy arrives at the gate of a family-run heritage homestay with a red-tiled roof. A warm middle-aged Malayali woman in a cotton saree opens the gate with a big smile and says: "Welcome! Come, you must be hungry." Buddy, in a warm, upbeat, friendly voice, laughs: "Always!" Medium shot, soft handheld. Sound: birdsong, gate creak, distant bicycle bells. Style: cinematic, warm afternoon light, teal-blue and golden-orange grade. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (1:23–1:30), Extend**
```
On a shaded veranda, the host serves Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, a banana leaf with rice and colourful curries, while her family chats around the table. Buddy takes a bite, closes both eyes in delight, then turns to camera and says softly: "Okay... I already feel at home." The family laughs warmly; hold on the table for the last second. Sound: clinking steel tumblers, laughter, soft folk melody. Style: cinematic, dappled golden light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 07:** hard cut to the street.

---

### Scene 07 · 1:30–1:45 · The hidden gem café

**Brand link:** "A courtyard café you'd walk right past" (p.1). **Hidden gem** (p.10). "Every recommendation felt personal" (p.7).

**Shot A (1:30–1:38)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf, small canvas backpack. Buddy walks down a busy, colourful lane in Fort Kochi past spice shops and art walls, glancing at the phone, then looks around for a landmark. Buddy says to camera in a warm, upbeat, friendly voice: "A local said, 'Turn left at the blue door.'" Buddy spots a faded blue wooden door in a narrow archway, and both ears perk straight up. Tracking shot at Buddy's eye level. Sound: street bustle, scooters, spice-shop chatter. Style: cinematic, bright late-morning light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (1:38–1:45), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, pushes open the blue door into a hidden courtyard café: an old mango tree, mismatched chairs, local artists sketching, a smiling barista pouring filter coffee from a height. Buddy takes the cup, sips, and says to camera with a satisfied grin: "Hidden gem. Officially." Buddy raises the cup in a small toast and holds the pose. Sound: soft café chatter, gentle lo-fi beat. Style: cinematic, dappled green and golden light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 08:** dissolve to the next morning at the beach.

---

### Scene 08 · 1:45–2:00 · Vibe check

**Brand link:** "Vibe check: slow mornings, ocean air and a café you can walk to" (p.10).

**Shot A (1:45–1:53)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Early morning on a red laterite clifftop above a quiet Kerala beach, with fishing boats on calm water. Buddy steps out of a small guesthouse, stretches, yawns, and breathes in the sea air as curtains blow. Buddy turns to camera with a relaxed grin and says in a warm, upbeat, friendly voice: "Vibe check. Slow morning... ocean air..." Handheld medium shot. Sound: waves, seagulls, wind chimes. Style: cinematic, soft pastel sunrise, teal-blue sea and golden light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (1:53–2:00), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, strolls a few steps along the cliff path to a tiny open-air café where the owner hands over a fresh coconut with a straw. Buddy raises the coconut toward camera and says happily: "...and a café I can walk to. Passed." Buddy gives a little thumbs-up and holds it. Sound: light acoustic beat, waves. Style: cinematic, bright morning sun, teal-blue and golden-orange grade. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 09:** a thunder clap and hard cut to the rain.

---

### Scene 09 · 2:00–2:15 · Travel dump

**Brand link:** "Weekend travel dump: rain, roadside chai and one very good detour" (p.10). Authentic: "moments that felt spontaneous, imperfect, real" (p.7).

**Shot A (2:00–2:08)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Quick playful cuts, about two seconds each, like a phone photo dump: Buddy under a small umbrella in heavy monsoon rain on a green Kerala roadside, ears drooping, laughing anyway; Buddy at a steamy roadside tea stall as a local vendor pours hot chai from a great height into a small glass; Buddy blowing on the chai, eyes closing in joy. Buddy says over the cuts in a warm, upbeat, friendly voice: "Day three travel dump. Rain... roadside chai..." Sound: heavy rain, sizzling, a camera-shutter click on each cut. Style: handheld, authentic, moody blue rain with warm orange stall light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (2:08–2:15), Extend**
```
The rain clears. Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, follows a muddy side path through dripping jungle and discovers a huge waterfall thundering into a green gorge, with a rainbow in the mist. Buddy spins to face camera, arms wide, and says: "...and one very good detour." Shutter click and freeze-frame on Buddy's happy pose. Sound: waterfall roar, upbeat percussion. Style: cinematic, fresh post-rain light, teal-blue and golden-orange grade. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 10:** unfreeze on a phone buzz.

---

### Scene 10 · 2:15–2:30 · A live tip: tonight's festival

**Brand link:** "What festival is happening tonight that isn't in any guidebook?" (p.6). "The next unforgettable experience could appear five minutes from now" (p.7). "A festival you can almost hear before you arrive" (p.2).

**Shot A (2:15–2:23)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf, small canvas backpack. Dusk, on a village road near the waterfall. Buddy's phone buzzes; Buddy looks at it, and faint festival drums play from the phone; the screen is not readable. Buddy looks up at camera, thrilled, and says in a warm, upbeat, friendly voice: "Someone just posted this. Tonight. Ten minutes away." Medium close-up. Sound: phone buzz, faint rhythmic drums from the phone, evening crickets. Style: cinematic, purple-blue dusk with a warm orange phone glow. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (2:23–2:30), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, starts jogging down the road toward a warm glow beyond the coconut palms. The drumming grows louder and Buddy's ears bounce to the beat. Buddy grins over a shoulder at camera and says: "Oh, I can hear it from here!" The camera follows Buddy toward the glowing lights and drums. Sound: traditional Kerala chenda drums growing loud. Style: cinematic, deep teal-blue night with golden lantern glow ahead. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 11:** run straight into the festival lights.

---

### Scene 11 · 2:30–2:45 · From visitor to part of it

**Brand link:** "I wasn't travelling to a destination. I was travelling into a community." and "I stopped being a spectator. I started becoming part of the story." (p.7). Belonging (p.4).

**Shot A (2:30–2:38)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Night at a vibrant Kerala village festival: rows of oil lamps glowing, drummers playing chenda drums, crowds in white and gold, marigold flowers, firecracker sparkles in the sky. Buddy stands at the edge of the crowd, watching wide-eyed. A smiling young local man reaches out a hand and says: "Come, dance with us!" Buddy hesitates for a moment, then grins. Medium shot. Sound: powerful drums, cheering crowd. Style: cinematic, glowing lamplight, golden orange against deep teal-blue night. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (2:38–2:45), Extend**
```
Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, takes the hand and joins a circle of laughing locals and guests, dancing to the drums with ears flopping happily. Mid-twirl, Buddy looks at camera, out of breath and glowing, and says: "Okay... I'm not just visiting anymore." Petals fall through the lamplight; hold on the joyful circle. Sound: drums at full energy, cheers. Style: cinematic, warm lamplight. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 12:** the drum beat carries straight into the jeep engine.

---

### Scene 12 · 2:45–3:00 · Into the hills

**Brand link:** "A main character moment on the train into the hills" (p.10), adapted here to the road into Kerala's tea hills. Self-expression and Identity: "Experiences that reflect who I am" (p.4).

**Shot A (2:45–2:53)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Day four. Buddy rides in the back of an open-top jeep climbing winding roads through endless bright-green tea plantations in Munnar, Kerala, with mist drifting through the hills. Wind ruffles Buddy's fur, ears and green scarf. Buddy grips the roll bar, grinning, and says in a warm, upbeat, friendly voice: "Windows down. Hills ahead." Tracking shot alongside the jeep. Sound: engine hum, wind, indie music rising. Style: cinematic, soft morning mist breaking into sun, lush greens, teal-blue and golden grade. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (2:53–3:00), Extend**
```
The jeep rounds a bend and a huge valley of tea hills opens below. Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, stands up in the back of the jeep, scarf fluttering, arms out, and says to camera with a confident smile: "Main character moment. No skipping this one." Drone-style pull-back reveals the tiny jeep winding through the vast green hills. Sound: music hits its chorus. Style: cinematic, sunlit mist, teal-blue sky and golden light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 13:** fade through black to pre-dawn.

---

# ACT 3: The story you bring back

### Scene 13 · 3:00–3:15 · Worth the hype

**Brand link:** "Worth the hype? Go at sunrise and decide for yourself." (p.10). **"No cap" is said by a creator in their own words** (p.10).

**Shot A (3:00–3:08)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Blue pre-dawn darkness on a high mountain viewpoint above the tea hills. Buddy, holding a small torch, climbs the last rocks, slightly out of breath, and sits beside a friendly young travel creator with a camera on a mini tripod. Buddy whispers to camera in a warm, friendly voice: "Everyone says this sunrise is worth the hype..." Low angle from behind them toward the dark horizon. Sound: wind, crickets, gravel footsteps. Style: cinematic, deep blue pre-dawn light. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (3:08–3:15), Extend**
```
The sun bursts over a sea of clouds filling the valleys, and golden light washes over Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, and the creator. The creator laughs and says: "No cap, worth the 4 a.m. alarm." Buddy's ears lift, eyes glistening, and Buddy says softly to camera: "Okay. I see it now." Both sit silhouetted against the sunrise. Sound: slow uplifting piano and strings. Style: cinematic, deep teal-blue sky melting into golden orange. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 14:** dissolve from the sunrise to the sunset on the water.

---

### Scene 14 · 3:15–3:30 · The last night

**Brand link:** "Core memory unlocked" (p.10). *Experiences over possessions* (p.10). "Every new connection makes the world feel a little more familiar" (p.2).

**Shot A (3:15–3:23)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Final evening: a traditional wooden Kerala houseboat with a curved woven roof glides on calm palm-lined backwaters at sunset. On the deck, under strings of warm lanterns, Buddy sits at a long table with the friends made on the trip: the homestay host, the young man from the festival, the travel creator and other smiling guests, all sharing food and laughing. Buddy looks around the table and says in a warm, friendly voice, a little emotional: "Four days ago, I didn't know any of you." Slow dolly along the table. Sound: water lapping, laughter, soft acoustic guitar. Style: cinematic, golden sunset turning to teal-blue dusk. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (3:23–3:30), Extend**
```
Night falls and stars appear over the backwaters, reflected in the still water. Someone starts singing and everyone joins in, clapping. Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, takes a group photo with the phone held high, everyone squeezing in. The camera flash freezes the moment; Buddy grins at camera and says: "Core memory unlocked." Sound: singing, laughter, flash click. Style: cinematic, stars and lantern glow, deep teal-blue and golden orange. No on-screen text, no subtitles, no logos, no watermarks.
```

**Transition into 15:** the flash goes white, then cut to the finale.

---

### Scene 15 · 3:30–3:45 · Pass it on (finale)

**Brand link:** "Return with a story that inspires someone else to go" and "every guest can become part of what someone else discovers next" (p.2). Positioning: *The Next Generation of Travel™* (p.4).

**Shot A (3:30–3:38)**
```
Buddy, a friendly 3D-animated rabbit mascot (high-end animated-film style): soft cream-white fur, tall ears with warm orange inner ears, big curious brown eyes, sunset-orange hoodie, leaf-green neck scarf, charcoal sneakers, small orange map-pin pendant with a green leaf. Back home in the same apartment from the start, now bright and sunny; a fresh flower garland hangs by the window and the old guidebook sits under a small potted plant. Buddy taps "share" on the phone and a small glowing orange map-pin of light rises off the screen and floats out of the open window into the city sky. Buddy watches it go and says in a warm, upbeat, friendly voice: "I found this trip through someone's story. Now it's my turn." Sound: warm magical chime, music building. Style: cinematic, bright warm daylight. No on-screen text, no subtitles, no logos, no watermarks.
```

**Shot B (3:38–3:45), Extend**
```
The glowing orange pin flies across the rooftops and lands softly on the phone of a young woman sitting at a rainy window in another city, exactly as Buddy once did. Her eyes light up and she smiles. Cut back to Buddy, the cream-white 3D rabbit in the orange hoodie and green scarf, by the sunny window, who looks straight into the camera and says with quiet pride: "This is the next generation of travel. Come be part of it." Buddy smiles; the camera eases back to leave clean, open space beside Buddy for the final two seconds. Sound: anthem music peaks, then settles. Style: cinematic, deep teal-blue and golden-orange grade. No on-screen text, no subtitles, no logos, no watermarks.
```

**End card (editor, 3:41–3:45):** fade to **white** with the **Horizontal + statement** lockup (05) centred, or use reverse white on the approved *Vacario_Hero_16x9* gradient. Add *vacario.ai* below in Arial. Use the supplied artwork unmodified, with clear space on all sides (p.11).

---

## Music map (one continuous track under the whole film)

| Time | Scenes | Mood | Notes |
|---|---|---|---|
| 0:00–0:15 | 01 | Quiet, flat | Rain and a ticking clock only; no music |
| 0:15–1:00 | 02–04 | Curious, building | Soft plucks and light piano that grows |
| 1:00–1:15 | 05 | Lift-off | Beat kicks in on the button press |
| 1:15–2:15 | 06–09 | Warm, playful | Acoustic guitar and light percussion, with local instruments layered in |
| 2:15–2:45 | 10–11 | High energy | Hand the music over to the festival chenda drums for this section |
| 2:45–3:00 | 12 | Soaring | Indie chorus |
| 3:00–3:30 | 13–14 | Emotional | Piano and strings, then voices singing on the boat |
| 3:30–3:45 | 15 | Anthem | Peak, then resolve on the logo |

Use licensed or original music. Don't use a recognisable commercial track.

## Cut-downs from the same footage

| Length | Use | Scenes |
|---|---|---|
| 15 s | Reels, Shorts | Any single scene + 1.5 s end card |
| 30 s | Pre-roll | 02 → 04 → 11 → 15 |
| 60 s | Launch post | 01, 02, 04, 05, 07, 11, 13, 14 (first halves), then 15 |
| 3:45 | YouTube, website, events | Full film |

## Before you publish: brand check

- [ ] Buddy's look and outfit are the same in every scene
- [ ] Buddy says **guests** and **partners**, never users, travellers or Gen Z'ers
- [ ] Gen Z phrases point to something real. "No cap" comes only from the creator (scene 13)
- [ ] Booking scene (05) uses plain language with no prices
- [ ] No AI-generated text or logos in frame. Logo added in the editor from the supplied artwork
- [ ] Captions use Vacario™ and The Next Generation of Travel™, in Arial and sentence case
- [ ] Generated places and people are presented as illustrative, not as real reviews or real guests
- [ ] The film feels **Authentic / Curious / Connected / Empowering**
