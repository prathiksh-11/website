import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How often should I workout to see results?',
    a: "The frequency of workouts required to see results can vary based on several factors, including age, fitness level, and goals. However, as a general guideline, it is recommended that adults engage in at least 150 minutes of moderate-intensity exercise or 75 minutes of vigorous-intensity exercise per week. This can be spread out over several sessions, such as 30 minutes of exercise on five days of the week. If your goal is to build muscle, you may need to increase the frequency and intensity of your workouts, focusing on resistance training with weights or bodyweight exercises. It's always best to consult with a certified personal trainer or a physician before starting a workout routine.",
  },
  {
    q: 'What are the best exercises to target specific muscle groups?',
    a: `1. Chest: Push-ups, bench press, dumbbell flyes
2. Back: Pull-ups, rows, deadlifts
3. Shoulders: Military press, lateral raises, front raises
4. Biceps: Bicep curls, hammer curls, chin-ups
5. Triceps: Tricep dips, skull crushers, tricep extensions
6. Legs: Squats, lunges, deadlifts, leg press
7. Glutes: Squats, lunges, deadlifts, hip thrusts
8. Abs: Planks, crunches, Russian twists, bicycle crunches

It is important to remember that targeting specific muscle groups should be done in conjunction with a well-rounded exercise routine that includes cardio and full-body strength training.`,
  },
  {
    q: 'How can I improve my flexibility and range of motion?',
    a: `1. Stretching: Incorporate stretching exercises into your daily routine. This helps increase muscle elasticity and flexibility, which can improve your range of motion.
2. Yoga or Pilates: Practicing yoga or Pilates regularly can help increase flexibility, balance, and range of motion.
3. Foam rolling: Using a foam roller can help relax tight muscles, which can improve your flexibility.
4. Dynamic warm-up: Before exercising or engaging in any physical activity, perform a dynamic warm-up to get your body moving and increase your range of motion.
5. Regular exercise: Regular exercise can help improve your overall fitness levels, including flexibility and range of motion.
6. Proper nutrition: Eating a balanced diet and staying hydrated can help keep your muscles healthy and flexible.
7. Rest and recovery: Make sure to give your body adequate time to rest and recover between workouts to reduce the risk of injury and promote flexibility.`,
  },
  {
    q: 'How important is nutrition when it comes to achieving fitness goals?',
    a: "Nutrition is essential when it comes to achieving fitness goals. A proper diet helps improve energy levels and enables an individual to perform better during workouts. Additionally, proper nutrition provides the body with the necessary nutrients needed for recovery post-workout that aids in building more muscle mass, losing fat, and improving one's overall fitness level. A lack of proper nutrition can lead to fatigue, decreased performance, and slow progress. Therefore, a well-balanced and healthy diet is important to achieve fitness goals.",
  },
  {
    q: 'Is it necessary to use supplements?',
    a: "It is not always necessary to use supplements as long as they maintain a balanced diet and live a healthy lifestyle. In some cases, supplements can be recommended by healthcare professionals to address nutrient deficiencies or medical conditions. It is important to consult with a healthcare provider before starting any supplement regimen.",
  },
  {
    q: 'What are the benefits of strength training?',
    a: `1. Increased muscle mass: Strength training helps to build muscle mass, which can improve your overall appearance and increase your metabolism.
2. Improved bone density: Strength training can help to increase bone density, which can reduce the risk of osteoporosis, especially in older adults.
3. Better body composition: Strength training can help you decrease body fat and increase lean muscle mass, which can improve your overall health and fitness levels.
4. Increased strength and power: Regular strength training can help improve your strength and power, which can enhance your ability to perform daily activities and sports-specific movements.
5. Reduced risk of injury: Strength training strengthens your muscles, tendons, and ligaments, which can help reduce the risk of injuries during physical activities.
6. Improved balance and stability: Strength training can help to improve your balance and stability, which can reduce the risk of falls, especially in older adults.
7. Greater overall health: Strength training has been shown to have many positive effects on overall health, including improved cardiovascular health, blood pressure, and cholesterol levels.
8. Enhanced mental health: Strength training has been shown to be beneficial for mental health, reducing symptoms of anxiety and depression and improving overall mood.`,
  },
  {
    q: 'Is it better to do cardio before or after strength training?',
    a: "Studies suggest that it's better to do strength training before cardio. This is because strength training requires more focus, energy, and effort, and doing it first ensures you have the energy to perform the exercises properly without risking injury. Additionally, strength training can also help improve your cardiovascular health and burn calories, so doing cardio afterward may not be necessary. However, ultimately it depends on your fitness goals and personal preferences. It's important to find a routine that works best for you and your body.",
  },
  {
    q: 'Can I build muscle without lifting heavy weights?',
    a: "Yes, it is possible to build muscle without lifting heavy weights. Resistance training can be done with various tools such as resistance bands, bodyweight exercises, or even household items like water bottles or cans. It is also important to focus on proper nutrition and adequate rest to support muscle growth.",
  },
];

interface FAQItemProps {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

function FAQItem({ faq, index, isOpen, onToggle, isVisible }: FAQItemProps) {
  return (
    <div
      className={`reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group ${isOpen
            ? 'glass-strong border border-[#ff6b35]/20'
            : 'glass border border-white/5 hover:border-white/10'
          }`}
        onClick={onToggle}
        style={{
          boxShadow: isOpen ? '0 0 30px rgba(0, 212, 255, 0.05)' : 'none',
        }}
      >
        {/* Question row */}
        <div className="flex items-center gap-4 p-6">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                ? 'bg-[#ff6b35]/20 border border-[#ff6b35]/40'
                : 'bg-white/5 border border-white/10 group-hover:border-white/20'
              }`}
          >
            {isOpen ? (
              <Minus size={14} className="text-[#ff6b35]" />
            ) : (
              <Plus size={14} className="text-white/50 group-hover:text-white/80 transition-colors" />
            )}
          </div>

          <h3
            className={`text-sm md:text-base font-semibold leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white/90'
              }`}
          >
            {faq.q}
          </h3>

          {/* Index number */}
          <span className="ml-auto flex-shrink-0 text-xs font-mono text-white/20">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Answer */}
        <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
          <div className="px-6 pb-6 ml-12">
            <div className="w-8 h-px bg-[#ff6b35]/30 mb-4" />
            <p className="text-white/55 leading-relaxed text-sm whitespace-pre-line">{faq.a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: listRef, isVisible: listVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section id="faq" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ff6b35] mb-4 block">Got Questions?</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-white">EVERY</span>
              <br />
              <span className="gradient-text-blue">ANSWER.</span>
            </h2>
            <div className="divider-glow max-w-xs mx-auto mb-6" />
            <p className="text-white/50 max-w-md mx-auto leading-relaxed">
              Everything you need to know about GAME ON FITNESS membership, facilities, and programs.
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div ref={listRef} className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              isVisible={listVisible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`reveal ${listVisible ? 'visible' : ''} text-center mt-16`}>
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
            <p className="text-white/50 text-sm mb-6">Our team is available 24/7 to help you.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-glow-blue text-black font-bold px-8 py-3 rounded-full text-sm tracking-wider uppercase"
              >
                Contact Us
              </button>
              <button className="btn-outline-glow font-semibold px-8 py-3 rounded-full text-sm tracking-wider uppercase">
                Book a Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
