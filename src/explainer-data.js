/* Content added for the full explainer document (explainer-print.html).
   Everything here is a proposed operating version of the vacario India Fall 2026 plan:
   the customer lifecycle, channel messaging, new workflows and the rollout plan. */

/* ------------------------------------------------------------------ customer lifecycle */
const LIFE = [
  {id:'discover', n:'L1', name:'Discover', who:'Aware',
    entry:'Has seen Vacario at least once: an ad, a creator post, press, a friend’s link.',
    exit:'Visits the app or site.',
    thinks:'“Where could I go next? Is this a brand I can trust?”',
    job:'Inspire with real destinations and stays, and earn the first visit.',
    msgs:['Next-generation travel, India first','Real stays, real prices, real reviews'],
    ch:['Consumer','Creator','Corporate'], tp:'Search and social ads, YouTube, creator posts, PR, OOH',
    owner:'Performance marketing', kpis:['Reach','Cost per install (CPI)']},
  {id:'explore', n:'L2', name:'Explore', who:'Visitor',
    entry:'Visited the app or site, or installed the app, without an account.',
    exit:'Creates an account, or leaves for 30 days (back to Discover).',
    thinks:'“Is there something here for my budget and my group?”',
    job:'Show relevant destinations fast and make signing up worth it.',
    msgs:['See member prices','Save trips you like'],
    ch:['Consumer'], tp:'App, website, retargeting ads, search',
    owner:'Product + performance marketing', kpis:['Sign-up rate']},
  {id:'join', n:'L3', name:'Join', who:'Member',
    entry:'Created an account.',
    exit:'Makes a first booking. No booking in 90 days moves the member to At-risk.',
    thinks:'“Let me look around before I commit.”',
    job:'Learn what they want and help them to a first booking.',
    msgs:['Welcome: tell us how you travel','Your first-booking offer','Price drop on a trip you saved'],
    ch:['Consumer','Lifecycle'], tp:'Welcome email and push, WhatsApp (with consent), in-app feed',
    owner:'CRM lead', kpis:['Opt-in rate','30-day booking conversion','Activation rate']},
  {id:'book', n:'L4', name:'First booking', who:'New customer',
    entry:'Paid for a first booking.',
    exit:'Moves to Pre-trip at once.',
    thinks:'“Did it go through? What happens now?”',
    job:'Confirm instantly and remove every doubt.',
    msgs:['You’re booked: itinerary, invoice, help line','Here’s what happens next'],
    ch:['Consumer'], tp:'Confirmation email, WhatsApp, in-app trip wallet',
    owner:'Product + customer service', kpis:['Blended CAC','Average booking value']},
  {id:'pretrip', n:'L5', name:'Prepare', who:'Booked traveller',
    entry:'Has a confirmed booking with a future check-in.',
    exit:'Checks in (In-trip) or cancels (back to Member).',
    thinks:'“How do I get there? What should we do?”',
    job:'Prepare them well and add useful extras.',
    msgs:['7 days to go: directions, weather, tips','Things to do near your stay'],
    ch:['Consumer','Destination & Merchant'], tp:'Push, WhatsApp, email at T-7 and T-1',
    owner:'CRM lead', kpis:['Ancillary revenue per trip']},
  {id:'intrip', n:'L6', name:'Experience', who:'Traveller',
    entry:'Checked in.',
    exit:'Checks out.',
    thinks:'“Is this as promised? Who helps me if not?”',
    job:'Be useful during the trip and fix problems fast.',
    msgs:['Need anything? We reply in minutes','Tonight nearby: offers for you'],
    ch:['Destination & Merchant','Consumer'], tp:'WhatsApp support, in-app offers, concierge',
    owner:'Customer service + destination partnerships', kpis:['In-trip view rate','Redemption rate']},
  {id:'posttrip', n:'L7', name:'Review & share', who:'Returned traveller',
    entry:'Checked out in the last 30 days.',
    exit:'After 30 days moves to Repeat track (Lifecycle).',
    thinks:'“That was great (or not). Should I tell people?”',
    job:'Collect the review, fix anything that went wrong, invite sharing and referral.',
    msgs:['How was your stay?','Share your photos','Give ₹X, get ₹X'],
    ch:['Consumer','Lifecycle'], tp:'Push, email, in-app review, referral link',
    owner:'Community & social', kpis:['Review rate','Referral share','NPS by audience']},
  {id:'repeat', n:'L8', name:'Repeat', who:'Loyal customer',
    entry:'Two or more bookings in the last 12 months.',
    exit:'Refers someone who books (Advocate), or goes quiet (At-risk).',
    thinks:'“Where to next? Do they remember me?”',
    job:'Make the next trip easy and rewarding.',
    msgs:['Trip ideas from your last stay','Member prices and points','Long weekends and festivals'],
    ch:['Lifecycle'], tp:'Email, push, WhatsApp, loyalty',
    owner:'CRM lead', kpis:['12-month repeat rate','Loyalty share']},
  {id:'advocate', n:'L9', name:'Advocate', who:'Promoter',
    entry:'Referred at least one friend who booked, or scored 9–10 on NPS and shared content.',
    exit:'Stays an advocate while active; goes to At-risk like anyone else.',
    thinks:'“I love this. I want my friends to try it.”',
    job:'Recognise, reward and give them reasons to keep sharing.',
    msgs:['Thank you: here’s a reward','Be first to try new destinations'],
    ch:['Lifecycle','Creator'], tp:'Referral credits, early access, ambassador invite',
    owner:'CRM lead + community', kpis:['Referral share','NPS by audience']}
];
const LIFE_SIDE = [
  {name:'At-risk', rule:'A member with no app visit in 60 days and no upcoming trip, or a customer with no booking in 9 months.',
   act:'Personal offer or message within 7 days of the flag; ask what changed.', kpi:'Win-back rate'},
  {name:'Lapsed', rule:'No booking in 18 months and no visit in 90 days, after two win-back attempts.',
   act:'Move to a quarterly “what’s new” message only, to protect deliverability and respect the customer.', kpi:'Share of base lapsed'},
  {name:'Won back', rule:'An At-risk or Lapsed customer who books again.',
   act:'Treat as Repeat; note what brought them back in the knowledge base.', kpi:'Win-back rate'}
];
/* trip timeline: day relative to check-in (T) or check-out (C) */
const TIMELINE = [
  ['Booking','Confirmation within 1 minute: itinerary, GST invoice, help line','Consumer'],
  ['T-7','Directions, weather, packing tips; offers near the stay','Consumer · Destination'],
  ['T-1','Check-in details, host contact, what to do tomorrow','Consumer'],
  ['T (arrival)','“We’re here if you need us”; one offer for the evening','Destination'],
  ['During stay','At most one offer a day; support replies within 15 minutes','Destination · Consumer'],
  ['C+1','Review request; problem? personal follow-up the same day','Consumer'],
  ['C+7','Photo and video invite for the feed; referral link','Consumer · Lifecycle'],
  ['C+30','Next-trip ideas; hand over to the Repeat track','Lifecycle'],
  ['C+60','No new booking and no visit? Flag At-risk','Lifecycle']
];
const CONTACT_RULES = [
  ['Frequency','At most one marketing message a day per person, across all touchpoints; at most three marketing WhatsApp messages a week.'],
  ['Quiet hours','No marketing messages between 9 pm and 9 am IST. Service messages (booking, safety) may go any time.'],
  ['Consent first','WhatsApp, SMS and push marketing only to people who opted in for that touchpoint. Consent is recorded with time and wording.'],
  ['Service beats sales','Nobody with an open complaint gets a marketing message until it is resolved.'],
  ['One voice','Lifecycle owns the calendar of who gets what; other channels book slots in it instead of sending directly.'],
  ['Language','English plus the traveller’s chosen language (for example Telugu or Hindi) where templates exist.']
];
const SEGMENTS = [
  ['Families','Space, safety, kid-friendly stays and activities','School holidays, Diwali, summer'],
  ['Friends and groups','Value per head, fun, split payments','Long weekends, New Year'],
  ['Couples and honeymooners','Romance, privacy, special touches','Wedding season, Valentine’s week'],
  ['Solo and young professionals','Easy, social, workation-friendly','Long weekends, monsoon'],
  ['Pilgrimage and heritage','Trusted stays near temples and sites, elders’ comfort','Festival calendars'],
  ['NRIs visiting home','Family stays, easy payments, trusted hosts','December, summer']
];
const PARTNER_LIFE = [
  ['Supplier','Prospect → Signed → Live → Performing → Top partner','No bookings in 60 days, falling availability, repeat cancellations','Quarterly review, promotion invite, content refresh'],
  ['Creator','Scouted → Signed → Posting → Converting → Ambassador','No post in 45 days, late content, low conversion','Re-brief, new destination, tier review'],
  ['Merchant / sponsor','Mapped → Offer signed → Live → Redeeming → Renewed','Few redemptions, late settlement, no report','Better timing, results report, renewal 60 days early']
];

