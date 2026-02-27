import React from 'react';
import { Moon, Star, BookHeart, Coffee, HeartHandshake, ShieldCheck, Sparkles, Coins } from 'lucide-react';
import { motion } from 'motion/react';

export function Ramadan() {
  const sections = [
    {
      title: 'أحكام الصيام',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      items: [
        'النية شرط أساسي ويجب تبييتها قبل الفجر.',
        'الأكل والشرب ناسياً لا يبطل الصيام.',
        'قطرة العين والأذن لا تفطر على الراجح.',
        'من أفطر لعذر شرعي (مرض/سفر) يقضي الأيام بعد رمضان.'
      ]
    },
    {
      title: 'سنن الصيام',
      icon: <Star className="w-6 h-6 text-amber-400" />,
      items: [
        'تعجيل الفطر وتأخير السحور.',
        'الإفطار على رطب أو تمر أو ماء.',
        'الدعاء عند الإفطار.',
        'السواك أثناء الصيام.',
        'كثرة تلاوة القرآن والصدقة.'
      ]
    },
    {
      title: 'العشر الأواخر وليلة القدر',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      items: [
        'الاجتهاد في العبادة وإحياء الليل بالصلاة والدعاء.',
        'الإكثار من دعاء: اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي.',
        'الاعتكاف في المساجد لمن استطاع.',
        'تحري ليلة القدر في الليالي الوترية (21، 23، 25، 27، 29).'
      ]
    },
    {
      title: 'زكاة الفطر',
      icon: <Coins className="w-6 h-6 text-amber-400" />,
      items: [
        'واجبة على كل مسلم يملك قوت يومه.',
        'تُخرج قبل صلاة العيد، ويجوز إخراجها قبل العيد بيوم أو يومين.',
        'مقدارها صاع من طعام (أرز، تمر، قمح...) أو قيمتها نقداً حسب فتوى بلدك.',
        'طهرة للصائم من اللغو والرفث، وطعمة للمساكين.'
      ]
    },
    {
      title: 'أعمال مستحبة',
      icon: <HeartHandshake className="w-6 h-6 text-amber-400" />,
      items: [
        'المحافظة على صلاة التراويح.',
        'تفطير الصائمين ولو بشق تمرة.',
        'صلة الرحم والتسامح.',
        'حفظ اللسان عن الغيبة والنميمة وغض البصر.'
      ]
    }
  ];

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">رمضانيات</h1>
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Moon className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-gold rounded-3xl p-6 mb-8 relative overflow-hidden"
      >
        <div className="absolute -left-4 -top-4 opacity-10">
          <BookHeart className="w-32 h-32 text-amber-500" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-amber-400 mb-2">شهر القرآن</h2>
          <p className="text-neutral-200 leading-relaxed font-serif text-lg">
            "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ"
          </p>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={section.title} 
            className="glass-panel rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                {section.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{section.title}</h3>
            </div>
            
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                  <span className="leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Health Tip */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 glass-panel border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4"
      >
        <div className="p-3 bg-emerald-500/10 rounded-xl shrink-0">
          <Coffee className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-400 mb-1">نصيحة صحية</h4>
          <p className="text-sm text-neutral-300 leading-relaxed">
            تجنب شرب كميات كبيرة من الماء دفعة واحدة وقت الإفطار، وقسّم شرب الماء بين الإفطار والسحور لتجنب العطش.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
