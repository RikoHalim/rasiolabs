const definitions = {};
const add = (template, slug, label, values) => {
  const family = definitions[template] ||= {pages: {}, defaults: {}, fields: [], preparation: {}, owning: {}, targets: {}, titleFields: {}, leadFields: {}};
  family.pages[slug] = label;
  family.targets['extra'+(Object.keys(family.pages).length + 2)] = slug;
  family.titleFields[slug] = Object.keys(values)[0];
  family.leadFields[slug] = Object.keys(values)[1];
  Object.assign(family.defaults, values);
  family.fields.push({id: slug, label, items: Object.entries(values).map(([key, value]) => ({key, label: key.replace(/([A-Z])/g, ' $1').trim(), type: value.length > 220 ? 'textarea' : 'text', max: /Body|Lead|Description|Answer|Detail/.test(key) ? 1200 : 180}))});
};

add('Architecture', 'commercial', 'Commercial spaces', {
  commercialTitle: 'Spaces that work for your business.',
  commercialLead: 'Offices, shops and hospitality spaces designed around the people who use them.',
  commercialUseTitle: 'Start with the way the space will be used.',
  commercialUseLead: 'A useful commercial brief connects the visitor experience with the everyday work behind it.',
  commercialOfficeTitle: 'Workplaces',
  commercialOfficeBody: 'Balance focused work, meetings and informal conversations. Define how teams move through the day, where privacy matters and which spaces need to adapt.',
  commercialRetailTitle: 'Retail spaces',
  commercialRetailBody: 'Make the offer easy to understand from arrival to checkout. Consider product display, circulation, storage and the points where staff help customers.',
  commercialHospitalityTitle: 'Hospitality spaces',
  commercialHospitalityBody: 'Connect the guest experience with service routes, back-of-house needs and a comfortable pace. Share how the space will operate before choosing its finishes.',
  commercialPreparationTitle: 'Bring the operating details.',
  commercialPreparationBody: 'A floor plan, photographs, capacity needs and access restrictions help the first conversation. Include opening hours and any stages of work that must happen while the business stays open.',
  commercialDiagramLabel: 'Arrival, shared space and quieter rooms connected in one layout.',
  commercialRequestLabel: 'Discuss a commercial space',
  commercialRelatedLabel: 'Prepare a residential brief'
});
definitions.Architecture.owning = {projects: ['commercial'], process: ['commercial']};
definitions.Architecture.preparation.commercial = {title: 'Prepare your commercial brief', fields: [['Business and location', 'text'], ['Type of space', 'select', ['Workplace', 'Retail', 'Hospitality', 'Mixed use']], ['People or capacity', 'text'], ['Spaces needed', 'textarea'], ['Operating or access constraints', 'textarea'], ['Budget and target opening', 'text']]};