/* ------------------------------------------------------------------ channel messaging */
const MSG = {
  consumer:{pillars:[['Discover','Inspiring destinations and real stays, chosen for how Indians travel now.','“Your next long weekend starts here.”'],
    ['Trust','Verified stays, clear prices, instant confirmation and help within minutes.','“What you see is what you get, and we’re a message away.”'],
    ['Rewards','Member prices, referral credit and loyalty points that add up.','“Book twice, and the third one is on your points.”']],
    tone:'Warm, confident, plain. Local languages where we can.',
    tactics:[['Paid search and shopping','Capture people already searching for destinations and stays'],['Paid social and video','Inspire and retarget on Meta and YouTube'],['Earned media','Stories about new destinations and the India-first launch'],['Creator content','Reused in ads, CRM and the in-app feed'],['CRM: email, WhatsApp, SMS, push','Welcome, nudges, confirmations, trip preparation'],['Referral and loyalty','Turn happy guests into the next bookings']]},
  supply:{pillars:[['New demand','Travellers from across India looking for stays like yours.','“Fill your quiet weeks with guests who want exactly what you offer.”'],
    ['Fair and fast','Clear commission, no hidden fees, payouts on the agreed date.','“Know what you earn, and get it on time.”'],
    ['Easy','Listing help, channel-manager and API connections, one account manager.','“We set it up with you, and one person looks after you.”']],
    tone:'Businesslike, specific, respectful of the owner’s time.',
    tactics:[['Direct outreach','Calls, email and LinkedIn to target properties'],['Associations and trade events','Hotel associations, travel fairs'],['Referrals from partners','Existing partners introduce neighbours'],['Partner portal','Self-serve updates, statements and promotions'],['Monthly statements','Results that show the value of staying'],['Quarterly reviews','Grow inventory with the best partners']]},
  creator:{pillars:[['Earn','Commission on every booking you drive, plus fees and hosted trips.','“Your audience books, you earn.”'],
    ['Stories','Stays and destinations worth filming, with the details sorted.','“We handle the trip. You tell the story.”'],
    ['Grow','Tiers, ambassador deals and early access to launches.','“The best creators help shape where we go next.”']],
    tone:'Friendly, collaborative, clear about money and rules.',
    tactics:[['Scouting by language and region','Telugu, Hindi, Tamil and English creators'],['Creator programme','Tiers, links, codes, payouts'],['Hosted trips','Stays booked through Supply'],['Whitelisting','Best posts boosted as paid ads'],['Campus ambassadors','Students promoting group trips'],['Monthly statements','Clicks, bookings and earnings']]},
  destination:{pillars:[['Reach','Visitors already in your town, at the moment they are choosing what to do.','“Guests nearby, looking for tonight’s plan.”'],
    ['Results','Every redemption counted and visible to you.','“You see the same numbers we do.”'],
    ['Partnership','Co-marketing with a platform growing across India.','“Grow with the next generation of travel.”']],
    tone:'Local, practical, partnership-minded.',
    tactics:[['Destination mapping','Tourism boards, attractions, restaurants, experiences'],['Offer programme','Codes and QR redemption'],['In-app guides','Itineraries and offer cards'],['Pre-trip and in-trip messages','Timely offers, one a day at most'],['Tourism board campaigns','Co-funded and reported'],['Seasonal refresh','Festivals, winter, summer, monsoon']]},
  corporate:{pillars:[['What we’re building','The next generation of travel, launching in India before any other country.','“Built for how India travels next.”'],
    ['Growth and proof','Milestones, partnerships and numbers checked by finance.','“Every number we share is one we can stand behind.”'],
    ['Partnership','Working with governments, tourism bodies and industry.','“Good for travellers, hosts and local economies.”']],
    tone:'Clear, factual, confident, never inflated.',
    tactics:[['Message house','One story, three proof points each'],['Milestone calendar','One major story a month'],['Investor updates','Monthly, on time'],['Press and interviews','Through one spokesperson'],['Government and tourism relations','Meetings, MoUs, joint campaigns'],['LinkedIn and owned channels','Company news and hiring']]},
  lifecycle:{pillars:[['Welcome','Help every new member or partner to a first result.','“Here’s one thing to do first.”'],
    ['Value','Something useful every month, never just a sale.','“Here’s what’s new for you.”'],
    ['Recognition','Notice milestones and reward loyalty.','“Five trips with us. Thank you.”']],
    tone:'Personal, helpful, never pushy.',
    tactics:[['Triggered journeys','Welcome, activation, at-risk, win-back'],['Monthly value updates','Trip ideas, statements, earnings'],['Loyalty and milestones','Points, badges, member prices'],['Feedback','NPS and follow-up calls'],['Renewals','Partners and sponsors, 60 days early'],['Contact policy','Frequency caps and quiet hours']]},
  internal:{pillars:[['One source of truth','One dashboard, one knowledge base, one decision log.','“If it isn’t written down, it wasn’t decided.”'],
    ['Clear paths','Everyone knows who decides, who acts and who is told.','“Every action has one owner and a date.”'],
    ['Across time zones','Canada, India and the Philippines hand over every day.','“Nothing waits overnight.”']],
    tone:'Direct, brief, written down.',
    tactics:[['Meeting rhythm','Daily, weekly, monthly'],['Handoff notes','End of each region’s day'],['Dashboard','Every Monday'],['Knowledge base','Contracts, SOPs, notes, decisions'],['Escalation path','SEV 1–3'],['Policies','Brand, approvals, data and security']]}
};

/* ------------------------------------------------------------------ new workflows
   lanes: owners; steps: {l, t, d (definition), sla, out}; kpi: [name, formula]          */
