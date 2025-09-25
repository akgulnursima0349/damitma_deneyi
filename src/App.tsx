import React, { useState, useCallback } from 'react';
import { 
  BookOpen, 
  Target, 
  Settings, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  TestTube,
  BarChart3,
  Shield,
  Eye,
  AlertTriangle,
  Thermometer,
  Droplets
} from 'lucide-react';

type Phase = 'theory' | 'materials' | 'safety' | 'variables' | 'setup' | 'hypothesis' | 'experiment' | 'observation' | 'analysis' | 'errors' | 'evaluation';

interface DistillationData {
  time: number;
  temperature: number;
  dropRate: number;
  volume: number;
  observation: string;
}

const DistillationExperiment: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('theory');
  const [temperature, setTemperature] = useState(25);
  const [collectedVolume, setCollectedVolume] = useState(0);
  const [hypothesis, setHypothesis] = useState<'ethanol_first' | 'water_first' | 'mixed' | null>(null);
  const [distillationData, setDistillationData] = useState<DistillationData[]>([]);
  const [isExperimentRunning, setIsExperimentRunning] = useState(false);
  const [coolingOn, setCoolingOn] = useState(true);
  const [flamePower, setFlamePower] = useState(50); // 0-100

  const phases: { id: Phase; title: string; icon: React.ReactNode }[] = [
    { id: 'theory', title: 'Öğrenim Çıktısı ve Amaç', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'materials', title: 'Malzemeler', icon: <Settings className="w-5 h-5" /> },
    { id: 'safety', title: 'Güvenlik', icon: <Shield className="w-5 h-5" /> },
    { id: 'variables', title: 'Değişkenler', icon: <Target className="w-5 h-5" /> },
    { id: 'setup', title: 'Deney Düzeneği', icon: <Settings className="w-5 h-5" /> },
    { id: 'hypothesis', title: 'Hipotez', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'experiment', title: 'Deney', icon: <TestTube className="w-5 h-5" /> },
    { id: 'observation', title: 'Gözlem', icon: <Eye className="w-5 h-5" /> },
    { id: 'analysis', title: 'Analiz', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'errors', title: 'Hata Kaynakları', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'evaluation', title: 'Değerlendirme', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const nextPhase = useCallback(() => {
    const currentIndex = phases.findIndex(p => p.id === currentPhase);
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1].id);
    }
  }, [currentPhase, phases]);

  const prevPhase = useCallback(() => {
    const currentIndex = phases.findIndex(p => p.id === currentPhase);
    if (currentIndex > 0) {
      setCurrentPhase(phases[currentIndex - 1].id);
    }
  }, [currentPhase, phases]);

  const startExperiment = () => {
    setIsExperimentRunning(true);
    setDistillationData([]);
    setCollectedVolume(0);
    
    // Simülasyon başlat
    let experimentTime = 0;
    const interval = setInterval(() => {
      experimentTime += 1;
        
        // Alev gücüne bağlı ısı artışı (soğutma açıkken efektif sıcaklık yavaşlar)
        const baseRise = flamePower / 25; // 0-4 °C/saniye arası taban artış
        const coolingFactor = coolingOn ? 0.7 : 1.0;
        const targetTemp = temperature + baseRise * coolingFactor;

        if (experimentTime < 30) {
          setTemperature(() => Math.min(targetTemp, 78));
        } else if (experimentTime < 60) {
          setTemperature(prev => Math.min(prev + 0.3 * coolingFactor, 93));
        } else {
          setTemperature(prev => prev + 0.1 * coolingFactor);
        }
        
        // Damıtık toplama simülasyonu (soğutma açıksa damla hızı daha verimli)
        const ethanolWindow = temperature >= 78 && temperature <= 82;
        const waterWindow = temperature > 90;
        const dropRate = ethanolWindow ? (coolingOn ? 3 : 2) : waterWindow ? (coolingOn ? 2 : 1) : 0;
        if (dropRate > 0) {
          setCollectedVolume(prev => prev + dropRate * 0.1);
        }
        
        const observation = ethanolWindow ? 'Etanol damıtılıyor' : waterWindow ? 'Su damıtılıyor' : 'Isıtma devam ediyor';
        
        setDistillationData(prev => [...prev, {
          time: experimentTime,
          temperature: temperature,
          dropRate,
          volume: collectedVolume,
          observation
        }]);
        
        if (experimentTime >= 80) {
          clearInterval(interval);
          setIsExperimentRunning(false);
        }
    }, 100);
  };

  const TheoryPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Öğrenim Çıktısı ve Amaç
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Öğrenim Çıktısı</h3>
            <p className="text-gray-700">
              Kaynama noktası farkından yararlanarak basit damıtma ile sıvı–sıvı karışımların ayrılabileceğini gözlemler ve açıklar.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Amaç</h3>
            <p className="text-gray-700">
              Etil alkol (etanol)–su karışımını ısıtarak etanolce zengin damıtık elde etmek ve sıcaklık–zaman ilişkisini incelemek.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const MaterialsPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Malzemeler
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Damıtma Düzeneği</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Balon joje (100–250 mL)</li>
              <li>• Liebig soğutucu + su giriş/çıkış hortumları</li>
              <li>• Alıcı kap (beher)</li>
              <li>• Destek çubukları ve kelepçeler</li>
              <li>• Isı kaynağı (ispirto/ısıtıcı)</li>
              <li>• Termometre</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Kimyasallar ve Diğer</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Etil alkol–su karışımı (200 mL)</li>
              <li>• Buz banyosu (alıcıyı soğutmak için)</li>
              <li>• Musluk suyu (soğutucu için)</li>
              <li>• Kaynama taşı</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const SafetyPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Güvenlik ve Düzen
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Güvenlik Kuralları</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Açık alev varsa dikkat: Etanol uçucudur, kolay alev alır</li>
                  <li>• Gözlük, önlük, eldiven takılmalı</li>
                  <li>• Soğutucu suyu alttan giriş, üstten çıkış yapılmalı</li>
                  <li>• Cam bağlantılar sağlam kelepçelenmeli</li>
                  <li>• Balon tamamen boşalmadan ısıtma sonlandırılmalı</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const VariablesPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Değişkenler
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Bağımsız Değişken</h3>
            <p className="text-sm text-gray-700">Sıcaklık / zaman (ısıtma süreci)</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Bağımlı Değişken</h3>
            <p className="text-sm text-gray-700">Damıtık çıkışı, sıcaklık, toplanan hacim</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Kontrol Değişkenleri</h3>
            <p className="text-sm text-gray-700">Karışım miktarı, ısıtma şiddeti, soğutma suyu debisi</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SetupPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Düzeneğin Kurulumu
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3">Kurulum Adımları</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">1</span>
                <span>Balon jojeye karışımı koyun, tıpa takıp termometre ekleyin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">2</span>
                <span>Balon jojeyi sabitleyin; soğutucuyu yatay bağlayın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">3</span>
                <span>Hortumları takın: su alttan girsin, üstten çıksın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">4</span>
                <span>Soğutucu çıkışına alıcı beher yerleştirin</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );

  const HypothesisPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Hipotez Oluşturma
        </h2>
        <p className="text-gray-700 mb-4">
          Deneye başlamadan önce, etil alkol-su karışımının damıtılmasında hangi bileşenin önce damıtılacağını tahmin edin.
        </p>

        <div className="space-y-3">
          {[
            {key:'ethanol_first',label:'Etil alkol önce damıtılır (düşük kaynama noktası)'},
            {key:'water_first',label:'Su önce damıtılır (yüksek kaynama noktası)'},
            {key:'mixed',label:'Her ikisi birlikte damıtılır'}
          ].map(opt => (
            <label key={opt.key} className={`block border rounded-lg px-4 py-3 cursor-pointer ${
              hypothesis === opt.key ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'
            }`}>
              <input
                type="radio"
                name="hypothesis"
                className="mr-2"
                checked={hypothesis === opt.key}
                onChange={() => setHypothesis(opt.key as any)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const DistillationSetup = () => (
    <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Damıtma Düzeneği</h3>
      
      {/* Damıtma Düzeneği SVG */}
      <div className="relative bg-white p-8 rounded-lg border border-gray-200 mb-4">
        {(() => {
          const cycle = distillationData.length; // yeniden çizim için basit sayaç
          const ethanolWindow = temperature >= 78 && temperature <= 82;
          const waterWindow = temperature > 90;
          const showBoil = temperature >= 70;
          const condenserColor = coolingOn ? '#3B82F6' : '#9CA3AF';
          const receiverLevel = Math.min(1, collectedVolume / 100); // 0-100 mL aralığı
          const vaporSpeed = ethanolWindow ? 3 : waterWindow ? 2 : 0;
          const bubbleCount = showBoil ? 6 : 0;

          return (
            <svg viewBox="0 0 440 310" className="w-full h-72">
              {/* Balon Joje */}
              <ellipse cx="110" cy="210" rx="34" ry="54" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2"/>
              <rect x="92" y="154" width="36" height="56" fill="#E5E7EB" stroke="#6B7280" strokeWidth="2"/>
              <text x="110" y="268" textAnchor="middle" className="text-xs fill-gray-600">Balon Joje</text>

              {/* Balon içi kabarcıklar */}
              {Array.from({ length: bubbleCount }).map((_, i) => {
                const bx = 110 + Math.sin((cycle + i) * 0.7 + i) * 18;
                const by = 225 - ((cycle * 2 + i * 8) % 60);
                const br = 2 + (i % 3);
                return <circle key={`b${i}`} cx={bx} cy={by} r={br} fill="#93C5FD" opacity={0.8} />
              })}

              {/* Boyun: termometre */}
              <line x1="142" y1="125" x2="142" y2="185" stroke="#374151" strokeWidth="3"/>
              <circle cx="142" cy="120" r="3" fill="#EF4444"/>
              <text x="152" y="126" className="text-xs fill-gray-600">Termometre</text>

              {/* Soğutucu gövde */}
              <rect x="220" y="120" width="90" height="60" fill="#F3F4F6" stroke="#6B7280" strokeWidth="2"/>
              <line x1="220" y1="132" x2="310" y2="132" stroke={condenserColor} strokeWidth="3"/>
              <line x1="220" y1="168" x2="310" y2="168" stroke={condenserColor} strokeWidth="3"/>
              <text x="265" y="200" textAnchor="middle" className="text-xs fill-gray-600">Liebig Soğutucu</text>

              {/* Soğutucu akış okları */}
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={`flow${i}`} opacity={coolingOn ? 1 : 0.4}>
                  <polygon points={`${235 + ((cycle + i*20) % 80)} ,136 ${230 + ((cycle + i*20) % 80)} ,131 ${240 + ((cycle + i*20) % 80)} ,131`} fill={condenserColor} />
                  <polygon points={`${310 - ((cycle + i*20) % 80)} ,164 ${305 - ((cycle + i*20) % 80)} ,169 ${315 - ((cycle + i*20) % 80)} ,169`} fill={condenserColor} />
                </g>
              ))}

              {/* Buhar akışı - balondan soğutucuya */}
              {vaporSpeed > 0 && Array.from({ length: 5 }).map((_, i) => {
                const t = (cycle * vaporSpeed + i * 15) % 100;
                const x = 160 + (t * 0.6); // 160-220 arası
                const y = 150 - (t * 0.1); // hafif yükselerek gitsin
                return <circle key={`v${i}`} cx={x} cy={y} r={2} fill="#F59E0B" opacity={0.9} />
              })}

              {/* Alıcı Kap */}
              <ellipse cx="355" cy="255" rx="28" ry="34" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
              {/* Alıcı kap sıvı seviyesi */}
              <clipPath id="receiverClip">
                <ellipse cx="355" cy="255" rx="28" ry="34" />
              </clipPath>
              <rect x="327" y={255 - receiverLevel * 30} width="56" height={receiverLevel * 60} fill="#BFDBFE" clipPath="url(#receiverClip)" />
              <text x="355" y="298" textAnchor="middle" className="text-xs fill-gray-600">Alıcı Kap</text>

              {/* Bağlantı Boruları */}
              <line x1="142" y1="185" x2="220" y2="150" stroke="#6B7280" strokeWidth="3"/>
              <line x1="310" y1="150" x2="355" y2="225" stroke="#6B7280" strokeWidth="3"/>

              {/* Isı Kaynağı ve alev animasyonu */}
              <rect x="76" y="260" width="68" height="22" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
              <text x="110" y="290" textAnchor="middle" className="text-xs fill-gray-600">Isı Kaynağı</text>
              {(() => {
                const flameH = 8 + Math.max(0, flamePower / 15) + (cycle % 4);
                const flameW = 6 + Math.max(0, flamePower / 20);
                return (
                  <g>
                    <polygon points={`${110},${258 - flameH} ${110 - flameW},260 ${110 + flameW},260`} fill="#F59E0B" opacity={0.8} />
                    <polygon points={`${110},${260 - flameH/1.6} ${110 - flameW/2},260 ${110 + flameW/2},260`} fill="#FDE68A" opacity={0.9} />
                  </g>
                );
              })()}

              {/* Su Hortumları etiketleri */}
              <line x1="200" y1="100" x2="220" y2="132" stroke={condenserColor} strokeWidth="2"/>
              <line x1="310" y1="168" x2="330" y2="140" stroke={condenserColor} strokeWidth="2"/>
              <text x="205" y="92" className="text-xs" fill={condenserColor}>Su Girişi</text>
              <text x="330" y="130" className="text-xs" fill={condenserColor}>Su Çıkışı</text>
            </svg>
          );
        })()}
      </div>

      {/* Kontroller */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setCoolingOn(v => !v)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            coolingOn ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Soğutma {coolingOn ? 'Açık' : 'Kapalı'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Alev Şiddeti</span>
          <input
            type="range"
            min={0}
            max={100}
            value={flamePower}
            onChange={e => setFlamePower(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-sm font-medium text-gray-800 w-10 text-right">{flamePower}%</span>
        </div>

        <button
          onClick={startExperiment}
          disabled={isExperimentRunning}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isExperimentRunning 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isExperimentRunning ? 'Deney Devam Ediyor...' : 'Deneyi Başlat'}
        </button>
      </div>

      {/* Durum Göstergeleri */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Sıcaklık</span>
          </div>
          <div className="text-lg font-bold text-red-600">{temperature.toFixed(1)}°C</div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Toplanan Hacim</span>
          </div>
          <div className="text-lg font-bold text-blue-600">{collectedVolume.toFixed(1)} mL</div>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-4 h-4 inline-block rounded-full" style={{ background: coolingOn ? '#10B981' : '#9CA3AF' }} />
            <span className="text-sm font-medium">Soğutma</span>
          </div>
          <div className={`text-lg font-bold ${coolingOn ? 'text-green-700' : 'text-gray-600'}`}>{coolingOn ? 'Açık' : 'Kapalı'}</div>
        </div>
      </div>
    </div>
  );

  const ExperimentPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center gap-2">
          <TestTube className="w-6 h-6" />
          Basit Damıtma Deneyi
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-3">Prosedür</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">1</span>
                <span>Soğutucu su akışını açın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">2</span>
                <span>Isı kaynağını düşük–orta seviyede başlatın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">3</span>
                <span>Termometre ~78–82°C olduğunda damıtma başlar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">4</span>
                <span>Damlama hızı ve sıcaklığı not edin</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      <DistillationSetup />
    </div>
  );

  const ObservationPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
          <Eye className="w-6 h-6" />
          Gözlem Kayıtları
        </h2>
        
        <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Zaman (dk)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Sıcaklık (°C)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Damla Hızı</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Hacim (mL)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-blue-800">Gözlem</th>
              </tr>
            </thead>
            <tbody>
              {distillationData.slice(-10).map((data, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-700">{data.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{data.temperature.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{data.dropRate} damla/sn</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{data.volume.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{data.observation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalysisPhase = () => {
    const ethanolPhase = distillationData.filter(d => d.temperature >= 78 && d.temperature <= 82);
    const waterPhase = distillationData.filter(d => d.temperature > 90);
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Veri Analizi
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Teori Özeti</h3>
              <p className="text-sm text-gray-700">
                1 atm'de etanol ~78°C, su ~100°C civarında kaynar. Daha düşük kaynama noktalı bileşen daha önce buharlaşıp soğutucuda yoğunlaşır ve alıcı kapta toplanır.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Damıtma Fazları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Etanol Fazı (78-82°C)</h4>
                  <p className="text-sm text-green-700">
                    Toplanan hacim: {ethanolPhase.reduce((sum, d) => sum + d.volume, 0).toFixed(1)} mL
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Su Fazı (&gt;90°C)</h4>
                  <p className="text-sm text-blue-700">
                    Toplanan hacim: {waterPhase.reduce((sum, d) => sum + d.volume, 0).toFixed(1)} mL
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Sonuç</h3>
              <p className="text-sm text-gray-700">
                Basit damıtma ile etil alkol–su karışımından, sıcaklığın ~78–82°C aralığında sabit kaldığı sürede etanolce zengin damıtık elde edildi.
              </p>
            </div>
            
            {hypothesis && (
              <div className={`mt-6 p-4 rounded-lg ${
                hypothesis === 'ethanol_first' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
              }`}>
                <h3 className={`font-semibold ${
                  hypothesis === 'ethanol_first' ? 'text-green-800' : 'text-red-800'
                } mb-2 flex items-center gap-2`}>
                  {hypothesis === 'ethanol_first' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  Hipotez Kontrolü
                </h3>
                <p className={`${
                  hypothesis === 'ethanol_first' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {hypothesis === 'ethanol_first'
                    ? 'Tebrikler! Hipoteziniz doğru. Etil alkol düşük kaynama noktası nedeniyle önce damıtıldı.'
                    : 'Hipoteziniz yanlış. Etil alkol düşük kaynama noktası nedeniyle önce damıtıldı.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ErrorsPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Hata Kaynakları ve İyileştirme
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-3">Olası Hata Kaynakları</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Aşırı ısıtma: sıçrama/taşma → kaynama taşı kullanın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Yetersiz soğutma: buhar kaybı → su debisini artırın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Termometre yanlış yerde: yanlış sıcaklık ölçümü</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Alev–etanol riski: alevi küçük tutun veya elektrikli ısıtıcı tercih edin</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-3">İyileştirme Önerileri</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Kaynama taşı kullanarak düzgün kaynama sağlayın</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Soğutucu su debisini optimize edin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Termometreyi doğru konuma yerleştirin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Güvenlik önlemlerini alın</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const EvaluationPhase = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border">
        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Değerlendirme
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3">Temel Kavramlar</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>Damıtma:</strong> Sıvı karışımlarını kaynama noktası farkından yararlanarak ayırma yöntemi
              </div>
              <div>
                <strong>Kaynama Noktası:</strong> Bir sıvının buhar basıncının atmosfer basıncına eşit olduğu sıcaklık
              </div>
              <div>
                <strong>Fraksiyonlu Damıtma:</strong> Farklı kaynama noktalı bileşenlerin ayrı ayrı toplanması
              </div>
              <div>
                <strong>Soğutucu:</strong> Buharı yoğunlaştırarak sıvı haline getiren düzenek
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-3">Öğrenme Çıktıları</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Kaynama noktası farkından yararlanarak karışımları ayırabilme</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Damıtma düzeneğini kurma ve kullanma</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Sıcaklık-zaman grafiğini analiz etme</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Güvenlik kurallarını uygulama</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'theory': return <TheoryPhase />;
      case 'materials': return <MaterialsPhase />;
      case 'safety': return <SafetyPhase />;
      case 'variables': return <VariablesPhase />;
      case 'setup': return <SetupPhase />;
      case 'hypothesis': return <HypothesisPhase />;
      case 'experiment': return <ExperimentPhase />;
      case 'observation': return <ObservationPhase />;
      case 'analysis': return <AnalysisPhase />;
      case 'errors': return <ErrorsPhase />;
      case 'evaluation': return <EvaluationPhase />;
      default: return <TheoryPhase />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧪 7. Sınıf - Basit Damıtma Deneyi
          </h1>
          <p className="text-lg text-gray-600">
            Etil Alkol-Su Karışımının Ayrılması
          </p>
        </div>

        {/* Phase Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={`phase-indicator ${
                  currentPhase === phase.id
                    ? 'phase-active'
                    : phases.findIndex(p => p.id === currentPhase) > index
                    ? 'phase-completed'
                    : 'phase-pending'
                }`}
                onClick={() => setCurrentPhase(phase.id)}
              >
                {phases.findIndex(p => p.id === currentPhase) > index ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              {phases.find(p => p.id === currentPhase)?.icon}
              {phases.find(p => p.id === currentPhase)?.title}
            </h2>
          </div>
        </div>

        {/* Phase Content */}
        <div className="mb-8">
          {renderCurrentPhase()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevPhase}
            disabled={phases.findIndex(p => p.id === currentPhase) === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Geri
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {phases.findIndex(p => p.id === currentPhase) + 1} / {phases.length}
            </span>
          </div>
          
          <button
            onClick={nextPhase}
            disabled={phases.findIndex(p => p.id === currentPhase) === phases.length - 1}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Devam Et
            <RotateCcw className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistillationExperiment;
