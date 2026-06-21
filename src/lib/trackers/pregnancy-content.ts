export type WeekContent = { size: string; baby: string; mom: string; tip: string };

/**
 * Week-by-week pregnancy content (weeks 4–40), with India-relevant size
 * comparisons. Educational only — the doctor can refine via the CMS later.
 */
export const WEEKS: Record<number, WeekContent> = {
  4: { size: "a poppy seed", baby: "The embryo is implanting and the placenta is beginning to form.", mom: "You may have just missed your period. Hormones are rising.", tip: "Start (or continue) folic acid and avoid alcohol and smoking." },
  5: { size: "a sesame seed (til)", baby: "The neural tube — the start of the brain and spine — is forming.", mom: "Early nausea, tender breasts, or fatigue may begin.", tip: "Book your first antenatal consultation to confirm and plan." },
  6: { size: "a lentil (masoor dal)", baby: "A tiny heartbeat may now be detectable on ultrasound.", mom: "Morning sickness can peak around now for some.", tip: "Eat small, frequent meals to ease nausea." },
  7: { size: "a blueberry", baby: "Arm and leg buds are appearing; the brain is growing fast.", mom: "Frequent urination and food aversions are common.", tip: "Stay hydrated and rest when you can." },
  8: { size: "a rajma bean", baby: "Fingers, toes, and facial features are taking shape.", mom: "Your uterus is growing, though it won't show yet.", tip: "Confirm your dating scan timing with your doctor." },
  9: { size: "a grape", baby: "The embryo is now officially a fetus; tiny muscles are forming.", mom: "Hormonal mood swings are normal — be gentle with yourself.", tip: "Continue iron-rich foods and your prescribed supplements." },
  10: { size: "a small lime (nimbu)", baby: "Vital organs are formed and beginning to function.", mom: "Nausea may start to ease for some women.", tip: "Light movement like walking can boost energy." },
  11: { size: "a fig", baby: "The baby can move, though you can't feel it yet.", mom: "Your appetite may return.", tip: "Around now, the NT scan window (11–14 wk) begins." },
  12: { size: "a lime", baby: "Reflexes are developing; the baby may open and close fists.", mom: "End of the first trimester — risk of miscarriage drops.", tip: "Schedule your NT scan and first-trimester screening." },
  13: { size: "a lemon", baby: "Tiny fingerprints are forming.", mom: "Energy often improves in the second trimester.", tip: "A good time to plan nutrition and gentle exercise." },
  14: { size: "a peach (aloo bukhara)", baby: "The baby can squint, frown, and make expressions.", mom: "You may start to 'show' a little.", tip: "Keep up protein, calcium, and iron." },
  15: { size: "an apple", baby: "Bones are getting stronger; the baby senses light.", mom: "Some women notice nasal congestion or mild swelling.", tip: "Stay active with doctor-approved exercise." },
  16: { size: "an avocado", baby: "The baby may start tiny breathing-like movements.", mom: "You might feel the first flutters (quickening) soon.", tip: "Sleep on your side for better circulation." },
  17: { size: "a pomegranate (anar)", baby: "Fat stores are beginning to develop.", mom: "Your bump is becoming more noticeable.", tip: "Use a supportive pillow and comfortable footwear." },
  18: { size: "a bell pepper (shimla mirch)", baby: "Ears are in position; the baby may hear muffled sounds.", mom: "You may feel more movement now.", tip: "The anomaly (TIFFA) scan window is around 18–22 weeks." },
  19: { size: "a mango (aam)", baby: "A protective coating (vernix) covers the skin.", mom: "Round ligament aches can appear.", tip: "Move slowly when changing positions." },
  20: { size: "a banana (kela)", baby: "Halfway there! The baby is swallowing and developing taste.", mom: "Your bump is clearly visible now.", tip: "Don't miss your anomaly scan if not done." },
  21: { size: "a carrot (gajar)", baby: "Movements become stronger and more regular.", mom: "You may notice the baby's active and quiet times.", tip: "Begin noting movement patterns casually." },
  22: { size: "a coconut (nariyal)", baby: "Lips, eyelids, and tiny eyebrows are more defined.", mom: "Stretch marks and itchy skin may appear.", tip: "Moisturise and stay hydrated." },
  23: { size: "a large mango", baby: "The baby's hearing is improving — talk and sing!", mom: "Mild swelling in feet is common.", tip: "Elevate your feet and avoid standing too long." },
  24: { size: "an ear of corn (bhutta)", baby: "Lungs are developing air sacs; viability milestone.", mom: "Glucose screening (for GDM) is usually around 24–28 wk.", tip: "Ask your doctor about the OGTT test." },
  25: { size: "a small cauliflower (gobhi)", baby: "The baby is gaining fat and looking more rounded.", mom: "Back pain may increase as your bump grows.", tip: "Practise good posture and gentle stretches." },
  26: { size: "a beetroot (chukandar)", baby: "Eyes begin to open; responds to sound and touch.", mom: "Braxton Hicks (practice contractions) may begin.", tip: "Learn to tell practice contractions from real ones." },
  27: { size: "a small cabbage (patta gobhi)", baby: "End of the second trimester; brain activity increases.", mom: "Heartburn and leg cramps can appear.", tip: "Eat smaller dinners and stay magnesium-rich." },
  28: { size: "an eggplant (baingan)", baby: "Eyes can blink; the baby dreams (REM sleep).", mom: "Third trimester begins — visits become more frequent.", tip: "Start daily kick counting; aim for 10 movements." },
  29: { size: "a small pumpkin (kaddu)", baby: "Muscles and lungs continue to mature.", mom: "Shortness of breath is common as the uterus rises.", tip: "Rest often and watch for reduced movements." },
  30: { size: "a large cabbage", baby: "The baby can regulate its own temperature better.", mom: "Fatigue may return; sleep can be harder.", tip: "Nap when you can and keep up your iron." },
  31: { size: "a coconut", baby: "Rapid brain development; all five senses work.", mom: "You may leak a little colostrum.", tip: "Discuss your birth preferences with your doctor." },
  32: { size: "a large papaya", baby: "The baby often moves into a head-down position.", mom: "Braxton Hicks may feel stronger.", tip: "Keep monitoring movements daily." },
  33: { size: "a pineapple (ananas)", baby: "Bones harden, though the skull stays soft for birth.", mom: "Swelling may increase — watch for sudden changes.", tip: "Report any sudden swelling, headache, or vision changes." },
  34: { size: "a cantaloupe (kharbooja)", baby: "Lungs are nearly mature; fat continues to build.", mom: "You may feel pressure low in the pelvis.", tip: "Pack your hospital bag soon." },
  35: { size: "a honeydew melon", baby: "Most development is complete; now it's growth.", mom: "Frequent urination returns as the baby drops.", tip: "Confirm your delivery hospital and route." },
  36: { size: "a small watermelon (tarbooz)", baby: "The baby is gaining about 30g a day.", mom: "Weekly check-ups usually begin now.", tip: "Discuss signs of labour with your doctor." },
  37: { size: "a winter melon", baby: "The baby is considered early-term.", mom: "Nesting urges and pelvic pressure are common.", tip: "Know when to head to the hospital." },
  38: { size: "a small pumpkin", baby: "Organs are ready; the baby practises breathing.", mom: "You may lose your mucus plug.", tip: "Keep your bag and documents ready." },
  39: { size: "a watermelon", baby: "Full term! The baby is ready to meet you.", mom: "Watch for regular contractions and waters breaking.", tip: "Stay calm; time your contractions." },
  40: { size: "a small watermelon", baby: "Your due date! Babies arrive on their own schedule.", mom: "If overdue, your doctor will monitor closely.", tip: "Trust your care team and rest." },
};