const NEWFLOW = [
  {id:'lead', n:'W1', name:'Lead management & routing',
    why:'The plan runs several lead flows at once: travellers who enquire, suppliers, creators, merchants, partners and investors. Without one way to capture, score and route them, leads wait, get lost or get two replies. This workflow gives every lead one owner and a response time.',
    serves:['Consumer','Supply','Creator','Destination & Merchant','Corporate'],
    lanes:{mo:'Marketing operations', td:'Travel desk (B2C)', bd:'Business development (B2B)', crm:'CRM'},
    steps:[
      {l:'mo', t:'Capture', d:'Every enquiry becomes one lead record, whatever the source: web form, WhatsApp, call, event, email or partner referral. Source and campaign are tagged.', sla:'Automatic; manual entries same day', out:'Lead record'},
      {l:'mo', t:'Clean and match', d:'Remove duplicates and link to any existing member, supplier or partner record so nobody is contacted twice.', sla:'Within 1 hour', out:'One record per person or business'},
      {l:'mo', t:'Score and classify', d:'B2C: hot (dates and budget given), warm, cold. B2B: supplier, creator, merchant, partner or investor.', sla:'Within 1 hour', out:'Scored lead', gate:'Qualified?', loop:'No → CRM nurture list'},
      {l:'td', t:'Route to an owner', d:'Hot B2C leads to the travel desk; B2B leads to the named BD owner for that type; cold leads to CRM nurture.', sla:'Owner assigned within 1 hour', out:'Lead with owner'},
      {l:'td', t:'First response', d:'Reply personally with something useful: options, a price, a call slot.', sla:'Hot B2C: 15 min in working hours · B2B: 1 working day', out:'Conversation started'},
      {l:'bd', t:'Follow up', d:'Three touches over seven days, each adding value (a stay idea, a case study, an answer). Stop if they say no.', sla:'Day 1, 3 and 7', out:'Decision from the lead'},
      {l:'bd', t:'Convert or close', d:'Won leads move to the right workflow (booking, supplier onboarding, creator onboarding). Lost leads are closed with a reason.', sla:'Within 30 days of capture', out:'Won or closed with reason'},
      {l:'crm', t:'Report and learn', d:'Weekly lead funnel by source and owner; reasons for losses feed campaigns and pitches.', sla:'Every Monday', out:'Lead funnel report'}
    ],
    kpi:[['Lead response time','Median minutes (B2C) or hours (B2B) from capture to first reply'],['Owner assigned within 1 hour','Leads with an owner within 1 h ÷ leads captured × 100'],['Lead-to-qualified rate','Qualified leads ÷ leads captured × 100'],['Qualified-to-won rate','Won ÷ qualified leads closed × 100'],['Cost per qualified lead','Spend on lead generation ÷ qualified leads']]},
  {id:'campaign', n:'W2', name:'Campaign launch',
    why:'Campaigns cross channels: an offer needs creative, paid media, CRM, creators, sometimes suppliers and legal checks. This workflow makes every campaign start from one brief and end with a written result.',
    serves:['Consumer','Creator','Destination & Merchant','Internal'],
    lanes:{ml:'Marketing lead', cc:'Content & creative', pc:'Performance & CRM', fl:'Finance & legal', an:'Analytics'},
    steps:[
      {l:'ml', t:'Brief', d:'One page: goal, audience, offer, budget, dates, the KPI that decides success and its target.', sla:'6 weeks before launch', out:'Approved brief'},
      {l:'ml', t:'Plan channels', d:'Choose channels and the calendar slot with Lifecycle so no audience is over-messaged.', sla:'5 weeks before', out:'Channel plan'},
      {l:'cc', t:'Make creative', d:'Copy and assets for every touchpoint, in English and the chosen regional languages.', sla:'3 weeks before', out:'Creative set'},
      {l:'fl', t:'Check and approve', d:'Brand check, legal check of claims and terms, finance check of budget and discount cost.', sla:'3 working days', out:'Approved campaign', gate:'Approved?', loop:'No → revise creative'},
      {l:'an', t:'Set up tracking', d:'Campaign tags, promo codes, dashboard view and a baseline to compare against.', sla:'1 week before', out:'Tracking ready'},
      {l:'pc', t:'Launch and check', d:'Go live, test every link and code, confirm the first results are recording.', sla:'Launch day', out:'Live campaign'},
      {l:'pc', t:'Optimise', d:'Move budget to what works, pause what does not, refresh creative that tires.', sla:'Weekly', out:'Better results'},
      {l:'an', t:'Wrap up', d:'Results against the target, what we learned, and what to do next time, filed in the knowledge base.', sla:'2 weeks after end', out:'Campaign report'}
    ],
    kpi:[['Campaigns launched on time','On-time launches ÷ campaigns planned × 100'],['Return on ad spend','Gross booking value from the campaign ÷ campaign spend'],['Cost per booking vs plan','Actual cost per booking ÷ planned cost per booking'],['Reports filed','Campaigns with a wrap-up report ÷ campaigns ended × 100']]},
  {id:'referral', n:'W3', name:'Referral programme',
    why:'Referral bookings cost almost nothing in media and come with trust built in. The plan names referral programmes as a consumer channel; this workflow defines when to ask, when to pay out and how to stop abuse.',
    serves:['Consumer','Lifecycle'],
    lanes:{g:'Guest', pr:'Product', crm:'CRM', fin:'Finance'},
    steps:[
      {l:'crm', t:'Ask at the right moment', d:'Invite after a 4–5 star review, after a milestone, or when the guest shares a trip.', sla:'Same day as the trigger', out:'Invitation sent'},
      {l:'g', t:'Share', d:'The guest shares a personal link or code by WhatsApp or social.', sla:'Guest’s choice', out:'Link shared'},
      {l:'pr', t:'Friend joins', d:'The friend signs up with the link; a welcome credit is reserved for both.', sla:'Instant', out:'Referred member'},
      {l:'pr', t:'Friend travels', d:'Credit becomes payable only after the friend’s first trip is completed, which prevents cancellation abuse.', sla:'At check-out', out:'Qualified referral', gate:'Trip completed?', loop:'No → credit stays reserved 90 days'},
      {l:'fin', t:'Check for abuse', d:'Same device, payment card or address, or self-referral, blocks the credit.', sla:'Within 2 days', out:'Clean referral'},
      {l:'fin', t:'Release credits', d:'Credit both wallets and tell both people.', sla:'Within 3 days of check-out', out:'Credits paid'},
      {l:'crm', t:'Thank and recognise', d:'Top referrers are thanked, rewarded and invited to become advocates.', sla:'Monthly', out:'Advocates'}
    ],
    kpi:[['Invite rate','Guests who shared a link ÷ guests invited × 100'],['Referral sign-ups','Sign-ups through referral links'],['Referral share','Referral bookings ÷ all bookings × 100'],['Cost per referral booking','Referral credits paid ÷ referral bookings'],['Referral abuse rate','Blocked referrals ÷ referrals checked × 100']]},
  {id:'reviews', n:'W4', name:'Reviews and user photos & videos (UGC)',
    why:'Reviews build trust for the next traveller, show suppliers what to fix and supply content for the feed and ads. This workflow covers collecting, checking, answering and reusing them fairly.',
    serves:['Consumer','Supply','Creator'],
    lanes:{crm:'CRM', cs:'Community & social', sv:'Customer service', sp:'Supply'},
    steps:[
      {l:'crm', t:'Request', d:'One-tap rating the day after check-out, then an invite to add photos or video.', sla:'C+1 and C+7', out:'Review requested'},
      {l:'cs', t:'Check before publishing', d:'Remove personal data and abuse. Never edit the meaning or hide a fair negative review.', sla:'Within 24 hours', out:'Published review'},
      {l:'cs', t:'Reply', d:'Reply to every review. Three stars or fewer get a personal reply and a support ticket.', sla:'Within 48 hours', out:'Answered review', gate:'3 stars or fewer?', loop:'Yes → service recovery (W5)'},
      {l:'sp', t:'Tell the supplier', d:'Negative issues go to the supplier within a day; a weekly digest covers everything else.', sla:'24 hours / weekly', out:'Supplier action'},
      {l:'cs', t:'Ask to reuse', d:'Ask permission before using a guest’s photo or video in marketing, and credit them.', sla:'Before any reuse', out:'Consent to reuse'},
      {l:'cs', t:'Reuse', d:'Best content goes to the in-app feed, social and ads.', sla:'Weekly', out:'UGC in use'}
    ],
    kpi:[['Review rate','Reviews ÷ completed trips × 100'],['Average rating','Sum of ratings ÷ number of ratings'],['Review reply time','Median hours from publish to reply'],['Negative reviews resolved','Negative reviews with a closed support ticket ÷ negative reviews × 100'],['UGC pieces reused','Guest photos and videos used with permission']]},
  {id:'support', n:'W5', name:'Customer support & service recovery',
    why:'The plan promises communication through the whole trip. When something goes wrong, how fast and how fairly Vacario fixes it decides whether the guest comes back. This workflow sets response times, limits for compensation and the loop back to suppliers.',
    serves:['Consumer','Supply','Lifecycle','Internal'],
    lanes:{g:'Guest', sv:'Customer service', sp:'Supply', fin:'Finance'},
    steps:[
      {l:'g', t:'Contact', d:'By WhatsApp, in-app chat, phone or email. One number and one chat everywhere.', sla:'24/7', out:'Contact received'},
      {l:'sv', t:'Log and sort', d:'Every contact is a ticket with a type: booking change, payment, stay problem, safety.', sla:'Immediately', out:'Ticket', gate:'Safety or stranded?', loop:'Yes → SEV 1 escalation'},
      {l:'sv', t:'First response', d:'A person replies, confirms they understand and says what happens next.', sla:'In-trip: 15 min · otherwise 4 h', out:'Guest informed'},
      {l:'sp', t:'Fix with the supplier', d:'Call the supplier, find another room or stay, or arrange what is needed.', sla:'In-trip: within 2 h', out:'Problem fixed or alternative'},
      {l:'fin', t:'Make it right', d:'Refund, credit or upgrade within set limits: the agent up to a set amount, the team lead above it, finance above that.', sla:'Same day', out:'Recovery offered'},
      {l:'sv', t:'Close and check', d:'Close only when the guest confirms; send a short satisfaction question.', sla:'Within 24 h of fix', out:'Closed ticket, CSAT'},
      {l:'sp', t:'Stop it happening again', d:'Weekly review of causes; repeat supplier issues go to Supply’s account manager.', sla:'Weekly', out:'Root-cause actions'}
    ],
    kpi:[['First response time','Median minutes from contact to first human reply'],['Resolution time','Median hours from contact to closed ticket'],['First-contact resolution','Tickets solved in one contact ÷ tickets × 100'],['Customer satisfaction (CSAT)','Satisfied answers ÷ all answers × 100'],['Refunds and credits as % of GBV','Refunds + credits ÷ gross booking value × 100']]},
  {id:'consent', n:'W6', name:'Consent & data privacy',
    why:'CRM, WhatsApp, SMS and push only work with permission, and India’s Digital Personal Data Protection Act, 2023 sets rules for collecting and using personal data. This workflow makes consent clear, recorded and easy to withdraw, which also keeps messages welcome.',
    serves:['Consumer','Lifecycle','Internal'],
    lanes:{pr:'Product', crm:'CRM', lg:'Legal & data protection', sv:'Customer service'},
    steps:[
      {l:'pr', t:'Ask clearly', d:'A plain notice for each purpose (email, WhatsApp, SMS, push marketing), in English and the user’s language. No pre-ticked boxes.', sla:'At sign-up and in settings', out:'Consent choice'},
      {l:'pr', t:'Record it', d:'Store what was agreed, when, where and the wording version.', sla:'Instantly', out:'Consent record'},
      {l:'crm', t:'Use approved templates', d:'SMS through registered DLT headers and templates; WhatsApp through approved message templates.', sla:'Before any send', out:'Compliant messages'},
      {l:'pr', t:'Preference centre', d:'Change or withdraw consent at any time, as easily as it was given.', sla:'Always available', out:'Updated preferences'},
      {l:'crm', t:'Honour opt-outs', d:'Stop marketing on that touchpoint at once; confirm to the user.', sla:'Within 24 hours', out:'Opt-out applied'},
      {l:'sv', t:'Handle data requests', d:'Access, correction and erasure requests are logged and answered.', sla:'Within 30 days (proposed)', out:'Request closed'},
      {l:'lg', t:'Review and report', d:'Quarterly review of notices, vendors and records; any breach follows the SEV 1 path and the Act’s notification duties.', sla:'Quarterly', out:'Compliance report'}
    ],
    kpi:[['Opt-in rate','Users opted in (per touchpoint) ÷ sign-ups × 100'],['Opt-outs honoured in 24 hours','Opt-outs applied within 24 h ÷ opt-outs × 100'],['Data requests on time','Requests closed within the deadline ÷ requests × 100'],['Messages on approved templates','Sends using approved templates ÷ sends × 100']]},
  {id:'promo', n:'W7', name:'Promotions & offer approval',
    why:'Discounts can buy bookings or simply give away margin. This workflow makes every promotion prove its cost per extra booking, agree who pays, and follow approval limits.',
    serves:['Consumer','Supply','Destination & Merchant','Internal'],
    lanes:{mk:'Marketing', fin:'Finance', sp:'Supply', pr:'Product'},
    steps:[
      {l:'mk', t:'Propose', d:'Goal, audience, offer, dates, expected extra bookings and cost.', sla:'4 weeks before', out:'Promotion proposal'},
      {l:'fin', t:'Check the margin', d:'Cost per extra booking against contribution per booking; who funds the discount.', sla:'3 working days', out:'Margin check'},
      {l:'sp', t:'Agree co-funding', d:'Where suppliers or merchants share the cost, agree it in writing.', sla:'2 weeks before', out:'Co-funding agreed'},
      {l:'fin', t:'Approve by limit', d:'Proposed limits: up to 10% off by the marketing lead, up to 20% by finance, above that by the CEO.', sla:'2 working days', out:'Approved promotion', gate:'Within limit?', loop:'No → escalate'},
      {l:'pr', t:'Build codes and terms', d:'Codes, caps, expiry and plain terms and conditions.', sla:'1 week before', out:'Codes live in test'},
      {l:'mk', t:'Launch and watch', d:'Daily check of redemptions, cost and abuse; stop early if abused.', sla:'Daily while live', out:'Controlled promotion'},
      {l:'fin', t:'Evaluate', d:'Extra bookings against a baseline, true cost and whether to repeat.', sla:'2 weeks after end', out:'Promotion report'}
    ],
    kpi:[['Promotion booking share','Bookings using a promotion ÷ all bookings × 100'],['Discount cost as % of GBV','Discounts given ÷ gross booking value × 100'],['Cost per extra booking','Discount cost ÷ extra bookings over baseline'],['Promotion abuse rate','Blocked or reversed redemptions ÷ redemptions × 100']]}
];

