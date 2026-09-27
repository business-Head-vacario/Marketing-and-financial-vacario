/* Shared content for the Vacario communication workflows.
   Single source of truth for workflows-print.html (the PDF) and src/kpi-workspace.html.
   CH: the seven channels (steps, lanes, KPI list); EXPL: plain-language explanations;
   KX: what each KPI tells you, its formula and a worked example; GLOSS: glossary. */
/* ------------------------------------------------------------------ data */
const CH = [
{
  id:'consumer', n:'01', name:'Consumer Communications',
  sub:'Paid advertising, earned media, creator content, social channels, CRM/email, WhatsApp/SMS, push notifications, referral programmes and loyalty communications.',
  who:['Travellers','Prospects','Past guests'],
  chain:['Vacario','Traveler','App engagement','Booking','Trip','Review / content','Repeat booking'],
  lanes:{perf:'Performance marketing', crm:'CRM & lifecycle', cx:'Product & customer service', soc:'Community & social'},
  steps:[
    {l:'perf', t:'Attract', out:'App install or sign-up', tr:'Monthly media plan', sla:'Always on; pacing checked daily',
      acts:['Set monthly spend by channel from the budget model','Run search, Meta, YouTube and app-install campaigns by destination','Point PR and creator content to tagged landing pages (UTM)'], tp:'Google, Meta, YouTube, PR, creator posts'},
    {l:'crm', t:'Welcome & profile', out:'Opted-in, profiled user', tr:'Sign-up', sla:'First message within 5 min',
      acts:['Day 0 welcome email and push','Preference quiz: destinations, budget, travel group, language','Ask WhatsApp and push consent; day 3 first-booking offer'], tp:'Email, push, WhatsApp, in-app'},
    {l:'crm', t:'Engage & nudge', out:'Return visit, booking', tr:'Search or cart with no booking in 24 h', sla:'Nudge at 24 h, 72 h, 7 days', gate:'Booked?', loop:'No → keep nudging, max 3',
      acts:['Personal deals and destination content from profile','Abandoned search and cart reminders','Price-drop and festival alerts'], tp:'Push, WhatsApp, email, in-app feed'},
    {l:'cx', t:'Book & confirm', out:'Confirmed booking', tr:'Payment success', sla:'Confirmation within 1 min',
      acts:['One message with itinerary, GST invoice and support contact','Add trip to in-app wallet','Flag high-value bookings for a welcome call'], tp:'Email, WhatsApp, in-app'},
    {l:'crm', t:'Prepare the trip', out:'Add-ons booked, fewer calls', tr:'7 days and 1 day before arrival', sla:'T-7 and T-1',
      acts:['Check-in details, directions, weather','Offer experiences from Destination & Merchant','Packing and local tips content'], tp:'Push, WhatsApp, email'},
    {l:'cx', t:'Support during trip', out:'Issues solved on the trip', tr:'Check-in date', sla:'Reply within 15 min, 24/7',
      acts:['Live WhatsApp and in-app chat','Hand in-trip offers to Destination & Merchant','Log every issue for supplier follow-up'], tp:'WhatsApp, in-app chat, phone'},
    {l:'soc', t:'Review & share', out:'Reviews, UGC, referrals', tr:'1 day after checkout', sla:'Reply to reviews within 48 h',
      acts:['Rating and review request','Invite photos and short video for the in-app feed','Send referral link with credit for both sides'], tp:'Push, email, in-app, social'},
    {l:'crm', t:'Book again', out:'Repeat booking', tr:'Review received or 30 days after trip', sla:'Hand to Lifecycle at T+30',
      acts:['Credit loyalty points','Next-trip ideas from past trip','Festival and long-weekend offers'], tp:'Email, push, WhatsApp'}
  ],
  flow:[['Reach','impressions, visits'],['Install','app installs'],['Sign-up','accounts'],['First booking','new customers'],['Trip','completed stays'],['Review','reviews + UGC'],['Repeat','2nd booking']],
  conv:['CPI','Sign-up rate','30-day conversion','Completion rate','Review rate','Repeat rate'],
  obj:['Grow app users and first bookings at a falling cost per booking','Turn every trip into a review and a piece of content','Make repeat and referral bookings a growing share of the total'],
  kpi:[
    ['Cost per install (CPI)','Paid spend ÷ installs from paid','Ad platforms, attribution tool','Weekly','Performance marketing','down','Leading'],
    ['Sign-up rate','Sign-ups ÷ installs','App analytics','Weekly','Product','up','Leading'],
    ['Opt-in rate','Users opted into WhatsApp or push ÷ sign-ups','CRM platform','Weekly','CRM','up','Leading'],
    ['30-day booking conversion','First bookings within 30 days ÷ sign-ups','Booking system','Monthly','CRM','up','Leading'],
    ['Blended CAC','Total marketing spend ÷ new booking customers','Finance + booking system','Monthly','Marketing lead','down','Lagging'],
    ['Average booking value','Gross booking value ÷ bookings','Booking system','Monthly','Marketing lead','up','Lagging'],
    ['Review rate','Reviews ÷ completed trips','App, review platform','Monthly','Community & social','up','Leading'],
    ['Referral share','Referral bookings ÷ all bookings','Referral tracking','Monthly','CRM','up','Lagging'],
    ['12-month repeat rate','Customers with 2+ bookings in 12 months ÷ customers','Booking system','Quarterly','CRM','up','Lagging']
  ],
  cad:['Daily: paid campaign pacing','Weekly: CRM send plan and results','Monthly: channel mix vs. budget model'],
  in:[['Creator','content for ads, feed and CRM'],['Supply','new inventory and destinations to promote']],
  hand:[['Destination & Merchant','in-trip offers during the stay'],['Lifecycle','guests after the trip for loyalty and win-back']]
},
{
  id:'supply', n:'02', name:'Supply Communications',
  sub:'A B2B acquisition and relationship-management channel. Its messaging differs from consumer advertising: commission, reach, payout reliability and ease of listing.',
  who:['Property owners','Property managers','Hotels','Travel suppliers'],
  chain:['Vacario','Owners + managers + hotels + suppliers','Inventory','Availability / pricing','Booking'],
  lanes:{lead:'Supply lead', bd:'Business development', fin:'Finance & legal', ops:'Supply operations', am:'Account management'},
  steps:[
    {l:'lead', t:'Target the gaps', out:'Prioritised target list', tr:'Monthly demand review', sla:'List ready by day 5 of month',
      acts:['Compare search demand with live inventory by destination','Rank property types and price bands with gaps','Set monthly signing targets per destination'], tp:'Search data, market research'},
    {l:'bd', t:'Reach out', out:'Qualified lead', tr:'Target list approved', sla:'First contact within 5 working days', gate:'Qualified?', loop:'No → nurture list, retry in 90 days',
      acts:['Pitch: new Indian demand, commission, payout speed, marketing support','Calls, email, LinkedIn, hotel associations, trade fairs','Qualify on quality, location, API or channel manager'], tp:'Phone, email, LinkedIn, events'},
    {l:'fin', t:'Agree terms & contract', out:'Signed supplier', tr:'Partner agrees in principle', sla:'Contract in 10 working days',
      acts:['Commission, cancellation policy, rate parity','Collect registration, PAN and GST documents','E-sign agreement, set payout details'], tp:'Proposal, e-signature'},
    {l:'ops', t:'Onboard the listing', out:'Listing ready for QA', tr:'Contract signed', sla:'Listing built in 7 days',
      acts:['Photos, descriptions, amenities','Connect channel manager or API','Load rates, availability and policies'], tp:'Onboarding call, partner portal, API'},
    {l:'ops', t:'QA & go live', out:'Live, bookable inventory', tr:'Listing complete', sla:'QA within 2 days', gate:'Passed QA?', loop:'No → back to onboarding',
      acts:['Check content, prices and policies','Make a test booking end to end','Switch on and announce to marketing'], tp:'QA checklist'},
    {l:'ops', t:'Keep it accurate', out:'Accurate availability and price', tr:'Daily sync report', sla:'Sync errors fixed same day',
      acts:['Monitor sync errors and stale calendars','Check rate parity against other sites','Invite partners into seasonal promotions'], tp:'Partner portal, email, WhatsApp'},
    {l:'am', t:'Report & grow', out:'More inventory from partners', tr:'Month end, quarter end', sla:'Statement by day 5; QBR each quarter',
      acts:['Monthly performance statement per partner','Quarterly review with top partners','Ask for more rooms, dates and properties'], tp:'Statement, review meeting'}
  ],
  flow:[['Target','gap list'],['Contacted','first touch'],['Qualified','fit confirmed'],['Signed','contract'],['Live','bookable'],['Booked','1+ booking in 30 d'],['Expanded','more inventory']],
  conv:['Contact rate','Qualification rate','Win rate','Time to live','Activation rate','Expansion rate'],
  obj:['Build bookable inventory in the priority destinations','Shorten the time from first contact to live listing','Keep availability and pricing accurate so bookings do not fail'],
  kpi:[
    ['Pipeline coverage','Qualified leads ÷ monthly signing target','CRM pipeline','Weekly','Business development','up','Leading'],
    ['Win rate','Signed suppliers ÷ qualified leads','CRM pipeline','Monthly','Business development','up','Leading'],
    ['Time to live','Days from contract signed to listing live (median)','Onboarding tracker','Weekly','Supply operations','down','Leading'],
    ['Live listings by destination','Bookable listings in each priority destination','Inventory system','Weekly','Supply lead','up','Lagging'],
    ['Availability accuracy','1 − (bookings failed for availability or price ÷ bookings)','Booking system','Daily','Supply operations','up','Leading'],
    ['Supplier cancellation rate','Bookings cancelled by supplier ÷ bookings','Booking system','Monthly','Account management','down','Lagging'],
    ['Rate parity','Listings at parity with other sites ÷ listings checked','Parity check','Weekly','Supply operations','up','Leading'],
    ['Bookings per live listing','Bookings ÷ live listings (monthly)','Booking system','Monthly','Supply lead','up','Lagging'],
    ['Supplier satisfaction','Average score from quarterly partner survey','Survey','Quarterly','Account management','up','Lagging']
  ],
  cad:['Daily: sync and parity exceptions','Weekly: pipeline review','Monthly: partner statements','Quarterly: top-partner reviews'],
  in:[['Consumer','search demand and destination interest'],['Destination & Merchant','local introductions']],
  hand:[['Consumer','new inventory for campaigns'],['Internal','contract and inventory status in supply updates'],['Lifecycle','suppliers after go-live']]
},
{
  id:'creator', n:'03', name:'Creator Communications',
  sub:'The creator is not only an advertising medium. Creators become part of the Vacario distribution system, with their own links, content and bookings.',
  who:['Influencers','Creators','Campus ambassadors'],
  chain:['Vacario','Influencers / creators','Content','Followers','Vacario','Booking'],
  lanes:{cp:'Creator partnerships', ct:'Content lead', sp:'Social & performance', fin:'Finance'},
  steps:[
    {l:'cp', t:'Scout', out:'Shortlist by tier', tr:'Quarterly creator plan', sla:'Shortlist in first 2 weeks of quarter',
      acts:['Search by travel niche, region and language (Telugu, Hindi, Tamil, English)','Check audience location and real engagement','Tier: nano, micro, macro'], tp:'Instagram, YouTube, creator tools'},
    {l:'cp', t:'Recruit', out:'Signed creator', tr:'Shortlist approved', sla:'Reply to interest within 48 h', gate:'Signed?', loop:'No → keep on watch list',
      acts:['Invite to the creator programme','Offer: commission per booking, hosted trip or fixed fee','Agree usage rights for paid ads'], tp:'DM, email, call'},
    {l:'cp', t:'Onboard', out:'Creator ready to post', tr:'Agreement signed', sla:'Kit sent within 2 days',
      acts:['Brand guidelines and tone','Unique tracking link and discount code','ASCI disclosure rules for paid and gifted posts'], tp:'Creator kit, onboarding call'},
    {l:'ct', t:'Brief the story', out:'Approved brief', tr:'Campaign or destination launch', sla:'Brief 3 weeks before travel',
      acts:['Destination, property, dates, deliverables','Content calendar and key messages','Book the hosted stay through Supply'], tp:'Brief, WhatsApp group'},
    {l:'ct', t:'Review content', out:'Approved content', tr:'Draft received', sla:'Approve within 48 h', gate:'Approved?', loop:'No → one round of edits',
      acts:['Check brand fit, facts and prices','Check disclosure label is present','Confirm link and code are correct'], tp:'Shared folder, review form'},
    {l:'sp', t:'Publish & amplify', out:'Reach and clicks', tr:'Content approved', sla:'Reshare same day',
      acts:['Creator posts on agreed date','Reshare and add to in-app feed','Boost best posts as paid ads'], tp:'Instagram, YouTube, app feed, paid'},
    {l:'fin', t:'Track & pay', out:'Paid, attributed bookings', tr:'Month end', sla:'Pay by day 10 of next month',
      acts:['Attribute bookings to link and code','Monthly statement to each creator','Pay commission and fees'], tp:'Dashboard, statement'},
    {l:'cp', t:'Grow the best', out:'Always-on creator network', tr:'Quarterly review', sla:'Tier review each quarter',
      acts:['Move top performers to ambassador deals','Invite to launches and new destinations','Drop inactive creators'], tp:'Ambassador agreement'}
  ],
  flow:[['Scouted','shortlist'],['Contacted','invites'],['Signed','agreements'],['Posting','live content'],['Converting','1+ booking'],['Ambassador','long-term']],
  conv:['Response rate','Sign rate','Activation rate','Conversion rate','Promotion rate'],
  obj:['Build a creator network that drives bookings, not only reach','Keep content supply steady for the app feed and paid ads','Pay creators on results they can see'],
  kpi:[
    ['Active creators by tier','Creators with a post in the last 30 days, by tier','Creator tracker','Monthly','Creator partnerships','up','Leading'],
    ['On-time delivery','Content delivered by agreed date ÷ content due','Content calendar','Monthly','Content lead','up','Leading'],
    ['Approval turnaround','Hours from draft received to approved (median)','Review form','Weekly','Content lead','down','Leading'],
    ['Engagement rate','(Likes + comments + saves + shares) ÷ reach','Platform insights','Per post','Social','up','Leading'],
    ['Link clicks','Clicks on creator tracking links','Link tracking','Weekly','Social','up','Leading'],
    ['Attributed bookings','Bookings through creator link or code','Booking system','Monthly','Creator partnerships','up','Lagging'],
    ['Cost per attributed booking','Creator cost (fees + commission + trips) ÷ attributed bookings','Finance + booking system','Monthly','Creator partnerships','down','Lagging'],
    ['Disclosure compliance','Posts with correct paid label ÷ paid posts (target 100%)','Content review','Monthly','Content lead','hold','Leading'],
    ['Creator retention','Creators active this quarter who were active last quarter','Creator tracker','Quarterly','Creator partnerships','up','Lagging']
  ],
  cad:['Weekly: content calendar and approvals','Monthly: attribution and payouts','Quarterly: tier review and scouting'],
  in:[['Supply','hosted stays'],['Consumer','campaign themes and destinations']],
  hand:[['Consumer','content for ads, CRM and app feed'],['Lifecycle','creator onboarding and renewal track']]
},
{
  id:'destination', n:'04', name:'Destination & Merchant Communications',
  sub:'Lets Vacario talk to the traveller through the whole trip, instead of disappearing once the stay or flight is booked.',
  who:['Tourism boards','Attractions','Restaurants','Experiences','Local merchants'],
  chain:['Vacario','Tourism boards + attractions + restaurants + experiences + merchants','Offers / content','Traveler'],
  lanes:{dp:'Destination partnerships', ct:'Content', crm:'CRM', pr:'Product', fin:'Finance'},
  steps:[
    {l:'dp', t:'Map the destination', out:'Destination partner map', tr:'Destination added to plan', sla:'Map in 2 weeks',
      acts:['Tourism board and state tourism department','Top attractions, restaurants, experience operators','Merchants useful to visitors'], tp:'Research, supplier referrals'},
    {l:'dp', t:'Approach partners', out:'Interested partners', tr:'Map ready', sla:'All tier-1 partners contacted in 30 days',
      acts:['Tourism boards: co-marketing and traveller insight','Merchants: reach visitors already in town','Local visits in priority cities'], tp:'Meetings, email, visits'},
    {l:'dp', t:'Agree the offer', out:'Signed offer', tr:'Partner agrees', sla:'Offer signed in 10 days', gate:'Terms agreed?', loop:'No → revise offer',
      acts:['Offer, validity dates, limits','Redemption by code or QR','Commission, sponsorship or co-funding'], tp:'Offer form, agreement'},
    {l:'ct', t:'Build the content', out:'Offers live in app', tr:'Offer signed', sla:'Live in 5 days',
      acts:['Destination guide and itineraries','Offer cards tagged by place and season','Photos from partner and creators'], tp:'App CMS'},
    {l:'crm', t:'Deliver pre-trip & in-trip', out:'Offer views and saves', tr:'Booking, check-in, arrival', sla:'Pre-trip at T-3; in-trip daily max 1',
      acts:['Suggest offers in pre-trip message','Timely offer while in destination','Concierge answers on WhatsApp'], tp:'Push, WhatsApp, in-app'},
    {l:'pr', t:'Redeem & record', out:'Logged redemptions', tr:'Code or QR scanned', sla:'Real time',
      acts:['Record each redemption','Same number visible to merchant and Vacario','Flag failed redemptions to support'], tp:'Redemption tool'},
    {l:'fin', t:'Settle & report', out:'Paid partners, renewal case', tr:'Month end, campaign end', sla:'Settle by day 10',
      acts:['Monthly commission settlement','Campaign report for tourism boards','Merchant performance summary'], tp:'Statement, report'},
    {l:'dp', t:'Refresh by season', out:'Current offers every season', tr:'Season calendar', sla:'6 weeks before each season',
      acts:['Festive season (Oct–Nov), winter holidays, summer, monsoon getaways','Renew best offers, drop weak ones','Pitch seasonal sponsorships'], tp:'Partner calls'}
  ],
  flow:[['Mapped','partners listed'],['Approached','meetings'],['Offer signed','agreements'],['Live','in the app'],['Seen','by travellers'],['Redeemed','used offers'],['Renewed','next season']],
  conv:['Meeting rate','Sign rate','Time to live','View rate','Redemption rate','Renewal rate'],
  obj:['Stay in contact with the traveller through the whole trip','Add revenue per trip from experiences and local offers','Win tourism board co-marketing and sponsorship'],
  kpi:[
    ['Destination coverage','Priority destinations with 5+ live partners ÷ priority destinations','Partner tracker','Monthly','Destination partnerships','up','Leading'],
    ['Active offers','Live offers per destination','App CMS','Weekly','Content','up','Leading'],
    ['In-trip view rate','Travellers who viewed an offer ÷ travellers in destination','App analytics','Weekly','CRM','up','Leading'],
    ['Redemption rate','Redemptions ÷ travellers in destination','Redemption tool','Monthly','Destination partnerships','up','Lagging'],
    ['Ancillary revenue per trip','Commission + experience revenue ÷ completed trips','Finance','Monthly','Destination partnerships','up','Lagging'],
    ['Settlement on time','Partners paid by day 10 ÷ partners due','Finance','Monthly','Finance','up','Leading'],
    ['Sponsorship revenue','Tourism board and sponsor revenue','Finance','Quarterly','Destination partnerships','up','Lagging'],
    ['Partner renewal rate','Partners renewing next season ÷ partners up for renewal','Partner tracker','Seasonal','Destination partnerships','up','Lagging']
  ],
  cad:['Weekly: offer performance','Monthly: settlement and partner reports','Seasonal: offer refresh'],
  in:[['Consumer','bookings and trip dates'],['Supply','local introductions from hotels']],
  hand:[['Consumer','offers inside pre-trip and in-trip messages'],['Corporate','tourism board partnerships for announcements'],['Lifecycle','merchant and sponsor renewals']]
},
{
  id:'corporate', n:'05', name:'Corporate Communications',
  sub:'The message changes from “book your next trip” to the corporate story: what Vacario is building, growth, technology, partnerships, milestones and market expansion.',
  who:['Investors','Media','Governments','Strategic partners','Employees'],
  chain:['Vacario','Investors + media + governments + strategic partners + employees'],
  lanes:{ceo:'CEO & leadership', cm:'Communications', fl:'Finance & legal'},
  steps:[
    {l:'ceo', t:'Set the story', out:'Approved message house', tr:'Start of each half-year', sla:'Reviewed every 6 months',
      acts:['What Vacario is building and why India first','Technology, growth, partnerships','Three proof points per message'], tp:'Message house'},
    {l:'cm', t:'Plan milestones', out:'Announcement calendar', tr:'Monthly business review', sla:'Updated monthly',
      acts:['Launches, city expansion, partnerships','Funding, awards, hires','Earliest date each can be announced'], tp:'Milestone calendar'},
    {l:'cm', t:'Prepare materials', out:'Draft pack', tr:'Milestone confirmed', sla:'Pack ready 10 days before',
      acts:['Press release and fact sheet','Investor note and partner brief','Internal note and Q&A'], tp:'Templates in knowledge base'},
    {l:'fl', t:'Check & approve', out:'Approved pack', tr:'Draft pack ready', sla:'Sign-off in 3 working days', gate:'Approved?', loop:'No → revise pack',
      acts:['Finance checks every number','Legal checks claims and partner names','CEO final sign-off'], tp:'Approval workflow'},
    {l:'ceo', t:'Tell employees first', out:'Team briefed', tr:'Pack approved', sla:'At least 2 h before release',
      acts:['Brief Canada, India and Philippines teams','Share the Q&A','Remind: only the spokesperson speaks to media'], tp:'All-hands, internal channel'},
    {l:'cm', t:'Release by audience', out:'Announcement out', tr:'Release date', sla:'Same day, all audiences',
      acts:['Investors: update email','Media: release, interviews','Government and tourism departments: letter or meeting','Partners: direct brief'], tp:'Email, newswire, meetings, LinkedIn'},
    {l:'cm', t:'Answer questions', out:'Consistent answers', tr:'Inbound enquiry', sla:'Media reply within 4 h',
      acts:['One named spokesperson','Use the prepared Q&A','Log every enquiry'], tp:'Q&A document'},
    {l:'cm', t:'Measure & file', out:'Lessons for next time', tr:'1 week after release', sla:'Report in 7 days',
      acts:['Coverage and message pull-through','Investor and partner responses','File the pack in the knowledge base'], tp:'Coverage log, dashboard'}
  ],
  flow:[['Milestone','confirmed'],['Pack','drafted'],['Approved','signed off'],['Employees','briefed'],['Released','all audiences'],['Coverage','earned'],['Follow-up','meetings, MoUs']],
  conv:['On-time pack','Approval time','Briefed first','Pickup rate','Follow-up rate'],
  obj:['Build trust with investors, media, government and partners','Announce every milestone with one consistent story','Make sure employees always hear news first'],
  kpi:[
    ['Milestones on schedule','Announcements made on planned date ÷ planned','Milestone calendar','Monthly','Communications','up','Leading'],
    ['Media mentions','Articles, broadcasts and posts naming Vacario','Coverage log','Monthly','Communications','up','Lagging'],
    ['Tier-1 coverage share','Mentions in national business and travel media ÷ mentions','Coverage log','Monthly','Communications','up','Lagging'],
    ['Message pull-through','Coverage carrying at least one key message ÷ coverage','Coverage review','Per release','Communications','up','Lagging'],
    ['Investor update on time','Updates sent by agreed date ÷ due','Investor log','Monthly','CEO','hold','Leading'],
    ['Investor meetings','Meetings or calls from updates and releases','Investor log','Quarterly','CEO','up','Lagging'],
    ['Government and tourism MoUs','MoUs or formal partnerships signed','Partnership log','Quarterly','CEO','up','Lagging'],
    ['Employees briefed first','Releases with staff briefing before release (target 100%)','Internal log','Per release','CEO','hold','Leading']
  ],
  cad:['Monthly: investor update','Per milestone: release pack','Quarterly: story and message review'],
  in:[['Destination & Merchant','tourism board partnerships'],['Supply','large hotel partnerships'],['Internal','milestones and numbers']],
  hand:[['Internal','staff briefing before release'],['Consumer','earned media for campaigns']]
},
{
  id:'lifecycle', n:'06', name:'Lifecycle Communications',
  sub:'Directly tied to guest and partner retention. Communication should not stop once someone joins, spends, sells or sponsors. This is where Vacario should shine.',
  who:['Guests','Suppliers','Creators','Merchants & sponsors'],
  chain:['Join','Activate','Engage','Reward','Retain or win back'],
  lanes:{crm:'CRM (guests)', am:'Account managers (partners)', cs:'Customer service & insight'},
  steps:[
    {l:'crm', t:'Welcome', out:'First action started', tr:'Sign-up or contract signed', sla:'Same day',
      acts:['One welcome track per audience','One clear next action','Set contact preferences'], tp:'Email, WhatsApp, in-app'},
    {l:'am', t:'Activate', out:'Activated member or partner', tr:'Days 1–14 with no first result', sla:'Reminder day 3, call day 10', gate:'Activated?', loop:'No → personal call',
      acts:['Guest: first booking','Supplier: listing live; creator: first post','Merchant: first redemption'], tp:'Reminders, onboarding call'},
    {l:'am', t:'Give value monthly', out:'Ongoing engagement', tr:'Monthly', sla:'By day 5 of month',
      acts:['Guests: trip ideas and member prices','Partners: performance statement','Creators: earnings and new briefs'], tp:'Email, dashboard, WhatsApp'},
    {l:'crm', t:'Mark milestones', out:'Loyalty', tr:'Milestone reached', sla:'Within 24 h of milestone',
      acts:['First trip, 5th booking','100th night sold, top-partner badge','Tier upgrades and rewards'], tp:'Push, email, loyalty points'},
    {l:'cs', t:'Ask for feedback', out:'Satisfaction score and fixes', tr:'After trip; quarterly for partners', sla:'Close detractor loop in 72 h',
      acts:['Short NPS question','Call every detractor','Share themes with product and supply'], tp:'Survey, NPS'},
    {l:'cs', t:'Spot risk early', out:'At-risk list', tr:'Inactivity rules', sla:'Weekly at-risk list',
      acts:['Guest: no visit in 60 days','Supplier: falling availability','Creator: no post in 45 days'], tp:'Dashboard alerts'},
    {l:'am', t:'Win back or renew', out:'Retained member or partner', tr:'At-risk flag; 60 days before renewal', sla:'Contact within 7 days of flag',
      acts:['Personal offer or call','Renewal review for sponsors','Exit reason logged if lost'], tp:'Offer, call, meeting'}
  ],
  flow:[['Join','new members + partners'],['Activate','first result'],['Engage','monthly active'],['Reward','milestones'],['Retain','still active at 90 d'],['Win back','returned']],
  conv:['Activation rate','Active rate','Milestone rate','90-day retention','Win-back rate'],
  obj:['Keep guests booking again','Keep suppliers, creators and sponsors active and renewing','Make every message relevant to where the person is in their journey'],
  kpi:[
    ['Activation rate','Reached first result in 14 days ÷ joined (per audience)','CRM, partner tracker','Weekly','CRM / account managers','up','Leading'],
    ['Time to first value','Median days from join to first result','CRM, partner tracker','Monthly','CRM / account managers','down','Leading'],
    ['90-day retention','Active at day 90 ÷ joined (cohort)','Analytics','Monthly','CRM','up','Lagging'],
    ['Repeat booking rate','Guests with 2+ bookings ÷ guests (12 months)','Booking system','Quarterly','CRM','up','Lagging'],
    ['Partner churn','Suppliers or creators lost ÷ active at start of period','Partner tracker','Quarterly','Account managers','down','Lagging'],
    ['Sponsor renewal rate','Sponsors renewing ÷ sponsors up for renewal','Partner tracker','Quarterly','Account managers','up','Lagging'],
    ['NPS by audience','% promoters − % detractors','Survey','Monthly','Customer service & insight','up','Lagging'],
    ['Win-back rate','At-risk members who return in 30 days ÷ at-risk contacted','CRM','Monthly','CRM','up','Leading'],
    ['Loyalty share','Bookings by loyalty members ÷ all bookings','Booking system','Monthly','CRM','up','Lagging']
  ],
  cad:['Always on: triggered messages','Monthly: statements and value updates','Quarterly: retention review by track'],
  in:[['Consumer','guests after their trip'],['Supply','suppliers after go-live'],['Creator','creators after onboarding']],
  hand:[['Consumer','returning guests into campaigns'],['Internal','retention numbers into performance reporting']]
},
{
  id:'internal', n:'07', name:'Internal Communications',
  sub:'The systems and routines that keep the organisation aligned, informed, accountable and moving quickly across Canada, India, technology, operations, marketing and leadership.',
  who:['Leadership','Canada','India','Philippines','All functions'],
  chain:['Strategy','Priorities & budgets','Weekly reviews','Daily execution','Reporting','Knowledge base'],
  lanes:{ex:'Executive team', fin:'Finance', fh:'Function heads', rl:'Region leads', op:'Operations'},
  steps:[
    {l:'ex', t:'Set strategy & decisions', out:'Monthly priorities', tr:'Monthly strategic review', sla:'First week of month',
      acts:['Priorities, major decisions, approvals','Investor and shareholder matters','Every decision written in the decision log'], tp:'Strategic review, decision log'},
    {l:'fin', t:'Budgets & approvals', out:'Approved function plans', tr:'Priorities set', sla:'Approvals within 3 working days',
      acts:['Budget per function against the model','Cash need and forecast','Spend approval limits'], tp:'Budget model, approval form'},
    {l:'ex', t:'Weekly management review', out:'Actions with owners', tr:'Weekly', sla:'Monday, 45 min',
      acts:['Each head: progress, blockers, KPIs','Decisions and owners recorded','Escalations reviewed'], tp:'Video call, dashboard'},
    {l:'fh', t:'Weekly functional meetings', out:'Team work plans', tr:'Weekly', sla:'Tuesday–Wednesday',
      acts:['Tech & product, supply, marketing & social','Finance, customer service, BD','Actions onto the shared task board'], tp:'Team meetings, task board'},
    {l:'rl', t:'Time-zone handoff', out:'No waiting overnight', tr:'End of each region’s day', sla:'Every working day',
      acts:['Handoff note: done, open, needs decision','Overlap call when needed','Owner named for every open item'], tp:'Shared channel, template'},
    {l:'op', t:'Daily check-ins', out:'Issues assigned', tr:'Daily', sla:'15 min where required',
      acts:['Priorities and staffing','Customer-service and vendor issues','Compliance and admin'], tp:'Stand-up'},
    {l:'fin', t:'Performance reporting', out:'One set of numbers', tr:'Weekly and monthly', sla:'Dashboard every Monday',
      acts:['Users, bookings, engagement, conversion','Inventory, creator activity, revenue','Marketing results vs. budget'], tp:'Dashboard'},
    {l:'op', t:'Knowledge base', out:'One source of truth', tr:'After every meeting or decision', sla:'Notes filed within 24 h',
      acts:['Contracts, decks, brand assets, specs','SOPs, research, meeting notes','Decision log and policies'], tp:'Knowledge base'},
    {l:'op', t:'Crisis & escalation', out:'Contained, logged incident', tr:'Incident detected', sla:'SEV 1 acknowledged in 15 min', gate:'SEV 1?', loop:'Yes → CEO at once',
      acts:['Detect, log, set severity','Escalate, contain, communicate','Resolve and file post-mortem'], tp:'Escalation channel, phone'}
  ],
  flow:[['Strategy','monthly review'],['Plans','budgets approved'],['Weekly review','actions set'],['Execution','daily work'],['Reporting','dashboard'],['Knowledge','filed & findable']],
  conv:['Approval time','Action close rate','Handoff compliance','On-time dashboard','Filing rate'],
  obj:['Everyone works from the same priorities and numbers','Decisions are made fast and written down','Nothing waits overnight because of time zones'],
  kpi:[
    ['Decision log completeness','Decisions logged ÷ decisions made in reviews','Decision log','Monthly','Executive team','up','Leading'],
    ['Action close rate','Actions closed by due date ÷ actions due','Task board','Weekly','Function heads','up','Leading'],
    ['Spend approval turnaround','Median working days to approve spend','Approval form','Monthly','Finance','down','Leading'],
    ['Dashboard on time','Weeks dashboard published by Monday ÷ weeks','Dashboard','Monthly','Finance','hold','Leading'],
    ['Handoff compliance','Handoff notes sent ÷ region working days','Shared channel','Weekly','Region leads','up','Leading'],
    ['SEV 1 response time','Minutes from detection to acknowledgement (target ≤ 15)','Incident log','Per incident','Operations','down','Leading'],
    ['Time to resolve','Hours from detection to resolution, by severity','Incident log','Monthly','Operations','down','Lagging'],
    ['Post-mortems filed','SEV 1–2 incidents with post-mortem in 5 working days ÷ incidents','Knowledge base','Monthly','Operations','up','Lagging'],
    ['SOP freshness','SOPs reviewed in last 6 months ÷ SOPs','Knowledge base','Quarterly','Operations','up','Lagging']
  ],
  cad:['Daily: operational check-ins where required','Weekly: functional meetings and management review','Monthly: strategic / business review'],
  in:[['All channels','results, issues, decisions needed']],
  hand:[['Corporate','staff briefed before external news'],['All channels','priorities, budgets and one set of numbers']]
}
];