add('Padel', 'membership', 'Club membership', {
  membershipTitle: 'MAKE A GOOD GAME A REGULAR THING.',
  membershipLead: 'Find a club membership that fits how you like to play.',
  membershipFormatsTitle: 'YOUR ROUTINE. YOUR CLUB.',
  membershipCourtTitle: 'Court membership',
  membershipCourtBody: 'For players who want a regular place to meet, play and build a familiar rhythm on court.',
  membershipCoachTitle: 'Coaching membership',
  membershipCoachBody: 'For players who want a structured route through practice, feedback and time to use what they learn.',
  membershipCommunityTitle: 'Community membership',
  membershipCommunityBody: 'For players who enjoy introductions, shared sessions and being part of the club beyond a single game.',
  membershipQuestionsTitle: 'FIND YOUR FIT.',
  membershipQuestionsBody: 'Tell the club your level, the days you normally play and what you want from your membership.',
  membershipFrequencyTitle: 'How often will you play?',
  membershipFrequencyAnswer: 'Build your enquiry around a realistic routine. Include the days and times that work for you.',
  membershipLevelTitle: 'What kind of game do you want?',
  membershipLevelAnswer: 'Share whether you are learning, playing socially or working towards a more competitive game.',
  membershipPeopleTitle: 'Coming with friends?',
  membershipPeopleAnswer: 'Include the size of your group and whether you want to join other club players.',
  membershipRequestLabel: 'ASK ABOUT MEMBERSHIP',
  membershipRelatedLabel: 'Explore coaching'
});
add('Padel', 'coaching', 'Coaching programmes', {
  coachingTitle: 'LESS GUESSING. MORE GOOD RALLIES.',
  coachingLead: 'Coaching built around the level you are at and the game you want to play.',
  coachingBeginnerTitle: 'Build the basics',
  coachingBeginnerBody: 'Get comfortable with the racket, court positions and a shared rally. Start with simple patterns you can recognise in a game.',
  coachingClubTitle: 'Develop your game',
  coachingClubBody: 'Work on shot choices, movement and communication with your partner. Bring a specific part of your game you want to improve.',
  coachingCompetitionTitle: 'Prepare to compete',
  coachingCompetitionBody: 'Review match situations and practice with a clearer purpose. Discuss the format and goals you are preparing for.',
  coachingPracticeTitle: 'PRACTICE WITH A PURPOSE.',
  coachingPracticeBody: 'A coaching session is more useful when the coach knows your experience, your goals and how you usually play.',
  coachingDiagramLabel: 'Positioning and movement between the net and baseline.',
  coachingRequestLabel: 'PLAN A COACHING SESSION',
  coachingRelatedLabel: 'Your first game'
});
add('Padel', 'events', 'Club events & groups', {
  clubEventsTitle: 'MAKE A DAY OF IT.',
  clubEventsLead: 'Bring your people together for a game with room for everyone.',
  clubEventsCompanyTitle: 'Team days',
  clubEventsCompanyBody: 'A shared introduction or a friendly round of games gives colleagues a different way to spend time together.',
  clubEventsPrivateTitle: 'Private groups',
  clubEventsPrivateBody: 'Build a session around friends, families or a celebration. Share the mix of ages and playing experience in your group.',
  clubEventsCommunityTitle: 'Club socials',
  clubEventsCommunityBody: 'Meet other players around a relaxed game. Tell the club your level and the kind of session you would like to join.',
  clubEventsPlanTitle: 'THE DETAILS MAKE THE DAY.',
  clubEventsPlanBody: 'Include your preferred date, group size and how much time you want on court. Ask about equipment and spaces for gathering between games.',
  clubEventsRequestLabel: 'PLAN YOUR CLUB EVENT',
  clubEventsRelatedLabel: 'Build a group-play brief'
});
add('Padel', 'player-guide', 'Player guide', {
  playerGuideTitle: 'ARRIVE READY. ENJOY THE GAME.',
  playerGuideLead: 'A practical guide to your next visit to the club.',
  playerGuideBeforeTitle: 'Before you arrive',
  playerGuideBeforeBody: 'Confirm your session time and check what equipment is available. Tell the team about your experience and whether you are coming with a partner.',
  playerGuideCourtTitle: 'On court',
  playerGuideCourtBody: 'Use suitable court footwear, keep the playing area clear and take a moment to agree how you will play with your group. Ask the team if a court detail is unfamiliar.',
  playerGuideAfterTitle: 'After the game',
  playerGuideAfterBody: 'Return any borrowed equipment and leave the court ready for the next players. If you want to come back, ask which session fits your next step.',
  playerGuideFaqTitle: 'GOOD QUESTIONS BEFORE A GOOD GAME.',
  playerGuideBookingTitle: 'Can I change my session?',
  playerGuideBookingAnswer: 'Contact the club with your session details as soon as your plans change. The team will explain the options for your booking.',
  playerGuideSoloTitle: 'Can I arrive on my own?',
  playerGuideSoloAnswer: 'Ask about coaching and social sessions. Sharing your level helps the team discuss a suitable way to join.',
  playerGuideGroupTitle: 'Can we bring a mixed-level group?',
  playerGuideGroupAnswer: 'Yes, begin by describing the group and what you want from the visit. The team can discuss a format that makes sense for everyone.',
  playerGuideRequestLabel: 'PLAN YOUR VISIT',
  playerGuideRelatedLabel: 'Club membership'
});
definitions.Padel.owning = {club: ['membership', 'events'], play: ['coaching', 'player-guide'], visit: ['player-guide', 'membership']};
definitions.Padel.preparation.membership = {title: 'Find your membership', fields: [['Playing experience', 'select', ['First-time player', 'Social player', 'Regular club player', 'Competitive player']], ['Typical playing days', 'text'], ['How often would you play?', 'text'], ['What do you want from the club?', 'textarea']]};
definitions.Padel.preparation.coaching = {title: 'Prepare your coaching enquiry', fields: [['Current playing level', 'select', ['Beginner', 'Club player', 'Competitive player']], ['What would you like to improve?', 'textarea'], ['Individual or group', 'select', ['Individual', 'Pair', 'Small group']], ['Preferred day and time', 'text']]};
definitions.Padel.preparation.events = {title: 'Plan a club event', fields: [['Event or group name', 'text'], ['Preferred date', 'date'], ['Number of players', 'number'], ['Playing experience', 'select', ['Mostly beginners', 'Mixed levels', 'Regular players']], ['Time on court and other plans', 'textarea']]};