/* ------------------------------------------------------------------ rollout */
const ROADMAP = [
  ['Weeks 1–4','Foundations',['Name the accountable owner for each channel and workflow','Set up the KPI Workspace and enter the first month’s numbers','Agree targets from the budget model','Consent notices, preference centre, SMS DLT and WhatsApp templates approved','Message house for Corporate signed off','Contact policy and lifecycle calendar agreed']],
  ['Weeks 5–8','Launch',['Welcome, first-booking and pre-trip journeys live','Lead management and routing live for B2C and B2B','Supplier outreach in priority destinations','First 20 creators signed and briefed','First destination offers live in two cities','Weekly management review running with the dashboard']],
  ['Weeks 9–13','Scale and learn',['Referral programme and reviews workflow live','At-risk and win-back journeys live','Festive-season campaign through the campaign launch workflow','First quarterly partner and creator reviews','First quarterly consent and data review','Review every KPI against target and reset for next quarter']]
];

/* ------------------------------------------------------------------ customer journey map
   per lifecycle stage: what the customer does, how they feel (1 low – 5 high), the pain point and our answer */
const JOURNEY = {
  discover:{doing:'Scrolls Reels, searches “weekend trips near me”, hears from friends', feel:3, pain:'Too many choices, not sure who to trust', fix:'Real stays and real reviews in every ad and creator post'},
  explore:{doing:'Browses stays, compares prices with other sites', feel:3, pain:'Hidden fees elsewhere, slow pages', fix:'All-in prices shown, fast app, member prices behind sign-up'},
  join:{doing:'Creates an account, saves a few trips', feel:4, pain:'Asked for too much too soon; spammy messages', fix:'Three-question welcome quiz, consent asked clearly, one useful message at a time'},
  book:{doing:'Pays and waits for confirmation', feel:4, pain:'Anxiety: did it go through? Is the stay real?', fix:'Confirmation within one minute with itinerary, invoice and help line'},
  pretrip:{doing:'Plans the route, packs, tells family', feel:4, pain:'Missing directions or check-in details', fix:'T-7 and T-1 messages with everything in one place'},
  intrip:{doing:'Checks in, explores, eats out', feel:5, pain:'A problem at the stay with nobody answering', fix:'Human reply within 15 minutes, 24/7, and a fix within 2 hours'},
  posttrip:{doing:'Shares photos, tells friends, sorts payments', feel:4, pain:'Unresolved issue; review ignored', fix:'Reply to every review in 48 hours; service recovery for 3 stars or fewer'},
  repeat:{doing:'Thinks about the next holiday', feel:4, pain:'Generic offers that ignore past trips', fix:'Ideas based on the last stay, points that add up'},
  advocate:{doing:'Recommends Vacario, posts about trips', feel:5, pain:'No thanks for referrals', fix:'Credits for both, recognition, early access'}
};
const MOMENTS = [
  ['First impression','The first ad or creator post: does it look real and relevant?','Discover'],
  ['The price moment','All-in price with no surprises at checkout','Explore · Book'],
  ['The confirmation minute','Instant, complete confirmation removes booking anxiety','Book'],
  ['Arrival','The stay matches the photos and someone answers if not','Experience'],
  ['The problem','How fast and fairly an issue is fixed decides if they return','Experience · Review'],
  ['The thank-you','A reply to their review and a reward for their referral','Review & share · Advocate']
];

/* ------------------------------------------------------------------ yes / no decision flows
   each item: {t:'start'|'step'|'ask'|'end', x:text, no:'what happens on no' , to:'where the no path goes'} */
const DECIDE = {
  traveller:{title:'The traveller’s path, decision by decision', items:[
    {t:'start', x:'Sees Vacario (ad, creator, friend, press)'},
    {t:'ask', x:'Visits the app or site?', no:'Retarget with a different destination or creator; stay in Discover', to:'Discover'},
    {t:'ask', x:'Creates an account?', no:'Remind of member prices; retarget for 30 days, then back to Discover', to:'Explore'},
    {t:'ask', x:'Books within 30 days?', no:'Welcome nudges at 24 h, 72 h, 7 days; no booking in 90 days → At-risk', to:'Join / At-risk'},
    {t:'ask', x:'Travels as planned (not cancelled)?', no:'Refund per policy; offer to rebook with a credit', to:'Join'},
    {t:'ask', x:'Happy with the stay (4–5 stars)?', no:'Service recovery (W5) within the day; supplier told; ask again after the fix', to:'Recovery'},
    {t:'step', x:'Review, photos and referral link sent (W3, W4)'},
    {t:'ask', x:'Books again within 12 months?', no:'At-risk at 9 months → win-back offer; no response after two tries → Lapsed', to:'At-risk / Lapsed'},
    {t:'ask', x:'Refers a friend who books?', no:'Stay a Repeat customer; invite again after the next great trip', to:'Repeat'},
    {t:'end', x:'Advocate: rewarded, recognised, first to try new destinations'}
  ]},
  business:{title:'A business trip, decision by decision', items:[
    {t:'start', x:'Employee requests a trip (dates, city, purpose)'},
    {t:'ask', x:'Within the company’s travel policy?', no:'Send to the approver with the reason and a policy-compliant alternative', to:'Approval'},
    {t:'ask', x:'Approver says yes? (only if outside policy)', no:'Traveller changes the request or the trip is cancelled; reason logged', to:'Request'},
    {t:'ask', x:'Preferred flight and hotel available at policy price?', no:'Corporate desk offers the next-best options within 1 hour', to:'Booking'},
    {t:'step', x:'Booked: itinerary, GST details and duty-of-care contact sent'},
    {t:'ask', x:'Change or problem during the trip?', no:'Trip runs as booked', to:'Settlement'},
    {t:'step', x:'Yes: 24/7 corporate desk rebooks within policy and tells the travel manager'},
    {t:'ask', x:'Invoice matches the booking and GST details?', no:'Corrected invoice within 2 working days', to:'Settlement'},
    {t:'step', x:'Monthly report: spend, savings, policy compliance'},
    {t:'ask', x:'Account renews at year end?', no:'Exit review: what went wrong, what would win it back', to:'Lost account'},
    {t:'end', x:'Renewed account: new rates, updated policy, quarterly reviews'}
  ]},
  mice:{title:'A MICE event, decision by decision', items:[
    {t:'start', x:'Company enquires about a meeting, incentive trip, conference or exhibition'},
    {t:'ask', x:'Dates, group size, city and budget workable?', no:'Suggest other dates, cities or formats; refer out if we can’t serve it', to:'Closed or re-briefed'},
    {t:'step', x:'Brief agreed; proposal with venues, rooms, travel, activities and costs within 5 working days'},
    {t:'ask', x:'Proposal accepted?', no:'Revise up to twice; if still no, close with the reason', to:'Lost (reason logged)'},
    {t:'ask', x:'Site inspection wanted?', no:'Go straight to contract', to:'Contract'},
    {t:'step', x:'Yes: site visit hosted within 10 days'},
    {t:'ask', x:'Contract signed and deposit paid by the hold date?', no:'Room and venue holds released; client told in writing', to:'Closed'},
    {t:'step', x:'Planning: rooming list, agenda, transport, food, branding; attendee invitations and registration'},
    {t:'ask', x:'Final numbers confirmed by the cut-off?', no:'Apply the agreed attrition terms; adjust rooms and catering', to:'Planning'},
    {t:'step', x:'Event delivered with an on-site desk and a daily client check-in'},
    {t:'ask', x:'Client and attendee satisfaction on target?', no:'Recovery call within 48 hours; credit per contract where due', to:'Post-event'},
    {t:'ask', x:'Books the next event?', no:'Stay in touch quarterly with ideas and dates', to:'Nurture'},
    {t:'end', x:'Repeat client: next event briefed, account plan updated'}
  ]}
};