/* ------------------------------------------------------------------ channel explanations */
const EXPL = {
consumer:{
  why:'Consumer communications is how Vacario finds travellers, turns them into bookers and brings them back. It spends most of the marketing budget, so every step has to show what it returns.',
  how:'Paid ads, press and creator content bring people to the app. From sign-up, CRM takes over: a welcome series learns what each person wants, and reminders bring back anyone who searched without booking. Once they book, messages switch from selling to helping: confirmation, trip preparation and support during the stay. After checkout the traveller is asked for a review and a referral, and after 30 days they move to Lifecycle, where the aim is the next booking.',
  rules:['Every campaign link carries tracking tags, so each booking can be traced to its source.','No more than one marketing message a day per person across all touchpoints.','WhatsApp and SMS go only to people who have opted in.','Service messages (confirmation, trip details) always go out, even to people who opted out of marketing.'],
  breaks:[['Installs rise but bookings do not','Check sign-up rate and 30-day conversion before adding ad spend.'],['Guests stop opening messages','Cut frequency and base content on the preference quiz, not generic deals.'],['Bad reviews after a stay','Send to Supply the same day; fix the property before promoting it again.']],
  story:'Priya in Hyderabad sees a Reel about a Coorg homestay and taps the link <b>(1)</b>. She installs the app and picks “hills, family, under ₹8,000” in the welcome quiz <b>(2)</b>. She searches but does not book; next day a WhatsApp reminder shows a price drop <b>(3)</b> and she books <b>(4)</b>. A week before arrival she gets directions and a coffee-plantation tour offer <b>(5)</b>. She messages support about a late check-in and gets a reply in minutes <b>(6)</b>. After checkout she leaves a review and sends her referral link to her sister <b>(7)</b>. A month later she gets Diwali trip ideas and books again <b>(8)</b>.'
},
supply:{
  why:'Supply communications brings in the rooms and stays that travellers book. Without accurate inventory in the right places, no amount of marketing produces bookings. The audience is business owners, so the messages are about revenue, reliability and ease.',
  how:'Each month the supply lead compares what travellers search for with what Vacario can sell and names the gaps. Business development contacts suitable owners, hotels and managers and qualifies them. Finance and legal agree terms and sign. Supply operations builds and checks the listing, makes a test booking and switches it on. From then on, operations keeps prices and availability accurate every day, and an account manager sends monthly results and meets the best partners each quarter to add more inventory.',
  rules:['No listing goes live without a successful test booking.','Every partner has one named account manager.','Payouts are made on the agreed date, every time.','Rate parity is checked every week.'],
  breaks:[['Signed partners take weeks to go live','Track time to live per listing; chase anything over 14 days.'],['Bookings fail because rooms are not really free','Move the partner to a channel manager or API and watch sync errors daily.'],['Partners go quiet after signing','Send the first monthly statement even with zero bookings, with a plan to change that.']],
  story:'Search data shows many travellers looking for Munnar tea-estate stays but few listings <b>(1)</b>. BD calls ten estates and qualifies four <b>(2)</b>. Three sign on the standard commission, with GST documents collected <b>(3)</b>. Operations photographs one estate, connects its channel manager and loads rates <b>(4)</b>, then makes a test booking before switching it on <b>(5)</b>. A sync error one weekend is fixed the same day <b>(6)</b>. At month end the owner gets a statement showing 14 bookings and agrees to list a second cottage <b>(7)</b>.'
},
creator:{
  why:'Creators reach travellers who trust them more than ads. The plan treats creators as part of Vacario’s distribution: each has a link and a code, earns from bookings, and supplies content Vacario reuses.',
  how:'Each quarter the team finds creators who match target travellers by niche, region and language, and invites the best into the programme on one of three tiers. Onboarding gives them a kit, a tracking link and code, and the disclosure rules. For a campaign, the content lead briefs the trip and books the stay through Supply. Drafts are checked before posting. Social reshares the posts and boosts the best as paid ads. Finance pays monthly from the attribution report, and the strongest creators move to long-term ambassador deals.',
  rules:['Every paid or gifted post carries a clear disclosure label, in line with ASCI guidelines.','Creators are paid on time from the monthly statement.','Usage rights for paid ads are agreed before content is made.','One review round only, so creators keep their own voice.'],
  breaks:[['Big reach, no bookings','Judge creators on cost per attributed booking, not followers.'],['Content late or off-brief','Brief three weeks before travel; confirm deliverables in writing.'],['Posts missing the disclosure label','Do not approve until the label is present.']],
  story:'The team finds a Telugu travel creator with 80,000 engaged followers in Andhra Pradesh and Telangana <b>(1)</b> and signs her on the micro tier with commission per booking <b>(2)</b>. She gets her link, the code VAC-ANU and the disclosure rules <b>(3)</b>. The brief is a monsoon weekend in Araku Valley, booked through a supply partner <b>(4)</b>. Her draft is approved in a day <b>(5)</b>. The Reel posts, is reshared and boosted <b>(6)</b>. Her code brings 22 bookings and she is paid on the 10th <b>(7)</b>. After two strong quarters she becomes an ambassador <b>(8)</b>.'
},
destination:{
  why:'Most travel apps go quiet once the stay is booked. This channel keeps Vacario useful during the trip, with things to do, places to eat and offers nearby, and earns extra revenue from each trip.',
  how:'For each priority destination the team maps the tourism board, attractions, restaurants and experience operators. Tourism boards are offered co-marketing and traveller insight; merchants are offered visitors who are already in town. Each offer has clear terms and a code or QR for redemption. Content builds guides and offer cards in the app. CRM puts offers in the pre-trip message and sends timely suggestions during the stay. Redemptions are recorded, partners are settled monthly and offers are refreshed before each season.',
  rules:['At most one in-trip offer message a day.','Every offer has an end date and a redemption method before it goes live.','Merchants see the same redemption count Vacario sees.','Tourism boards get a report within two weeks of each campaign.'],
  breaks:[['Offers go unused','Send them at the right moment (arrival day, near the place) and drop weak ones.'],['Merchants dispute numbers','Use QR redemption logged in real time and visible to both sides.'],['Stale offers after the season','Refresh six weeks before each season.']],
  story:'Jaipur is a priority destination, so the team maps the tourism department, Amber Fort guides and ten restaurants <b>(1)</b>. A food-walk operator and three restaurants agree to offers <b>(2–3)</b>. Guides and offer cards go into the app <b>(4)</b>. A family booked for November gets the food walk in their pre-trip message and a restaurant offer on arrival evening <b>(5)</b>. They scan the QR at dinner <b>(6)</b>. The restaurant is paid its commission on the 10th <b>(7)</b>, and offers are refreshed for winter <b>(8)</b>.'
},
corporate:{
  why:'Corporate communications tells the story of the company rather than the product: what Vacario is building, how fast it is growing, its technology and its partners. It builds the trust needed for funding, partnerships and government support.',
  how:'Leadership approves one message house every six months. Communications keeps a calendar of milestones and prepares a pack for each: press release, fact sheet, investor note, partner brief, internal note and Q&A. Finance checks the numbers, legal checks the claims and the CEO signs off. Employees are briefed first; then each audience hears the news through its own route on the same day. One spokesperson handles questions, and results are logged.',
  rules:['Employees hear news before anyone outside.','Finance checks every number before release.','Only the named spokesperson speaks to media.','Partner names are used only with written approval.'],
  breaks:[['Different people quote different numbers','The fact sheet is the only source; log every figure released.'],['Staff learn news from social media','Hold the release until the internal briefing has gone out.'],['Announcements bunch up or slip','Update the milestone calendar monthly; plan one major story a month.']],
  story:'Vacario signs a co-marketing agreement with a state tourism department, which fits the “India first” message <b>(1)</b>. It goes on the calendar for the second week of the month <b>(2)</b>. The pack is drafted <b>(3)</b>; finance checks the numbers, legal approves the department’s name and the CEO signs off <b>(4)</b>. Staff in Canada, India and the Philippines are briefed that morning <b>(5)</b>. The release goes to media, investors and partners <b>(6)</b>. The CEO takes two interview requests <b>(7)</b>, and the coverage report is filed a week later <b>(8)</b>.'
},
lifecycle:{
  why:'The plan says communication should not stop once somebody joins, spends, sells or sponsors. Keeping a guest or partner costs far less than finding a new one, so this is where Vacario should shine.',
  how:'Guests, suppliers, creators and merchants each follow the same five stages on their own track. They are welcomed and pointed to one first action. Anyone without a first result in 14 days gets reminders, then a personal call. Each month they receive something useful. Milestones are recognised and rewarded. Feedback is collected at key moments and detractors are called back. Anyone going quiet is flagged and contacted with a personal offer or a renewal conversation.',
  rules:['One track per audience; nobody gets another audience’s messages.','Every message has one clear next action.','Detractors are contacted within 72 hours.','Renewals start 60 days before the end date.'],
  breaks:[['Many join, few activate','Shorten the path to the first result and call at day 10.'],['Partners leave without warning','Act on early signs (falling availability, no posts) from the weekly at-risk list.'],['Too many messages','Cap marketing messages; let triggered messages replace scheduled ones.']],
  story:'A new homestay owner signs up and gets a welcome with one task: upload photos <b>(Join)</b>. By day 10 the listing is not live, so the account manager calls and finishes it with them <b>(Activate)</b>. Each month they get a statement with bookings and reviews <b>(Engage)</b>. At 100 nights sold they get a top-partner badge and featured placement <b>(Reward)</b>. When availability drops in the off-season they are flagged and invited into a monsoon promotion <b>(Retain)</b>.'
},
internal:{
  why:'Internal communications keeps a team spread across Canada, India and the Philippines working from the same priorities and the same numbers. The plan’s rule: one company, one source of truth, one communications path from strategy to execution.',
  how:'Leadership sets priorities each month and records decisions. Finance turns them into approved budgets. Each week the management review checks progress against KPIs and assigns actions, and each function plans its week. Because the regions are hours apart, each ends its day with a handoff note so work continues overnight. Operations runs daily check-ins where needed. Finance publishes one dashboard every Monday. Everything is filed in the knowledge base, and incidents follow a set escalation path.',
  rules:['If a decision is not in the decision log, it has not been made.','Every action has one owner and a due date.','One dashboard; nobody presents their own version of the numbers.','SEV 1 incidents reach the CEO at once, at any hour.'],
  breaks:[['Work waits overnight between regions','Handoff note every working day, with an owner for each open item.'],['Meetings end without decisions','Close every meeting by reading back decisions and owners.'],['Files scattered across inboxes','Nothing counts as shared until it is in the knowledge base.']],
  story:'At the monthly review, leadership decides to open Goa inventory first <b>(1)</b>. Finance approves the extra supply budget in two days <b>(2)</b>. Monday’s management review gives the Goa target to the supply lead <b>(3)</b>, and the supply team plans its week <b>(4)</b>. India’s evening handoff note tells Canada which contracts need sign-off <b>(5)</b>. A payments outage at 2 am IST is logged as SEV 1 and the CEO is alerted within 15 minutes <b>(9)</b>. Monday’s dashboard shows Goa listings rising <b>(7)</b>, and the decision and post-mortem are filed <b>(8)</b>.'
}
};