add('Creative', 'packaging', 'Packaging & print', {
  packagingTitle: 'A brand you can hold.',
  packagingLead: 'Packaging and print designed for the moment someone picks it up.',
  packagingThinkingTitle: 'From the shelf to the small print.',
  packagingThinkingBody: 'The shape, information and visual language need to work together. We start with the product, the person using it and the conditions the packaging needs to meet.',
  packagingStructureTitle: 'The structure',
  packagingStructureBody: 'Define the formats, dimensions, product range and production constraints. Share any dielines and supplier specifications before developing the artwork.',
  packagingInformationTitle: 'The information',
  packagingInformationBody: 'Set a clear hierarchy for the name, product details and information supplied by your business. Make the important parts easy to find at the scale they will be used.',
  packagingFinishTitle: 'The finish',
  packagingFinishBody: 'Connect materials, colour and print treatments with the brand. Review production-ready artwork with the supplier and agree how samples will be checked.',
  packagingScopeTitle: 'A connected set of touchpoints.',
  packagingScopeBody: 'Boxes, labels, inserts and print pieces should feel like parts of the same story. Bring a complete list of the formats your team needs.',
  packagingRequestLabel: 'Discuss packaging design',
  packagingRelatedLabel: 'Build a project scope'
});
add('Creative', 'project-scope', 'Build a project scope', {
  scopeTitle: 'A clear brief makes room for better work.',
  scopeLead: 'Choose the touchpoints you need, define the decisions and bring a focused starting point to the studio.',
  scopeOfferTitle: 'The offer',
  scopeOfferBody: 'Describe what you sell, who it helps and what a customer needs to understand first.',
  scopeTouchpointsTitle: 'The touchpoints',
  scopeTouchpointsBody: 'List the places the work must appear. Separate the essential launch pieces from the work that can follow.',
  scopeDecisionTitle: 'The decisions',
  scopeDecisionBody: 'Name the people giving feedback and the person approving the direction. Include any fixed dates or existing brand assets.',
  scopeRequestLabel: 'Continue to the studio brief',
  scopeRelatedLabel: 'Explore packaging & print'
});
definitions.Creative.owning = {studio: ['packaging', 'project-scope'], work: ['packaging'], brief: ['project-scope']};
definitions.Creative.preparation['project-scope'] = {title: 'Build your project scope', fields: [['Business and offer', 'textarea'], ['Project touchpoints', 'checklist', ['Visual identity', 'Website', 'Packaging', 'Print materials', 'Social templates']], ['Launch essentials', 'textarea'], ['Existing assets and references', 'textarea'], ['Who will approve the work?', 'text'], ['Budget and launch date', 'text']]};