/* ------------------------------------------------------------------ corporate travel: business trips and MICE */
const CORP = {
  intro:'Corporate travel is a different customer from a leisure traveller. The company pays, an employee travels, a travel manager or HR team sets the policy, a manager approves exceptions, and finance needs GST-compliant invoices and monthly reports. It comes in two forms: business trips (individual travel for work) and MICE (meetings, incentives, conferences and exhibitions: groups and events). It is not one of the seven channels in the plan, and it is different from the plan’s Corporate Communications channel, which speaks to investors, media and government. It is proposed here as a new line that draws on Supply (hotels, venues), Consumer (the traveller’s experience), Lifecycle (account renewal) and Internal (approvals and reporting).',
  people:[['Travel manager / admin','Sets the policy, owns the account, wants control and savings'],['Traveller (employee)','Wants an easy, comfortable trip and quick help'],['Approver (manager)','Wants to approve exceptions quickly and see why'],['Finance / accounts','Wants correct GST invoices, one monthly statement, spend reports'],['Event owner (MICE)','Wants a successful event on budget with no surprises'],['Vacario account manager','Owns the relationship, reviews and renewal'],['Vacario corporate desk','Books, changes and supports trips 24/7']],
  trip:[
    ['B1','Account setup','Company signs; travel policy, approvers, GST details and billing loaded','Account manager','Within 10 working days of signing'],
    ['B2','Request','Employee asks for a trip through the app, email or the corporate desk','Traveller','Any time'],
    ['B3','Policy check','Request checked against the policy (fare class, hotel cap, advance booking)','Corporate desk','Instant (automatic) or 1 hour'],
    ['B4','Approval','Only trips outside policy go to the approver, with the reason and a compliant alternative','Approver','Within 4 working hours'],
    ['B5','Booking','Flights, hotel and transfers booked; itinerary and GST details confirmed','Corporate desk','Within 2 hours of approval'],
    ['B6','Pre-trip','Itinerary, local contacts, duty-of-care information and travel advisories','Corporate desk','T-2 and T-1'],
    ['B7','In-trip support','24/7 help with delays, changes and problems; travel manager kept informed','Corporate desk','Reply within 15 minutes'],
    ['B8','Settlement','GST invoice per trip, monthly consolidated statement, expense data','Finance','Invoice within 2 working days of check-out'],
    ['B9','Reporting','Monthly spend, savings, policy compliance, traveller feedback','Account manager','By day 5 of each month'],
    ['B10','Review and renewal','Quarterly business review; rates and policy updated; annual renewal','Account manager','Quarterly; renewal 60 days early']
  ],
  mice:[
    ['M1','Enquiry','Company asks about a meeting, incentive trip, conference or exhibition','MICE sales','Reply within 1 working day'],
    ['M2','Brief','Objectives, dates, group size, city options, budget, format, special needs','MICE sales','Brief agreed within 3 working days'],
    ['M3','Feasibility','Can we deliver it well? Venues, rooms, flights and dates checked','MICE planner','2 working days'],
    ['M4','Proposal','Venues, rooms, travel, activities, food, branding and full costs','MICE planner','Within 5 working days of the brief'],
    ['M5','Site inspection','Optional visit to shortlisted venues with the client','MICE planner','Within 10 days of request'],
    ['M6','Contract and deposit','Contract, payment schedule, cancellation and attrition terms; deposit paid','MICE sales + finance','By the hold date'],
    ['M7','Planning','Rooming list, agenda, transport, food and drink, AV, branding, suppliers contracted','MICE planner','Weekly client call until the event'],
    ['M8','Attendee communications','Invitations, registration, itineraries, reminders, on-site information','CRM + MICE planner','From 6 weeks before'],
    ['M9','Event delivery','On-site desk, daily client check-in, live fixes','Event manager','During the event'],
    ['M10','Post-event','Reconciliation, final invoice, attendee survey, photos and report','Finance + MICE planner','Report within 10 working days'],
    ['M11','Rebook','Debrief, ideas for the next event, account plan updated','MICE sales','Within 30 days']
  ],
  tripFlow:{lanes:{tv:'Traveller', ds:'Corporate desk', ap:'Approver', fn:'Finance', am:'Account manager'},
    steps:[
      {l:'tv', t:'Request trip', d:'Dates, city and purpose through app, email or desk.', sla:'Any time', out:'Trip request'},
      {l:'ds', t:'Check policy', d:'Fare, hotel cap, advance booking checked.', sla:'Instant or 1 h', out:'In or out of policy', gate:'Within policy?', loop:'No → approver'},
      {l:'ap', t:'Approve exception', d:'Approver sees reason and a compliant alternative.', sla:'4 working hours', out:'Approved or changed'},
      {l:'ds', t:'Book', d:'Flights, hotel, transfers; itinerary with GST details.', sla:'2 h after approval', out:'Confirmed trip'},
      {l:'ds', t:'Support the trip', d:'Pre-trip info, 24/7 changes and help.', sla:'Reply in 15 min', out:'Trip completed'},
      {l:'fn', t:'Invoice and reconcile', d:'GST invoice per trip; monthly statement.', sla:'2 working days', out:'Correct invoice'},
      {l:'am', t:'Report and review', d:'Spend, savings, compliance; quarterly review; renewal.', sla:'Monthly / quarterly', out:'Renewed account'}
    ]},
  miceFlow:{lanes:{cl:'Client', sl:'MICE sales', pl:'MICE planner', sp:'Venues & suppliers', fn:'Finance'},
    steps:[
      {l:'cl', t:'Enquire', d:'Meeting, incentive, conference or exhibition.', sla:'—', out:'Enquiry'},
      {l:'sl', t:'Agree the brief', d:'Goals, dates, size, budget, city, format.', sla:'3 working days', out:'Brief', gate:'Workable?', loop:'No → re-brief or refer'},
      {l:'pl', t:'Propose', d:'Venues, rooms, travel, activities, full costs.', sla:'5 working days', out:'Proposal', gate:'Accepted?', loop:'No → revise twice'},
      {l:'fn', t:'Contract and deposit', d:'Payment schedule, attrition, cancellation.', sla:'By hold date', out:'Signed contract'},
      {l:'sp', t:'Contract suppliers', d:'Venue, hotels, transport, AV, food.', sla:'Per plan', out:'Suppliers booked'},
      {l:'pl', t:'Plan and invite', d:'Rooming list, agenda, attendee comms.', sla:'Weekly client call', out:'Event ready'},
      {l:'pl', t:'Deliver', d:'On-site desk, daily client check-in.', sla:'During event', out:'Event delivered'},
      {l:'fn', t:'Reconcile and report', d:'Final invoice, survey, photos, report.', sla:'10 working days', out:'Event report'},
      {l:'sl', t:'Rebook', d:'Debrief and next-event ideas.', sla:'30 days', out:'Next brief'}
    ]},
  kpi:[
    ['Business trips','Active corporate accounts','Accounts with at least one trip this month'],
    ['Business trips','Policy compliance','Trips within policy ÷ all trips × 100'],
    ['Business trips','Approval time','Median working hours from request to approval (exceptions only)'],
    ['Business trips','Savings vs benchmark','(Benchmark fare or rate − price paid) ÷ benchmark × 100'],
    ['Business trips','Invoice accuracy','Invoices correct first time ÷ invoices × 100'],
    ['Business trips','Account renewal rate','Accounts renewed ÷ accounts up for renewal × 100'],
    ['MICE','Enquiry-to-proposal time','Median working days from enquiry to proposal'],
    ['MICE','Proposal win rate','Proposals accepted ÷ proposals sent × 100'],
    ['MICE','Event margin','(Event revenue − event cost) ÷ event revenue × 100'],
    ['MICE','Attendee satisfaction','Satisfied attendees ÷ survey answers × 100'],
    ['MICE','Repeat clients','Clients booking a second event within 12 months ÷ clients × 100']
  ]
};