/* ------------------------------------------------------------------ KPI formulas
   f: [numerator, denominator] or a string for non-ratio KPIs
   u: '%' ratio ×100 · 'inv' (1 − n÷d) ×100 · '₹' money ÷ count · 'x' plain ratio · 'nps'
   ex: [n, d] example inputs (the result is calculated below), or a string
   nm: numerator is money · per: unit label after a plain ratio                                  */
const KX = {
'Cost per install (CPI)':{w:'What one app install from paid ads costs. The first check on whether ad money is buying people at a sensible price.', f:['Paid media spend','Installs from paid campaigns'], u:'₹', nm:true, ex:[150000,3000], r:'Compare by channel and destination weekly. Move budget away from the highest-CPI campaigns unless their installs convert to bookings better.'},
'Sign-up rate':{w:'The share of people who install the app and then create an account. A low rate means onboarding asks too much too early.', f:['Sign-ups','Installs'], u:'%', ex:[1800,3000], r:'If it drops right after an app release, check the sign-up screens first.'},
'Opt-in rate':{w:'The share of new users who allow WhatsApp or push messages. Without opt-in, the CRM steps cannot reach them.', f:['Users opted into WhatsApp or push','Sign-ups'], u:'%', ex:[1080,1800], r:'Ask at a moment of value (a price alert, a saved trip), not on first launch.'},
'30-day booking conversion':{w:'Of the people who signed up in a month, how many booked within 30 days. The main test of whether the Welcome and Engage steps work.', f:['First bookings within 30 days of sign-up','Sign-ups in the same month (cohort)'], u:'%', ex:[90,1800], r:'Measure by sign-up month, so a late booking counts against the month the person joined.'},
'Blended CAC':{w:'The full cost to win one paying customer: all marketing spend, including creators and content, divided by new customers. The same measure as cost per booking in the budget engine.', f:['Total marketing spend','New booking customers'], u:'₹', nm:true, ex:[600000,400], r:'CAC must be earned back by the first or second booking. Compare it with contribution per booking every month.'},
'Average booking value':{w:'The average value of one booking. Multiplied by completed bookings it gives the north star.', f:['Gross booking value (GBV)','Number of bookings'], u:'₹', nm:true, ex:[5400000,600], r:'Rising value with steady conversion is healthy. Rising value with falling bookings can mean prices are too high.'},
'Review rate':{w:'The share of completed trips that leave a review. Reviews build trust for the next traveller and supply content for the feed.', f:['Reviews received','Completed trips'], u:'%', ex:[150,500], r:'Ask one day after checkout and make it one tap. Reply to every review within 48 hours.'},
'Referral share':{w:'How much of the business comes from guests recommending Vacario. Referral bookings have almost no media cost.', f:['Bookings from referral links or credits','All bookings'], u:'%', ex:[60,600], r:'If it is flat, test a bigger or two-sided referral credit and send the link at the happiest moment, right after a good review.'},
'12-month repeat rate':{w:'The share of customers who booked two or more times in the last 12 months. The cheapest booking is from a past guest.', f:['Customers with 2+ bookings in 12 months','Customers who booked in the same 12 months'], u:'%', ex:[240,1600], r:'Look at it by first destination and first channel to see which travellers come back.'},

'Pipeline coverage':{w:'Whether there are enough good leads to hit next month’s signing target.', f:['Qualified leads in the pipeline','Monthly signing target'], u:'x', ex:[90,30], r:'Below 3× means outreach must increase now. Signings follow outreach by four to six weeks.'},
'Win rate':{w:'The share of qualified leads that sign. Shows whether the pitch and terms work.', f:['Suppliers signed','Qualified leads'], u:'%', ex:[27,90], r:'Log why deals are lost. Recurring reasons (commission, payout speed) point to the fix.'},
'Time to live':{w:'How long it takes from a signed contract to a bookable listing. Every day in between is inventory Vacario paid to win but cannot sell.', f:'Median of (go-live date − contract date) for listings that went live this period', ex:'Five listings went live after 6, 8, 9, 12 and 20 days → median = <b>9 days</b>', r:'Use the median so one slow listing does not hide the normal case. Chase anything over 14 days.'},
'Live listings by destination':{w:'How much bookable inventory there is in each priority destination.', f:'Count of listings that are live and bookable, per priority destination', ex:'Goa 120 · Jaipur 85 · Munnar 40 → <b>245 live listings</b> in three destinations', r:'Compare with search demand per destination; that gap sets next month’s target list.'},
'Availability accuracy':{w:'How often a booking goes through at the shown price and availability. Failed bookings lose the traveller and hurt trust.', f:['Bookings that failed on availability or price','Bookings attempted'], u:'inv', ex:[12,800], r:'Anything under 98% needs a partner-by-partner look; most failures come from a few partners without a channel manager.'},
'Supplier cancellation rate':{w:'The share of bookings a supplier cancels. Each one strands a traveller and costs a rebooking.', f:['Bookings cancelled by the supplier','All bookings'], u:'%', ex:[8,800], r:'Repeat offenders get a warning, then fewer placements, then removal.'},
'Rate parity':{w:'Whether Vacario shows the same or better price than other sites for the same stay.', f:['Listings at parity or better','Listings checked'], u:'%', ex:[188,200], r:'Raise gaps with the partner the same week; travellers who find a lower price elsewhere rarely come back.'},
'Bookings per live listing':{w:'How productive the average listing is. Shows whether new inventory is in places travellers want.', f:['Bookings in the month','Live listings'], u:'x', per:' bookings per listing', ex:[800,400], r:'Listings with no bookings in 60 days need better content or promotion, or should be dropped.'},
'Supplier satisfaction':{w:'How happy partners are with Vacario, from a short quarterly survey.', f:'Sum of scores ÷ number of responses (scale 1–10)', ex:'40 partners answer; their scores add up to 324 → 324 ÷ 40 = <b>8.1</b>', r:'Read the comments from anyone scoring 6 or lower and call them within a week.'},

'Active creators by tier':{w:'How many creators are actually posting, by size of audience.', f:'Count of creators with at least one post in the last 30 days, by tier', ex:'Nano 25 · Micro 12 · Macro 3 → <b>40 active creators</b>', r:'A signed creator who never posts costs time; re-brief or drop after 45 quiet days.'},
'On-time delivery':{w:'The share of agreed content that arrives on the agreed date.', f:['Content delivered by the agreed date','Content due'], u:'%', ex:[54,60], r:'Late creators slip campaigns. Take it into account at the quarterly tier review.'},
'Approval turnaround':{w:'How fast Vacario approves creator drafts. Slow approvals delay posts and frustrate creators.', f:'Median hours from draft received to approval', ex:'Drafts approved after 6, 20, 26, 30 and 50 hours → median = <b>26 hours</b>', r:'The SLA is 48 hours. Anything slower points to too many reviewers.'},
'Engagement rate':{w:'How strongly a creator’s audience reacts to a post. A better guide to influence than follower count.', f:['Likes + comments + saves + shares','Reach (unique accounts that saw the post)'], u:'%', ex:[4200,60000], r:'Compare creators of the same tier; saves and shares matter most for travel.'},
'Link clicks':{w:'How many people went from creator content to Vacario.', f:'Sum of clicks on all creator tracking links in the period', ex:'40 creators × 150 clicks on average → <b>6,000 clicks</b>', r:'Clicks with no bookings usually mean the landing page does not match the post.'},
'Attributed bookings':{w:'Bookings Vacario can trace to a creator through their link or code.', f:'Bookings made through a creator link (within 30 days of the click) + bookings using a creator code', ex:'85 bookings by link + 35 by code → <b>120 attributed bookings</b>', r:'This is what creators are paid on, so the rules (30-day window, code or link) must be written into every agreement.'},
'Cost per attributed booking':{w:'What it costs to get one booking through creators. The creator equivalent of CAC.', f:['Creator fees + commission + hosted trip costs','Attributed bookings'], u:'₹', nm:true, ex:[360000,120], r:'Compare with blended CAC. Creators above it need a new brief or a smaller fee.'},
'Disclosure compliance':{w:'The share of paid or gifted posts with a correct disclosure label. Required under ASCI guidelines; the target is 100%.', f:['Paid or gifted posts with a correct label','Paid or gifted posts'], u:'%', ex:[60,60], r:'Anything below 100% is fixed the same day: ask the creator to edit the post.'},
'Creator retention':{w:'How many creators who were active last quarter are still active this quarter.', f:['Creators active in both quarters','Creators active last quarter'], u:'%', ex:[28,40], r:'Late payment and slow approvals are the usual reasons creators leave.'},

'Destination coverage':{w:'How many priority destinations have enough local partners to fill a trip with offers.', f:['Priority destinations with 5+ live partners','Priority destinations'], u:'%', ex:[6,10], r:'Work on the destinations with the most bookings and the fewest partners first.'},
'Active offers':{w:'How many offers a traveller can use in each destination.', f:'Count of offers live in the app, per destination', ex:'Goa 18 · Jaipur 12 · Munnar 6 → <b>36 live offers</b>', r:'Aim for variety (food, activity, transport), not just volume.'},
'In-trip view rate':{w:'The share of travellers in a destination who open at least one offer.', f:['Travellers who viewed an offer','Travellers in the destination'], u:'%', ex:[330,500], r:'Low views mean the timing or message is wrong, not the offers.'},
'Redemption rate':{w:'The share of travellers in a destination who use an offer.', f:['Offer redemptions','Travellers in the destination'], u:'%', ex:[110,500], r:'High views with low redemptions mean the offer is weak or hard to use.'},
'Ancillary revenue per trip':{w:'The extra revenue earned on each trip beyond the stay.', f:['Commission + experience revenue','Completed trips'], u:'₹', nm:true, ex:[275000,500], r:'Add it to booking contribution when judging whether CAC is affordable.'},
'Settlement on time':{w:'The share of partners paid by the 10th of the following month.', f:['Partners paid by day 10','Partners due payment'], u:'%', ex:[38,40], r:'Late payment is the fastest way to lose small merchants.'},
'Sponsorship revenue':{w:'Money from tourism boards and sponsors for campaigns and placement.', f:'Sum of tourism board, co-marketing and sponsor fees recognised in the period', ex:'Two tourism board campaigns ₹4,00,000 + three sponsorships ₹1,50,000 → <b>₹5,50,000</b>', r:'Every sponsor gets a results report; renewal depends on it.'},
'Partner renewal rate':{w:'The share of destination partners who renew for the next season.', f:['Partners who renewed','Partners up for renewal'], u:'%', ex:[34,40], r:'Look at redemptions for those who did not renew; poor results usually explain it.'},

'Milestones on schedule':{w:'Whether announcements go out on the planned date.', f:['Announcements made on the planned date','Announcements planned'], u:'%', ex:[5,6], r:'A slip is fine if planned; a missed date with no notice is not.'},
'Media mentions':{w:'How often Vacario appears in the media.', f:'Count of articles, broadcasts and posts naming Vacario, from the coverage log', ex:'18 online + 4 print + 2 broadcast → <b>24 mentions</b>', r:'Read it with tier-1 share; volume alone can hide weak coverage.'},
'Tier-1 coverage share':{w:'The share of coverage in national business and travel media.', f:['Mentions in tier-1 media','All mentions'], u:'%', ex:[6,24], r:'Agree the tier-1 list once and keep it fixed so the number can be compared over time.'},
'Message pull-through':{w:'Whether coverage carries Vacario’s own key messages.', f:['Coverage carrying at least one key message','All coverage'], u:'%', ex:[18,24], r:'Low pull-through means the messages are not quotable; rewrite them as short facts.'},
'Investor update on time':{w:'Whether investors get their update on the agreed date. Target 100%.', f:['Updates sent by the agreed date','Updates due'], u:'%', ex:[3,3], r:'Send on time even when the news is mixed; silence worries investors more.'},
'Investor meetings':{w:'Interest the updates and releases create among investors.', f:'Count of investor meetings or calls that came from an update or release', ex:'Two after the monthly update + three after a release → <b>5 meetings</b> in the quarter', r:'Note which update or story led to each meeting.'},
'Government and tourism MoUs':{w:'Formal partnerships with government and tourism bodies.', f:'Count of MoUs or formal partnerships signed with government or tourism bodies', ex:'One state tourism MoU in the quarter → <b>1</b>', r:'Each MoU should lead to a campaign within six months, handled by Destination & Merchant.'},
'Employees briefed first':{w:'Whether staff heard the news before the public. Target 100%.', f:['Releases with a staff briefing beforehand','Releases'], u:'%', ex:[4,4], r:'If it misses once, find out why before the next release.'},

'Activation rate':{w:'The share of new guests or partners who reach their first result within 14 days: first booking, listing live, first post or first redemption.', f:['Reached first result within 14 days','Joined in the same period'], u:'%', ex:[450,1800], r:'Measure each audience separately; the first results differ.'},
'Time to first value':{w:'How long it takes a new member or partner to get their first result.', f:'Median days from joining to first result', ex:'First results after 2, 4, 5, 9 and 13 days → median = <b>5 days</b>', r:'The faster the first result, the more likely people stay.'},
'90-day retention':{w:'The share of people who joined in a month and are still active 90 days later.', f:['Still active at day 90','Joined in the same month (cohort)'], u:'%', ex:[540,1800], r:'Compare cohorts month by month; this shows whether changes are working.'},
'Repeat booking rate':{w:'The share of guests with two or more bookings in 12 months. The same measure as Consumer’s 12-month repeat rate, owned jointly.', f:['Guests with 2+ bookings in 12 months','Guests who booked in the same 12 months'], u:'%', ex:[240,1600], r:'The clearest sign that Lifecycle works.'},
'Partner churn':{w:'The share of suppliers or creators who left during the period.', f:['Partners lost in the period','Partners active at the start of the period'], u:'%', ex:[12,400], r:'Lower is better. Log every exit reason.'},
'Sponsor renewal rate':{w:'The share of sponsors who renew.', f:['Sponsors who renewed','Sponsors up for renewal'], u:'%', ex:[17,20], r:'Start the renewal conversation 60 days early, with the results report.'},
'NPS by audience':{w:'How likely people are to recommend Vacario, on a 0–10 scale. Promoters answer 9–10, detractors 0–6.', f:'% promoters (9–10) − % detractors (0–6)', u:'nps', ex:'200 answers: 110 promoters (55%), 60 passives, 30 detractors (15%) → 55 − 15 = <b>NPS +40</b>', r:'NPS runs from −100 to +100. Call every detractor within 72 hours.'},
'Win-back rate':{w:'The share of at-risk members who come back after being contacted.', f:['At-risk members who returned within 30 days','At-risk members contacted'], u:'%', ex:[36,300], r:'Test the offer and the channel; a personal message often beats a discount.'},
'Loyalty share':{w:'The share of bookings made by loyalty members.', f:['Bookings by loyalty members','All bookings'], u:'%', ex:[180,600], r:'Rising share means the programme is valued; check it is not only discounting.'},

'Decision log completeness':{w:'Whether decisions made in reviews are written down.', f:['Decisions recorded in the decision log','Decisions made in reviews'], u:'%', ex:[19,20], r:'Read the log back at the end of each review to close the gap.'},
'Action close rate':{w:'The share of actions finished by their due date.', f:['Actions closed by the due date','Actions due'], u:'%', ex:[68,80], r:'Low rates usually mean too many actions per person; cut them.'},
'Spend approval turnaround':{w:'How fast spend requests are approved.', f:'Median working days from request to approval', ex:'Approvals took 1, 1, 2, 3 and 6 days → median = <b>2 days</b>', r:'The SLA is 3 working days; slower approvals hold up campaigns and contracts.'},
'Dashboard on time':{w:'Whether the weekly dashboard comes out by Monday. Target 100%.', f:['Weeks the dashboard was published by Monday','Weeks in the period'], u:'%', ex:[4,4], r:'The management review uses it, so a late dashboard means a review without numbers.'},
'Handoff compliance':{w:'Whether each region sends its end-of-day handoff note.', f:['Handoff notes sent','Region working days (3 regions × working days)'], u:'%', ex:[62,66], r:'Missing notes show up as work waiting overnight.'},
'SEV 1 response time':{w:'How fast a critical incident is acknowledged by its owner. Target 15 minutes or less.', f:'Minutes from detection to acknowledgement, for each SEV 1 incident', ex:'Detected at 02:10, acknowledged at 02:21 → <b>11 minutes</b> (within target)', r:'Every miss is reviewed in the post-mortem.'},
'Time to resolve':{w:'How long incidents take to fix, by severity.', f:'Median hours from detection to resolution, per severity level', ex:'SEV 2 incidents resolved in 3, 5 and 9 hours → median = <b>5 hours</b>', r:'Track SEV 1 and SEV 2 separately; averages across levels hide problems.'},
'Post-mortems filed':{w:'Whether lessons from serious incidents are written down.', f:['SEV 1–2 incidents with a post-mortem within 5 working days','SEV 1–2 incidents'], u:'%', ex:[3,4], r:'A post-mortem names the cause and one change to stop a repeat.'},
'SOP freshness':{w:'Whether procedures are kept up to date.', f:['SOPs reviewed in the last 6 months','All SOPs'], u:'%', ex:[36,45], r:'Out-of-date SOPs are worse than none; review or retire them.'}
};