add('Consulting', 'workshops', 'Team workshops', {
  workshopTitle: 'Get the right people around the same question.',
  workshopLead: 'Facilitated working sessions that turn different perspectives into a clearer next step.',
  workshopQuestionTitle: 'A focused question',
  workshopQuestionBody: 'Begin with the decision or challenge the group needs to address. Share the background, available evidence and what needs to be different after the session.',
  workshopPeopleTitle: 'The people closest to the work',
  workshopPeopleBody: 'Bring the people who understand the work, the people affected by a change and the people responsible for decisions.',
  workshopActionTitle: 'A shared next step',
  workshopActionBody: 'Capture decisions, open questions and actions with owners. Agree on what the team will review after the session.',
  workshopFormatsTitle: 'Choose a useful starting point.',
  workshopStrategyTitle: 'Strategy alignment',
  workshopStrategyBody: 'Compare priorities, constraints and options so the group can discuss where to focus.',
  workshopProcessTitle: 'Process mapping',
  workshopProcessBody: 'Trace a real piece of work and identify the handoffs, waiting and unclear decisions.',
  workshopChangeTitle: 'Change planning',
  workshopChangeBody: 'Consider the people, dependencies and practical steps involved in carrying a decision into everyday work.',
  workshopRequestLabel: 'Plan a team workshop',
  workshopRelatedLabel: 'Review an operating process'
});
add('Consulting', 'working-together', 'Working together', {
  engagementTitle: 'Know what to bring. Know what comes next.',
  engagementLead: 'A few practical answers before the first conversation.',
  engagementStartTitle: 'Where do we start?',
  engagementStartAnswer: 'Begin with the decision you need to make or the part of the business that needs attention. A short account of the current situation is enough for an initial conversation.',
  engagementEvidenceTitle: 'What information should we bring?',
  engagementEvidenceAnswer: 'Relevant plans, operating information and team observations help establish the context. Bring what is available and identify where the evidence is incomplete.',
  engagementPeopleTitle: 'Who should be involved?',
  engagementPeopleAnswer: 'Include a decision owner and the people closest to the question. The right group depends on the scope and how the work affects the business.',
  engagementOutputTitle: 'What will the work produce?',
  engagementOutputAnswer: 'Define the outputs with the team at the beginning: a review, a set of priorities, a workshop record or an action plan. Connect each output with the decision it needs to support.',
  engagementChangeTitle: 'What if the question changes?',
  engagementChangeAnswer: 'Keep the question and assumptions visible as the work progresses. Review new information together before changing the agreed direction or scope.',
  engagementFollowTitle: 'How do we keep the next steps useful?',
  engagementFollowAnswer: 'Assign owners to the actions and choose a review point. Use the review to discuss what has changed, what the team has learned and which decision comes next.',
  engagementRequestLabel: 'Discuss your business question',
  engagementRelatedLabel: 'Prepare a business review'
});
definitions.Consulting.owning = {expertise: ['workshops', 'working-together'], insights: ['working-together'], approach: ['workshops'], contact: ['working-together']};
definitions.Consulting.preparation.workshops = {title: 'Prepare a workshop brief', fields: [['Question for the group', 'textarea'], ['People or teams involved', 'text'], ['Number of participants', 'number'], ['Preferred format', 'select', ['In person', 'Remote', 'Discuss the format']], ['Evidence available', 'textarea'], ['Decision or next step needed', 'textarea']]};

export const legacyExpansion = definitions;

export function legacyOwningLinks(template, page, {link, section}) {
  const family = definitions[template];
  const routes = family.owning[page] || [];
  return routes.length ? section('<nav class="legacy-related" aria-label="Related '+(template === 'Padel' ? 'club information' : 'services')+'">'+routes.map(slug => link(slug, family.pages[slug], 'legacy-related-link')).join('')+'</nav>', 'legacy-related-section') : '';
}

