import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Calendar, Moon, Bell, BellOff } from 'lucide-react';
import { motion } from 'motion/react';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function Home() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [locationName, setLocationName] = useState<string>('جاري تحديد الموقع...');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remaining: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const notifiedPrayerRef = useRef<string>('');

  // Helper to convert 24h to 12h format
  const format12Hour = (time24: string) => {
    const [hoursStr, minutes] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    // Get Hijri Date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic' };
    setHijriDate(new Intl.DateTimeFormat('ar-SA', options).format(today));

    // Get Location and Prayer Times
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Get City Name using reverse geocoding
            const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`);
            const geoData = await geoResponse.json();
            const city = geoData.city || geoData.locality || 'موقعك الحالي';
            setLocationName(city);

            // Get Prayer Times
            const date = new Date();
            const timestamp = Math.floor(date.getTime() / 1000);
            const response = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=4`);
            const data = await response.json();
            
            if (data && data.data && data.data.timings) {
              setPrayerTimes({
                Fajr: data.data.timings.Fajr,
                Sunrise: data.data.timings.Sunrise,
                Dhuhr: data.data.timings.Dhuhr,
                Asr: data.data.timings.Asr,
                Maghrib: data.data.timings.Maghrib,
                Isha: data.data.timings.Isha,
              });
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            setLocationName('تعذر جلب المواقيت');
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationName('يرجى تفعيل الموقع');
        }
      );
    } else {
      setLocationName('الموقع غير مدعوم');
    }
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;

    const calculateNextPrayer = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

      const prayers = [
        { name: 'الفجر', key: 'Fajr' },
        { name: 'الظهر', key: 'Dhuhr' },
        { name: 'العصر', key: 'Asr' },
        { name: 'المغرب', key: 'Maghrib' },
        { name: 'العشاء', key: 'Isha' },
      ];

      // Check for notifications
      for (const p of prayers) {
        const time = prayerTimes[p.key as keyof PrayerTimes];
        if (time === currentTimeStr && notifiedPrayerRef.current !== p.key) {
          notifiedPrayerRef.current = p.key;
          if ('Notification' in window && Notification.permission === 'granted') {
            // Use Service Worker to show notification if available
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('رفيق', {
                body: `حان الآن موعد أذان ${p.name}`,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                dir: 'rtl'
              });
            }).catch(() => {
              // Fallback to standard notification
              new Notification('رفيق', {
                body: `حان الآن موعد أذان ${p.name}`,
                icon: '/icon-192.png',
                dir: 'rtl'
              });
            });
          }
        }
      }

      let next = null;
      for (const p of prayers) {
        const time = prayerTimes[p.key as keyof PrayerTimes];
        if (time > currentTimeStr) {
          next = { name: p.name, time };
          break;
        }
      }

      // If no next prayer today, it's Fajr tomorrow
      if (!next) {
        next = { name: 'الفجر', time: prayerTimes.Fajr };
      }

      // Calculate remaining time
      const [nextHours, nextMinutes] = next.time.split(':').map(Number);
      let diffHours = nextHours - currentHours;
      let diffMinutes = nextMinutes - currentMinutes;

      if (diffMinutes < 0) {
        diffMinutes += 60;
        diffHours -= 1;
      }
      if (diffHours < 0) {
        diffHours += 24;
      }

      setNextPrayer({
        ...next,
        remaining: `${diffHours > 0 ? `${diffHours} ساعة و ` : ''}${diffMinutes} دقيقة`
      });
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('متصفحك لا يدعم الإشعارات');
      return;
    }
    
    // Check if running in an iframe (like AI Studio preview)
    if (window.self !== window.top) {
      alert('عذراً، متصفحك يمنع تفعيل الإشعارات داخل نافذة العرض الحالية (Preview). يرجى فتح التطبيق في نافذة مستقلة أو تثبيته كبرنامج لتتمكن من تفعيلها.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        alert('تم تفعيل إشعارات الأذان بنجاح!');
      } else if (permission === 'denied') {
        alert('لقد قمت برفض صلاحية الإشعارات مسبقاً. يرجى تفعيلها من إعدادات المتصفح الخاص بك.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('حدث خطأ أثناء طلب الصلاحية.');
    }
  };

  const prayerNames: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  return (
    <div className="pb-24">
      {/* Header / Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-gold rounded-b-[2.5rem] p-6 pt-12 shadow-lg relative overflow-hidden border-t-0 border-x-0"
      >
        <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4 text-amber-500">
          <Moon size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-amber-400">رفيق</h1>
              <p className="text-neutral-300 text-sm flex items-center">
                <Calendar className="w-4 h-4 ml-1 text-amber-500" />
                {hijriDate}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center glass-panel px-3 py-1.5 rounded-full text-sm text-neutral-200">
                <MapPin className="w-4 h-4 ml-1 text-amber-400" />
                <span>{locationName}</span>
              </div>
              <button 
                onClick={requestNotificationPermission}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs transition-colors ${notificationsEnabled ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'}`}
              >
                {notificationsEnabled ? <Bell className="w-3 h-3 ml-1" /> : <BellOff className="w-3 h-3 ml-1" />}
                <span>{notificationsEnabled ? 'الإشعارات مفعلة' : 'تفعيل الإشعارات'}</span>
              </button>
            </div>
          </div>

          {nextPrayer && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-neutral-400 text-sm mb-1">الصلاة القادمة</p>
                  <h2 className="text-3xl font-bold text-amber-400">{nextPrayer.name}</h2>
                  <p className="text-sm text-neutral-300 mt-1">{format12Hour(nextPrayer.time)}</p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-400 text-sm mb-1">باقي على الأذان</p>
                  <p className="text-xl font-bold text-white">{nextPrayer.remaining}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Prayer Times Grid */}
      <div className="px-4 mt-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 ml-2 text-amber-400" />
          مواقيت الصلاة
        </h3>
        
        {prayerTimes ? (
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(prayerTimes).map(([key, time], i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={key} 
                className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center text-center"
              >
                <span className="text-neutral-400 text-sm mb-1">{prayerNames[key]}</span>
                <span className="text-lg font-bold text-amber-400">{format12Hour(time as string)}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-panel animate-pulse rounded-xl h-20"></div>
            ))}
          </div>
        )}
      </div>

      {/* Ramadan Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 mt-8"
      >
        <h3 className="text-lg font-bold text-white mb-4">نفحات رمضانية</h3>
        <div className="glass-panel-gold rounded-2xl p-5 text-white">
          <h4 className="font-bold text-lg mb-2 text-amber-400">دعاء الإفطار</h4>
          <p className="text-lg leading-relaxed font-serif text-neutral-200">
            "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ"
          </p>
        </div>
      </motion.div>
    </div>
  );
}