/* ------------------------------------------------------------------ glossary */
const GLOSS = [
  ['GBV','Gross booking value: the total value of bookings before costs, refunds excluded.'],
  ['North star','The one number the whole company steers by: completed bookings × average booking value.'],
  ['CAC','Customer acquisition cost: marketing spend ÷ new customers who booked.'],
  ['CPI','Cost per install: paid spend ÷ app installs from paid campaigns.'],
  ['Cohort','A group that joined in the same period, followed over time, e.g. everyone who signed up in October.'],
  ['Attribution','Linking a booking to what caused it: a campaign tag, a creator link or a code.'],
  ['Conversion','The share of people who move from one stage to the next, e.g. sign-up to first booking.'],
  ['Median','The middle value when sorted. Used for times so that one extreme case does not distort the result.'],
  ['Leading KPI','Moves first and can be changed this week, e.g. opt-in rate. Managed weekly.'],
  ['Lagging KPI','Confirms the result later, e.g. repeat rate. Reviewed monthly or quarterly.'],
  ['NPS','Net Promoter Score: % answering 9–10 minus % answering 0–6 to “How likely are you to recommend us?”.'],
  ['Rate parity','Vacario’s price for a stay is the same as or better than other sites.'],
  ['SLA','Service level: the time allowed for a step, e.g. reply within 15 minutes.'],
  ['UGC','User-generated content: photos, videos and reviews made by travellers.'],
  ['Tier-1 media','National business and travel outlets on an agreed, fixed list.'],
  ['ASCI','Advertising Standards Council of India, whose guidelines require paid creator posts to be clearly labelled.']
];