export function renderLegacyPages(template, ctx) {
  const {t, pic, link, section, heading, prep, tabs} = ctx;
  const pageBodies = {};
  const figure = (key, alt, cls = '') => '<figure class="legacy-photo '+cls+'">'+pic(key, alt, 'loading="lazy"')+'</figure>';
  const copy = (title, body, tag = 'h2') => t(title, tag)+t(body, 'p');
  const request = (slug, titleKey, relatedPage, relatedKey, topicKey = '') => section('<div class="legacy-next">'+link(slug, t(titleKey), 'action', topicKey)+link(relatedPage, t(relatedKey))+'</div>', 'legacy-next-section');
  const disclosure = (title, body, open = false) => '<details '+(open ? 'open' : '')+'><summary>'+t(title, 'h3')+'<span aria-hidden="true">+</span></summary>'+t(body, 'p')+'</details>';
  const drawing = '<svg class="space-drawing" viewBox="0 0 600 320" aria-hidden="true"><path class="drawing-wall" d="M42 40H558V280H42ZM42 132H258M342 132H558M258 40V132M342 40V132M180 132V280M420 132V280"/><path class="drawing-route" d="M70 242H122V196H300V84H498"/><circle cx="70" cy="242" r="7"/><circle cx="498" cy="84" r="7"/></svg>';
  const court = '<svg class="coaching-court" viewBox="0 0 400 500" aria-hidden="true"><path d="M30 30H370V470H30ZM30 250H370M30 135H370M30 365H370M200 135V365"/><path class="court-rally" d="M110 350Q250 210 292 94Q180 222 86 174Q160 218 270 390"/><circle class="court-ball" cx="0" cy="0" r="9"/></svg>';
  if (template === 'Architecture') {
    pageBodies.commercial = section('<div class="commercial-intro">'+heading(t('commercialTitle'), 'Commercial spaces', t('commercialLead'))+figure('home1Image', 'A considered interior with natural light')+'</div>')+
      section('<div class="commercial-planning"><div>'+copy('commercialUseTitle', 'commercialUseLead')+'<div class="commercial-use-links"><a href="#workplace">Workplaces</a><a href="#retail">Retail</a><a href="#hospitality">Hospitality</a></div></div><div class="commercial-diagram">'+drawing+t('commercialDiagramLabel', 'p')+'</div></div>', 'soft-section')+
      section('<div class="commercial-uses">'+[['workplace', 'Office'], ['retail', 'Retail'], ['hospitality', 'Hospitality']].map(([id, prefix]) => '<article id="'+id+'">'+copy('commercial'+prefix+'Title', 'commercial'+prefix+'Body')+'</article>').join('')+'</div>')+
      section('<div class="commercial-preparation">'+copy('commercialPreparationTitle', 'commercialPreparationBody')+'</div>', 'dark-section')+
      prep('commercial', 'Commercial space', 'contact')+request('contact', 'commercialRequestLabel', 'planning', 'commercialRelatedLabel', 'commercialTitle');
  } else if (template === 'Padel') {
    pageBodies.membership = section('<div class="membership-opening">'+heading(t('membershipTitle'), 'Club membership', t('membershipLead'))+'<span class="membership-court-lines" aria-hidden="true"></span></div>')+
      section('<div class="membership-heading">'+t('membershipFormatsTitle', 'h2')+'</div><div class="membership-formats">'+['Court', 'Coach', 'Community'].map(prefix => '<article>'+copy('membership'+prefix+'Title', 'membership'+prefix+'Body', 'h3')+link('visit#enquiry', 'Ask about this membership', 'text-link', 'membership'+prefix+'Title')+'</article>').join('')+'</div>', 'soft-section')+
      section('<div class="membership-details"><div>'+copy('membershipQuestionsTitle', 'membershipQuestionsBody')+'</div><div class="legacy-faq">'+['Frequency', 'Level', 'People'].map((prefix, i) => disclosure('membership'+prefix+'Title', 'membership'+prefix+'Answer', !i)).join('')+'</div></div>')+
      prep('membership', 'Club membership', 'visit#enquiry')+request('visit#enquiry', 'membershipRequestLabel', 'coaching', 'membershipRelatedLabel');
    pageBodies.coaching = section('<div class="coaching-opening">'+heading(t('coachingTitle'), 'Coaching programmes', t('coachingLead'))+figure('playImage', 'Padel player preparing for a coaching rally')+'</div>')+
      section('<div class="coaching-levels">'+['Beginner', 'Club', 'Competition'].map(prefix => '<article>'+copy('coaching'+prefix+'Title', 'coaching'+prefix+'Body', 'h3')+'</article>').join('')+'</div>', 'dark-section')+
      section('<div class="coaching-practice"><div>'+copy('coachingPracticeTitle', 'coachingPracticeBody')+link('visit#enquiry', 'Ask about coaching', 'action', 'Coaching')+'</div><div class="coaching-diagram">'+court+t('coachingDiagramLabel', 'p')+'</div></div>', 'soft-section')+
      prep('coaching', 'Coaching', 'visit#enquiry')+request('visit#enquiry', 'coachingRequestLabel', 'first-game', 'coachingRelatedLabel');
    pageBodies.events = section('<div class="club-event-opening">'+figure('communityImage', 'Padel players sharing an outdoor court')+heading(t('clubEventsTitle'), 'Club events & groups', t('clubEventsLead'))+'</div>')+
      section('<div class="club-event-types">'+['Company', 'Private', 'Community'].map(prefix => '<article>'+copy('clubEvents'+prefix+'Title', 'clubEvents'+prefix+'Body', 'h3')+'</article>').join('')+'</div>')+
      section('<div class="club-event-plan">'+copy('clubEventsPlanTitle', 'clubEventsPlanBody')+'</div>', 'dark-section')+
      prep('events', 'Club event', 'visit#enquiry')+request('visit#enquiry', 'clubEventsRequestLabel', 'group-play', 'clubEventsRelatedLabel');
    pageBodies['player-guide'] = section(heading(t('playerGuideTitle'), 'Player guide', t('playerGuideLead'))+'<div class="player-guide-flow">'+['Before', 'Court', 'After'].map((prefix, i) => '<article><span class="player-guide-stage" aria-hidden="true">'+(i + 1)+'</span>'+copy('playerGuide'+prefix+'Title', 'playerGuide'+prefix+'Body', 'h2')+'</article>').join('')+'</div>')+
      section('<div class="player-guide-faq"><div>'+t('playerGuideFaqTitle', 'h2')+figure('equipmentImage', 'Padel rackets and balls ready for a court session')+'</div><div class="legacy-faq">'+['Booking', 'Solo', 'Group'].map((prefix, i) => disclosure('playerGuide'+prefix+'Title', 'playerGuide'+prefix+'Answer', !i)).join('')+'</div></div>', 'soft-section')+
      request('visit#enquiry', 'playerGuideRequestLabel', 'membership', 'playerGuideRelatedLabel');
  } else if (template === 'Creative') {
    pageBodies.packaging = section('<div class="packaging-opening">'+heading(t('packagingTitle'), 'Packaging & print', t('packagingLead'))+figure('work1Image', 'Colour and texture studies for a visual identity')+'</div>')+
      section('<div class="packaging-reading"><div>'+copy('packagingThinkingTitle', 'packagingThinkingBody')+'</div>'+tabs(['packagingStructureBody', 'packagingInformationBody', 'packagingFinishBody'], [t('packagingStructureTitle'), t('packagingInformationTitle'), t('packagingFinishTitle')])+'</div>', 'soft-section')+
      section('<div class="packaging-touchpoints">'+copy('packagingScopeTitle', 'packagingScopeBody')+'<div class="packaging-fold" aria-hidden="true"><i></i><i></i><i></i></div></div>', 'dark-section')+
      request('brief', 'packagingRequestLabel', 'project-scope', 'packagingRelatedLabel', 'packagingTitle');
    pageBodies['project-scope'] = section(heading(t('scopeTitle'), 'Build a project scope', t('scopeLead'))+'<div class="scope-outline">'+['Offer', 'Touchpoints', 'Decision'].map(prefix => '<article>'+copy('scope'+prefix+'Title', 'scope'+prefix+'Body', 'h2')+'</article>').join('')+'</div>')+
      prep('project-scope', 'Creative project', 'brief')+request('brief', 'scopeRequestLabel', 'packaging', 'scopeRelatedLabel');
  } else if (template === 'Consulting') {
    pageBodies.workshops = section('<div class="workshop-opening">'+heading(t('workshopTitle'), 'Team workshops', t('workshopLead'))+figure('workshopImage', 'A team organising ideas and decisions during a workshop')+'</div>')+
      section('<ol class="workshop-agenda">'+['Question', 'People', 'Action'].map((prefix, i) => '<li><span aria-hidden="true">'+(i + 1)+'</span>'+copy('workshop'+prefix+'Title', 'workshop'+prefix+'Body', 'h2')+'</li>').join('')+'</ol>', 'dark-section')+
      section('<div class="workshop-formats"><div>'+t('workshopFormatsTitle', 'h2')+'</div><div class="legacy-faq">'+['Strategy', 'Process', 'Change'].map((prefix, i) => disclosure('workshop'+prefix+'Title', 'workshop'+prefix+'Body', !i)).join('')+'</div></div>')+
      prep('workshops', 'Team workshop', 'contact')+request('contact', 'workshopRequestLabel', 'operations-review', 'workshopRelatedLabel', 'workshopTitle');
    pageBodies['working-together'] = section('<div class="engagement-opening">'+heading(t('engagementTitle'), 'Working together', t('engagementLead'))+'</div><div class="engagement-layout"><nav aria-label="On this page"><a href="#start">Getting started</a><a href="#information">Information & people</a><a href="#next-steps">Outputs & next steps</a></nav><div class="legacy-faq">'+[['Start', 'start'], ['Evidence', 'information'], ['People', 'people'], ['Output', 'next-steps'], ['Change', 'change'], ['Follow', 'follow']].map(([prefix, id], i) => '<div id="'+id+'">'+disclosure('engagement'+prefix+'Title', 'engagement'+prefix+'Answer', !i)+'</div>').join('')+'</div></div>')+
      request('contact', 'engagementRequestLabel', 'business-review', 'engagementRelatedLabel');
  }
  return pageBodies;
}