/* ------------------------------------------------------------------ mind maps: centre + branches with leaves */
const MINDMAPS = {
  lifecycle:{centre:'Customer lifecycle', sub:'from first glance to advocate', branches:[
    ['L1 Discover',['Saw Vacario once','“India-first travel”','KPI: reach, CPI']],
    ['L2 Explore',['Visited, no account','Member prices shown','KPI: sign-up rate']],
    ['L3 Join',['Account created','Welcome quiz, consent','KPI: 30-day conversion']],
    ['L4 First booking',['Paid first booking','Confirm in 1 minute','KPI: CAC, booking value']],
    ['L5 Prepare',['Booked, not yet arrived','T-7 and T-1 messages','KPI: add-on revenue']],
    ['L6 Experience',['Checked in','Help in 15 minutes','KPI: offer redemptions']],
    ['L7 Review & share',['0–30 days after trip','Review, photos, referral','KPI: review rate, NPS']],
    ['L8 Repeat',['2+ bookings in 12 months','Ideas from last trip','KPI: repeat rate']],
    ['L9 Advocate',['Referred a friend who booked','Rewards, early access','KPI: referral share']],
    ['At-risk → Lapsed',['60–90 days quiet','Win-back offer, then pause','KPI: win-back rate']]]},
  journey:{centre:'Customer journey', sub:'one trip, start to finish', branches:[
    ['Dream',['Reels and creators','Friends’ photos','Festival and long weekends']],
    ['Plan and compare',['Search and browse','All-in prices','Reviews and photos']],
    ['Book',['Member price','Secure payment','Confirmation in 1 minute']],
    ['Get ready',['T-7 directions and tips','T-1 check-in details','Things to do nearby']],
    ['Travel',['Arrival welcome','Support in 15 minutes','One offer a day at most']],
    ['Come home',['Review at C+1','Photos at C+7','Referral link']],
    ['Between trips',['Ideas at C+30','Points and member prices','At-risk check at C+60']]]},
  corporate:{centre:'Corporate travel', sub:'business trips and MICE', branches:[
    ['Who is involved',['Travel manager','Traveller and approver','Finance']],
    ['Business trip',['Request → policy check','Approve exceptions only','Book, support, invoice']],
    ['MICE event',['Enquiry → brief → proposal','Contract and deposit','Plan, deliver, report']],
    ['Rules',['Travel policy','GST invoices','Duty of care']],
    ['Yes / no moments',['Within policy?','Proposal accepted?','Deposit by hold date?']],
    ['Measures',['Policy compliance','Proposal win rate','Renewal and repeat']]]}
};

/* ------------------------------------------------------------------ benchmarks: how leading OTAs run these flows
   Public information checked in September 2026. Other companies' programmes change: confirm before quoting externally. */
const BENCH = [
  {area:'Discovery and planning', stage:'L1–L2', who:'MakeMyTrip',
   they:'Myra, MakeMyTrip’s AI assistant, takes a traveller from search to a paid booking in one conversation, by voice or text, in eight languages including Telugu and Hindi. MakeMyTrip reports over 45% of its use coming from tier-2 and smaller cities.',
   we:'Offer planning and booking help on WhatsApp and in-app in Telugu, Hindi and English from launch; brief regional-language creators so discovery happens in the traveller’s own language.'},
  {area:'Price transparency', stage:'L2–L4', who:'EaseMyTrip',
   they:'Built its brand on “zero convenience fee” flight bookings, which earned trust and repeat use.',
   we:'Show all-in prices from the first screen; no fee appears for the first time at checkout. Make it a Trust message in Consumer communications.'},
  {area:'Loyalty', stage:'L8–L9', who:'Booking.com · Expedia · MakeMyTrip',
   they:'Booking.com Genius has three levels earned by number of bookings (5 and 15 within two years) and keeps them for life. Expedia’s One Key pays OneKeyCash across Expedia, Hotels.com and Vrbo, with tiers based on trip elements rather than spend. MMTBLACK rewards MakeMyTrip’s highest-value customers (Gold and Platinum tiers, by trips and spend in 12 months) with upgrades and priority support.',
   we:'Keep tiers simple and based on trips, so occasional travellers can progress; points work like cash on the next booking; the top tier gets a priority help line. Tie tier moves to the Repeat and Advocate stages.'},
  {area:'Reviews', stage:'L7', who:'Booking.com · Airbnb',
   they:'Booking.com only accepts reviews from guests who booked through it and stayed or arrived. Airbnb uses double-blind reviews: host and guest each have 14 days after check-out, and neither sees the other’s review until both are in or the window closes.',
   we:'Verified-stay reviews only; for homestays, two-way reviews with a 14-day double-blind window; partners may reply publicly; negative reviews trigger service recovery (W4, W5).'},
  {area:'Service recovery', stage:'L6', who:'Airbnb',
   they:'AirCover for guests promises a comparable or better stay, or a refund, if the host cancels or the guest cannot check in and the host cannot fix it; issues are reported within 72 hours.',
   we:'A “Vacario Assurance” promise in the Trust pillar: a human reply in 15 minutes during a trip, a fix within 2 hours, otherwise a comparable stay or refund (W5).'},
  {area:'Supplier quality', stage:'Supply', who:'Airbnb',
   they:'Superhost status is reviewed every quarter on the last 12 months: at least a 4.8 rating, 10 stays (or 3 stays totalling 100 nights), 90% response rate and under 1% cancellations.',
   we:'A quarterly “Top Partner” badge with published criteria (proposed: 4.6+ rating, 98%+ availability accuracy, under 1% supplier cancellations, reply within 24 hours), rewarded with better placement.'},
  {area:'Partner self-service', stage:'Supply', who:'Booking.com · Expedia Group',
   they:'Both run partner portals where hotels manage rates, availability, reviews and payments, with help centres that explain every process.',
   we:'A partner portal plus a named account manager for every partner in the first year; the monthly statement is the key message of the Supply channel.'},
  {area:'Business trips', stage:'Corporate', who:'MakeMyTrip myBiz · Cleartrip · EaseMyTrip',
   they:'MakeMyTrip’s myBiz offers configurable approvals, policy-based options, assured GST invoices and expense integrations. Flipkart-owned Cleartrip entered corporate travel with its “Out of Office” product. EaseMyTrip has served businesses (B2E) since 2013.',
   we:'Business-trip flow: policy check first, approvals only for exceptions, GST invoice per trip and a monthly statement, 24/7 desk. Start with SMEs where speed and simplicity matter most.'},
  {area:'MICE', stage:'Corporate', who:'Yatra',
   they:'Yatra bought corporate-travel company Globe All India Services in 2024, adding about 360 corporate clients and strong MICE capability, calling MICE a fast-growing segment.',
   we:'Treat MICE as a planned line: start with small meetings and incentive trips delivered through Vacario’s supply partners, using the MICE lifecycle and its yes/no checkpoints.'}
];
const STAGE_BENCH = {
  discover:'MakeMyTrip’s Myra plans trips conversationally in eight Indian languages.',
  explore:'EaseMyTrip earned trust with no convenience fee on flights: show all-in prices early.',
  book:'Booking.com and Airbnb confirm instantly; confirmation is the first moment of trust.',
  intrip:'Airbnb AirCover: comparable stay or refund if check-in fails.',
  posttrip:'Booking.com verified-stay reviews; Airbnb’s 14-day double-blind reviews.',
  repeat:'Booking.com Genius and Expedia One Key reward trips, not just spend.',
  advocate:'MMTBLACK gives top customers priority support and upgrades.'
};
const WF_BENCH = {
  lead:'Corporate OTAs (myBiz, Cleartrip’s Out of Office) route business enquiries to dedicated teams; Vacario routes every lead to one owner.',
  campaign:'Large OTAs run sale events on a calendar; Vacario books every campaign into the Lifecycle calendar first.',
  referral:'Credits pay only after the friend’s first completed trip, the safeguard most travel referral schemes use against cancellation abuse.',
  reviews:'Booking.com accepts reviews only from verified guests; Airbnb reviews are double-blind for 14 days.',
  support:'Airbnb AirCover sets the expectation: rebook or refund when check-in fails.',
  consent:'Indian OTAs send booking messages on WhatsApp and SMS; marketing needs separate, recorded consent.',
  promo:'EaseMyTrip’s no-convenience-fee promise shows a simple, permanent value message can beat constant discounts.'
};
const SOURCES = [
  ['MakeMyTrip myBiz','https://mybiz.makemytrip.com/benefits'],
  ['MakeMyTrip Myra 2.0 (Hans India)','https://www.thehansindia.com/business/makemytrip-unveils-myra-20-end-to-end-conversational-travel-booking-assistant-1075926'],
  ['MMTBLACK programme','https://promos.makemytrip.com/mmtblack-program-faqs.html'],
  ['EaseMyTrip no convenience fee','https://www.easemytrip.com/offers/no-convenience-fee.html'],
  ['Skift on EaseMyTrip','https://skift.com/2023/01/23/how-indias-easemytrip-built-a-brand-waiving-booking-fees/'],
  ['Cleartrip “Out of Office” (Inc42)','https://inc42.com/buzz/flipkart-owned-cleartrip-enters-corporate-travel-space-with-out-of-office-launch/'],
  ['Yatra acquires Globe Travels (Yatra investors)','https://investors.yatra.com/press-releases/press-release-details/2024/Yatra-Doubles-Down-on-Corporate-Travel-with-the-Acquisition-of-Globe-Travels-Solidifying-its-Leadership-Position/default.aspx'],
  ['Booking.com Genius','https://www.booking.com/genius.html'],
  ['Booking.com guest review conditions','https://partner.booking.com/en-us/help/guest-reviews/general/guest-review-process-and-conditions'],
  ['Expedia One Key (CNBC)','https://www.cnbc.com/select/expedia-one-key-rewards/'],
  ['Airbnb Superhost requirements','https://www.airbnb.com/help/article/829'],
  ['Airbnb rebooking and refund policy','https://www.airbnb.com/help/article/2868'],
  ['Airbnb review policy (Hostfully)','https://www.hostfully.com/blog/airbnb-review-policy/']
];