/* ------------------------------------------------------------------ operating model */
const HAND = [
  ['Supply','Consumer','New inventory and destinations to promote'],
  ['Creator','Consumer','Content for ads, CRM and the app feed'],
  ['Consumer','Destination & Merchant','Travellers and trip dates for in-trip offers'],
  ['Consumer','Lifecycle','Guests after the trip'],
  ['Supply / Creator','Lifecycle','Partners after go-live and onboarding'],
  ['Destination & Merchant','Corporate','Tourism board partnerships to announce'],
  ['All channels','Internal','Results, issues, decisions needed'],
  ['Internal','All channels','Priorities, budgets, one set of numbers'],
  ['Corporate','Internal','Staff briefed before any release']
];
const ROLES = ['CEO & leadership','Marketing (performance + CRM)','Community, social & content','Creator partnerships','Supply & BD','Destination partnerships','Communications','Finance & legal','Product & tech','Customer service & ops'];
const RACI = {
  consumer:   ['I','A','R','C','C','C','I','C','R','R'],
  supply:     ['I','C','I','I','A','C','I','R','R','C'],
  creator:    ['I','C','R','A','C','I','I','R','I','I'],
  destination:['I','C','R','I','C','A','I','R','R','C'],
  corporate:  ['A','C','I','I','C','C','R','R','I','I'],
  lifecycle:  ['I','A','R','C','R','R','I','I','R','R'],
  internal:   ['A','R','R','R','R','R','C','R','R','R']
};
const STREAMS = [
  ['Executive & leadership','Strategy, priorities, major decisions, budgets, approvals, investor and shareholder matters','Strategic review, decision log','Monthly','CEO'],
  ['Cross-functional','Technology, product, inventory, marketing, social, finance, customer service, BD','Management review, task board','Weekly','COO / GM'],
  ['Canada ↔ India ↔ Philippines','Reporting lines, decision authority, handoffs, time zones, escalation','Handoff notes, overlap call','Daily','Region leads'],
  ['Product & technology','App progress, bugs, releases, API integrations, AI tools, testing, launch readiness','Tech meeting, release notes','Weekly + each release','Head of product'],
  ['Sales & marketing','Campaign calendar, promotions, partnerships, influencers, earned media, content, results','Marketing meeting, calendar','Weekly','Marketing lead'],
  ['Travel supply','Hotels, vacation properties, airlines, API suppliers, availability, pricing, contracting','Supply pipeline review','Weekly','Supply lead'],
  ['Operational','Priorities, staffing, customer-service issues, vendors, compliance, admin','Daily check-in','Daily where required','Operations lead'],
  ['Financial','Budgets, spend approvals, cash needs, forecasts, KPIs, department performance','Finance review, approval form','Weekly + monthly','Finance'],
  ['Policies & procedures','Policies, brand standards, approvals, data and security, employee guidelines','Knowledge base','On change','Operations'],
  ['Performance reporting','Users, bookings, engagement, conversion, inventory, creator activity, revenue, marketing','Dashboard','Weekly + monthly','Finance + analytics'],
  ['Meeting structure','Daily check-ins, weekly functional, weekly management, monthly strategic','Shared calendar','As listed','COO / GM'],
  ['Knowledge base','Contracts, decks, brand assets, specs, SOPs, research, notes, decisions','Central repository','After every meeting','Operations']
];
const ESC = ['Detect','Log in escalation channel','Set severity','Escalate to owner','Contain','Communicate','Resolve','Post-mortem & file'];
const SEV = [
  ['SEV 1','App or payments down, travellers stranded, safety incident, legal threat, press story','15 min, any hour','CEO + function head at once','Affected customers and partners; media only through the spokesperson','30 min'],
  ['SEV 2','Supplier overbooking, API sync failure, complaint going public on social','1 h, working hours','Function head, same day','Affected customers and partners','4 h'],
  ['SEV 3','Single customer issue, minor bug, vendor delay','Next check-in','Team lead','The customer involved','Daily']
];