export function getWeekContent(week: number): WeekContent {
  const w = Math.max(4, Math.min(40, week || 4));
  return (
    WEEKS[w] ?? {
      size: "growing every day",
      baby: "Your baby is developing steadily.",
      mom: "Listen to your body and rest as needed.",
      tip: "Keep up with your antenatal visits.",
    }
  );
}

export type AncItem = { week: number; title: string; type: "visit" | "scan" | "test" | "vaccine"; detail: string };

export const ANC_SCHEDULE: AncItem[] = [
  { week: 8, title: "First antenatal visit", type: "visit", detail: "Confirm pregnancy, history, baseline checks." },
  { week: 8, title: "Dating scan", type: "scan", detail: "Confirms gestational age and due date (6–9 weeks)." },
  { week: 8, title: "Baseline blood tests", type: "test", detail: "Blood group/Rh, Hb, TSH, blood sugar, infections." },
  { week: 12, title: "NT scan & screening", type: "scan", detail: "Nuchal translucency + first-trimester screening (11–14 wk)." },
  { week: 16, title: "Antenatal visit", type: "visit", detail: "Routine check; review reports." },
  { week: 18, title: "Tetanus vaccine (TT/Td) – 1st dose", type: "vaccine", detail: "As advised by your doctor." },
  { week: 20, title: "Anomaly scan (TIFFA)", type: "scan", detail: "Detailed fetal anatomy scan (18–22 wk)." },
  { week: 24, title: "Glucose screening (OGTT)", type: "test", detail: "Screen for gestational diabetes (24–28 wk)." },
  { week: 26, title: "Tetanus vaccine (TT/Td) – 2nd dose / Tdap", type: "vaccine", detail: "As advised by your doctor." },
  { week: 28, title: "Antenatal visit", type: "visit", detail: "Begin closer monitoring; start kick counts." },
  { week: 30, title: "Growth scan", type: "scan", detail: "Assess baby's growth and fluid (as advised)." },
  { week: 32, title: "Antenatal visit", type: "visit", detail: "Check BP, growth, position." },
  { week: 36, title: "Group B Strep / growth check", type: "test", detail: "Late checks and birth planning." },
  { week: 36, title: "Weekly visits begin", type: "visit", detail: "Weekly monitoring until delivery." },
];