/* ------------------------------------------------------------------ journey, in full: phase, feeling, touchpoints, opportunity, sample message */
const JOURNEY_PHASES = [
  ['Before the trip','discover explore join book','Win the traveller: inspiration, trust, a first booking'],
  ['Getting ready','pretrip','Prepare them well and add useful extras'],
  ['During the trip','intrip','Be useful, fix problems fast'],
  ['After the trip','posttrip repeat advocate','Turn one trip into the next, and into referrals']
];
const JOURNEY_MORE = {
  discover:{goal:'Find an idea worth a trip', feelWord:'Curious, a little unsure', touch:'Instagram Reels, YouTube, Google search, creator posts, friends’ WhatsApp shares, news', opp:'Show real stays with real prices in the traveller’s language', say:'“3 hill homestays under ₹6,000 a night, 4 hours from Hyderabad.”', kpi:'Reach · CPI'},
  explore:{goal:'Check if it suits my budget and group', feelWord:'Interested but comparing', touch:'App, website, stay pages, reviews, price filters, retargeting ads', opp:'All-in prices, honest photos, verified reviews on every stay', say:'“Prices shown include all taxes and fees.”', kpi:'Sign-up rate'},
  join:{goal:'Save options, get the best price', feelWord:'Hopeful, cautious about spam', touch:'Sign-up, welcome quiz, email, push, WhatsApp (opt-in)', opp:'Ask three questions, then send only what fits them', say:'“Tell us how you travel and we’ll only send trips that fit.”', kpi:'Opt-in rate · 30-day conversion'},
  book:{goal:'Pay and be sure it worked', feelWord:'Excited, slightly anxious', touch:'Checkout, payment, confirmation email and WhatsApp, trip wallet', opp:'Confirm within a minute with everything in one message', say:'“You’re booked! Itinerary, invoice and our help line are below.”', kpi:'Blended CAC · booking value'},
  pretrip:{goal:'Know how to get there and what to do', feelWord:'Excited, busy', touch:'T-7 and T-1 messages, directions, weather, experience offers', opp:'One message with everything; add experiences they’ll love', say:'“7 days to go: route, weather and 3 things locals love nearby.”', kpi:'Ancillary revenue per trip'},
  intrip:{goal:'Enjoy it; get help fast if needed', feelWord:'Happy, or stressed if something fails', touch:'WhatsApp support, in-app chat, host contact, nearby offers', opp:'Reply in 15 minutes, fix in 2 hours, one good offer a day', say:'“Anything you need? Reply here, a real person answers.”', kpi:'In-trip view rate · redemptions'},
  posttrip:{goal:'Share the memories, settle up', feelWord:'Satisfied, nostalgic', touch:'Review request, photo invite, referral link, NPS question', opp:'Thank them, fix anything unresolved, invite them to share', say:'“How was Coorg? Share a photo and give a friend ₹500 off.”', kpi:'Review rate · NPS · referral share'},
  repeat:{goal:'Plan the next break', feelWord:'Loyal if remembered', touch:'Trip ideas email, festival offers, points balance, member prices', opp:'Suggest trips based on the last one; make points count', say:'“You loved Coorg. Chikmagalur is quieter this Diwali.”', kpi:'12-month repeat rate · loyalty share'},
  advocate:{goal:'Help friends travel well', feelWord:'Proud, generous', touch:'Referral credits, early access, ambassador invites, creator programme', opp:'Recognise them publicly (with permission) and reward every referral', say:'“Your friends booked 3 trips. Here’s your reward and early access.”', kpi:'Referral share · NPS'}
};

/* ------------------------------------------------------------------ sales lifecycles */
const SALES = [
  {id:'property', n:'S1', name:'Property onboarding sales cycle',
    why:'Supply is a B2B sale. Every property Vacario lists goes through the same cycle: found, contacted, qualified, signed, onboarded, live, and then grown. Defining the stages lets the team forecast signings, spot where deals stall and shorten the time to a first booking.',
    stages:[
      ['Prospect','Property found in a priority destination where demand exceeds supply','Supply lead','Target list by day 5 of the month'],
      ['Contacted','First call, visit or message with the Vacario pitch','Business development','Within 5 working days'],
      ['Discovery','Understand rooms, rates, current OTAs, pain points, decision-maker','Business development','Within 10 days of contact'],
      ['Qualified','Meets quality, location and legal standards; decision-maker interested','Business development','Decision at discovery'],
      ['Proposal','Commission, payout schedule, marketing support, onboarding plan','Business development','Within 3 days of qualifying'],
      ['Negotiation','Terms agreed; rate parity and cancellation policy set','BD + finance','Within 10 days'],
      ['Signed','Contract signed; PAN, GST and bank details collected','Legal & finance','Within 5 days of agreement'],
      ['Onboarding','Photos, descriptions, amenities, rates, channel manager or API connected','Supply operations','Within 7 days of signing'],
      ['Live','QA and a test booking passed; listing switched on and announced to marketing','Supply operations','Within 2 days of onboarding'],
      ['Activated','First booking within 30 days of going live','Account manager','30 days'],
      ['Growing','Monthly statements, promotions, quarterly reviews, more rooms and properties','Account manager','Ongoing']
    ],
    decide:{title:'Property onboarding, decision by decision', items:[
      {t:'start', x:'Property found in a priority destination'},
      {t:'ask', x:'Meets our quality and location standard?', no:'Not pursued now; recorded for a future review', to:'Not a fit'},
      {t:'ask', x:'Owner interested after the first conversation?', no:'Nurture: case study and a follow-up in 90 days', to:'Nurture list'},
      {t:'ask', x:'Agrees commission, payout and parity terms?', no:'One revised proposal; if still no, close with the reason', to:'Lost (reason logged)'},
      {t:'ask', x:'Documents complete (PAN, GST, bank, ownership)?', no:'Onboarding paused; BD chases within 3 days', to:'Signed, waiting'},
      {t:'step', x:'Listing built: photos, rates, availability, channel manager'},
      {t:'ask', x:'Passes QA and a test booking?', no:'Back to onboarding with a fix list', to:'Onboarding'},
      {t:'step', x:'Live and announced to Consumer marketing'},
      {t:'ask', x:'First booking within 30 days?', no:'Check price, photos and demand; add to a promotion', to:'Live, not activated'},
      {t:'end', x:'Activated partner: monthly statements, quarterly growth reviews'}
    ]},
    flow:{lanes:{sl:'Supply lead', bd:'Business development', lf:'Legal & finance', so:'Supply operations', am:'Account manager'},
      steps:[
        {l:'sl', t:'Pick targets', d:'Destinations and property types where demand exceeds supply.', sla:'Monthly', out:'Target list'},
        {l:'bd', t:'Contact and discover', d:'Pitch, then learn rooms, rates, current OTAs and the decision-maker.', sla:'5–10 days', out:'Discovery notes', gate:'Qualified?', loop:'No → nurture list'},
        {l:'bd', t:'Propose and negotiate', d:'Commission, payouts, parity, marketing support.', sla:'3–10 days', out:'Agreed terms', gate:'Terms agreed?', loop:'No → revise once'},
        {l:'lf', t:'Contract and documents', d:'E-sign; PAN, GST, bank and ownership details.', sla:'5 days', out:'Signed supplier'},
        {l:'so', t:'Build the listing', d:'Content, rates, availability, channel manager or API.', sla:'7 days', out:'Listing ready'},
        {l:'so', t:'QA and go live', d:'Checks and a test booking, then switch on.', sla:'2 days', out:'Live listing', gate:'Passed QA?', loop:'No → fix list'},
        {l:'am', t:'Activate', d:'Watch for a first booking; boost if none.', sla:'30 days', out:'First booking'},
        {l:'am', t:'Grow', d:'Statements, promotions, quarterly reviews.', sla:'Monthly / quarterly', out:'More inventory'}
      ]},
    kpi:[['Sales cycle length','Median days from first contact to signed contract'],['Contact-to-qualified rate','Qualified ÷ contacted × 100'],['Win rate','Signed ÷ qualified leads closed × 100'],['Time to live','Median days from signing to live listing'],['Activation rate','Live listings with a booking within 30 days ÷ listings gone live × 100'],['Cost to acquire a supplier','Supply team and outreach cost ÷ suppliers signed']],
    bench:'Booking.com lets a property register, get reviewed and go live itself, then manage rates and availability in its partner extranet. Vacario pairs a similar self-serve portal with a named account manager, because personal help is how a new platform wins owners from established ones.'},
  {id:'agency', n:'S2', name:'Travel agency partner lifecycle',
    why:'Many Indian travellers, especially in tier-2 and tier-3 cities and for families, groups and pilgrimages, still book through a local travel agent. Recruiting agents to sell Vacario stays for a commission (a B2B2C channel) reaches them without Vacario paying for each customer up front. This lifecycle takes an agency from first contact to a productive, loyal partner.',
    stages:[
      ['Identify','Agencies found through travel-agent associations, trade fairs, referrals and search, prioritised by region and customer type','Agency partnerships','Monthly target list'],
      ['Outreach','Pitch: inventory, commission, easy booking portal, marketing support','Agency partnerships','Within 5 working days'],
      ['Qualify','Registered business with GST, active customer base, fits Vacario’s regions and segments','Agency partnerships','At first meeting'],
      ['Agreement','Commission tiers, payment terms (prepaid or credit limit), brand-use rules','Partnerships + finance','Within 10 days'],
      ['Onboard','Agent portal login, training session, marketing kit, first-booking incentive','Agency partnerships','Within 7 days of signing'],
      ['Activate','First booking through the portal','Agency account manager','Within 30 days'],
      ['Grow','Tiered commission, familiarisation (“fam”) trips, co-branded campaigns, featured deals','Agency account manager','Monthly'],
      ['Review','Quarterly performance review: bookings, cancellations, payments, feedback','Agency account manager','Quarterly'],
      ['Retain or exit','Renew and move up a tier, or exit agencies with poor payment or conduct records','Partnerships + finance','Annually']
    ],
    decide:{title:'A travel agency partner, decision by decision', items:[
      {t:'start', x:'Agency identified (association, fair, referral)'},
      {t:'ask', x:'Registered business with valid GST?', no:'Not onboarded; invite back once registered', to:'Not eligible'},
      {t:'ask', x:'Interested after the pitch?', no:'Nurture: newsletter and a fam-trip invite in 90 days', to:'Nurture list'},
      {t:'ask', x:'Agrees commission and payment terms?', no:'Offer prepaid terms instead of credit; else close with reason', to:'Lost'},
      {t:'step', x:'Portal access, training and marketing kit'},
      {t:'ask', x:'Completes training?', no:'Reminder and a short one-to-one session', to:'Onboarding'},
      {t:'ask', x:'First booking within 30 days?', no:'Account manager call; share best-selling stays for their customers', to:'Activation'},
      {t:'ask', x:'Pays on time and within the credit limit?', no:'Move to prepaid; repeat breaches → exit', to:'Prepaid / exit'},
      {t:'ask', x:'Hits the next tier’s booking level?', no:'Stay on the current tier; quarterly review plan', to:'Current tier'},
      {t:'end', x:'Higher tier: better commission, fam trips, featured deals'}
    ]},
    flow:{lanes:{ap:'Agency partnerships', ag:'Travel agent', fn:'Finance', pr:'Product (agent portal)', am:'Agency account manager'},
      steps:[
        {l:'ap', t:'Identify and pitch', d:'Associations, fairs, referrals; pitch inventory and commission.', sla:'5 working days', out:'Interested agency', gate:'GST and fit?', loop:'No → not eligible'},
        {l:'fn', t:'Agree terms', d:'Commission tiers, prepaid or credit limit, brand rules.', sla:'10 days', out:'Signed agreement'},
        {l:'pr', t:'Give portal access', d:'Login, agent rates, booking and commission view.', sla:'2 days', out:'Portal access'},
        {l:'ap', t:'Train and equip', d:'Training session, marketing kit, first-booking incentive.', sla:'7 days', out:'Trained agent'},
        {l:'ag', t:'Sell and book', d:'Agent books stays for customers through the portal.', sla:'Ongoing', out:'Agent bookings', gate:'Booked in 30 days?', loop:'No → activation call'},
        {l:'fn', t:'Settle', d:'Collect payments, pay commission monthly, watch credit limits.', sla:'Monthly', out:'Clean account'},
        {l:'am', t:'Review and grow', d:'Quarterly review, tier moves, fam trips, co-branded campaigns.', sla:'Quarterly', out:'Growing partner'}
      ]},
    kpi:[['Active agents','Agents with at least one booking in the last 90 days'],['Agent activation rate','Agents booking within 30 days ÷ agents onboarded × 100'],['Agent booking share','Bookings through agents ÷ all bookings × 100'],['Bookings per active agent','Agent bookings ÷ active agents (monthly)'],['Commission cost per booking','Commission paid to agents ÷ agent bookings'],['Days sales outstanding','Average days agents take to pay']],
    bench:'Expedia’s Travel Agent Affiliate Program (TAAP) gives travel agencies their own booking platform with agent rates and tiered commission paid monthly, and serves tens of thousands of agencies. Vacario’s agent portal follows the same model, starting with regional agencies in its priority states.'},
  {id:'enquiry', n:'S3', name:'Enquiry-to-booking sales cycle',
    why:'Campaigns, creators, WhatsApp and the website generate enquiries from travellers who want help: a family trip, a honeymoon, a group, a package. These are warm leads; the difference between a fast, personal answer and a slow one is usually the booking. Workflow W1 captures and routes every lead; this cycle is what the travel desk does next.',
    stages:[
      ['Enquiry','Traveller asks through a form, WhatsApp, call, chat or social message','Traveller','Any time'],
      ['Acknowledged','Automatic reply confirming receipt and when a person will call','Marketing operations','Within 1 minute'],
      ['Qualified','Dates, group size, budget, destination and occasion captured','Travel desk','First conversation'],
      ['Consultation','A travel expert calls or chats to understand what would make the trip great','Travel desk','Within 15 minutes in working hours'],
      ['Quote','Itinerary with 2–3 options and an all-in price, valid for 48 hours','Travel desk','Within 2 hours'],
      ['Follow-up','Answer questions, adjust options, remind before the quote expires','Travel desk','At 24 and 44 hours'],
      ['Decision','Traveller accepts, asks for changes, or declines','Traveller','Within 48 hours'],
      ['Booked','Payment link paid; confirmation sent; handed to the customer lifecycle (Prepare)','Travel desk + finance','Instant after payment'],
      ['Closed or nurtured','Lost enquiries closed with a reason; open ones nurtured by CRM','CRM','Same day']
    ],
    decide:{title:'An enquiry, decision by decision', items:[
      {t:'start', x:'Traveller sends an enquiry (form, WhatsApp, call, chat)'},
      {t:'step', x:'Automatic acknowledgement within 1 minute'},
      {t:'ask', x:'Dates, group size and budget known?', no:'Travel desk asks in the first conversation; no reply in 24 h → CRM nurture', to:'Nurture'},
      {t:'ask', x:'Can we serve it well (destination, dates, budget)?', no:'Suggest the closest alternative; if none, say so honestly and stay in touch', to:'Alternative or closed'},
      {t:'step', x:'Consultation, then a quote with 2–3 options within 2 hours'},
      {t:'ask', x:'Accepted within 48 hours?', no:'Ask what would change their mind; one revised quote', to:'Revise once'},
      {t:'ask', x:'Revised quote accepted?', no:'Close with the reason (price, dates, went elsewhere); CRM nurture', to:'Lost (reason logged)'},
      {t:'ask', x:'Payment completed?', no:'Payment help within 30 minutes; hold the price for 24 hours', to:'Payment help'},
      {t:'end', x:'Booked: confirmation sent, customer enters the Prepare stage (L5)'}
    ]},
    flow:{lanes:{tv:'Traveller', mo:'Marketing operations', td:'Travel desk', fn:'Finance & payments', crm:'CRM'},
      steps:[
        {l:'tv', t:'Send enquiry', d:'Form, WhatsApp, call, chat or social message.', sla:'Any time', out:'Enquiry'},
        {l:'mo', t:'Acknowledge and route', d:'Auto-reply; lead record; routed by W1.', sla:'1 minute', out:'Routed lead'},
        {l:'td', t:'Consult', d:'Call or chat; capture dates, group, budget, occasion.', sla:'15 minutes', out:'Qualified enquiry', gate:'Can we serve it?', loop:'No → alternative or close'},
        {l:'td', t:'Quote', d:'2–3 options, all-in prices, valid 48 hours.', sla:'2 hours', out:'Quote sent'},
        {l:'td', t:'Follow up', d:'Answer questions, adjust, remind before expiry.', sla:'24 h and 44 h', out:'Decision', gate:'Accepted?', loop:'No → revise once, then close'},
        {l:'fn', t:'Take payment', d:'Payment link; help if it fails.', sla:'Instant', out:'Paid booking'},
        {l:'crm', t:'Hand over or nurture', d:'Booked → Prepare stage; lost → reason and nurture.', sla:'Same day', out:'Next step set'}
      ]},
    kpi:[['Enquiries by source','Count of enquiries per source (ads, creators, WhatsApp, web, referrals)'],['Response time','Median minutes from enquiry to first human reply'],['Enquiry-to-quote rate','Quotes sent ÷ enquiries × 100'],['Quote-to-booking rate','Bookings ÷ quotes sent × 100'],['Time to quote','Median hours from enquiry to quote'],['Cost per enquiry','Spend on enquiry-generating campaigns ÷ enquiries']],
    bench:'Indian OTAs’ corporate and holiday products route enquiries to dedicated teams and use conversational assistants (MakeMyTrip’s Myra) to move from question to payment in one conversation. Vacario’s enquiry cycle uses a person for the consultation and quote, with WhatsApp as the main thread.'}
];
const SALES_MM = {centre:'Sales lifecycles', sub:'properties, agencies, enquiries', branches:[
  ['S1 Properties',['Prospect → qualify → sign','Onboard → QA → live','Activate in 30 days']],
  ['S2 Travel agencies',['Identify → qualify (GST)','Terms → portal → training','Tiers, fam trips, reviews']],
  ['S3 Enquiries',['Acknowledge in 1 minute','Consult in 15 min, quote in 2 h','48-hour quote, then book']],
  ['Shared rules',['One owner per lead (W1)','Every loss has a reason','Handover to lifecycle']],
  ['Measures',['Win rate, cycle length','Activation rates','Quote-to-booking rate']]]};
SOURCES.push(['Expedia TAAP','https://partner.expediagroup.com/en-us/join-us/taap'], ['Booking.com: registering your property','https://partner.booking.com/en-us/help/working-booking/going-live/registering-your-property']);
