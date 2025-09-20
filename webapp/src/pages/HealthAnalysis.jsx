import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeartbeat, 
  FaThermometerHalf, 
  FaEye, 
  FaLungs, 
  FaBrain,
  FaStethoscope,
  FaMicrophone,
  FaCamera,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const HealthAnalysis = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [duration, setDuration] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recording, setRecording] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const micRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addSymptom } = useApp();
  const API_BASE = process.env.REACT_APP_API_URL || '';

  // Mouse-follow spotlight handler for cards
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--x', `${x}px`);
    e.currentTarget.style.setProperty('--y', `${y}px`);
  };

  // Voice input using Web Speech API
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.lang = 'en-IN';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    micRef.current = recog;
    setRecording(true);
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSelectedSymptom(text);
    };
    recog.onend = () => setRecording(false);
    recog.onerror = () => setRecording(false);
    recog.start();
  };

  const stopVoice = () => {
    if (micRef.current) {
      micRef.current.stop();
      setRecording(false);
    }
  };

  // Image analyze
  const onImageSelected = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const res = await fetch(`${API_BASE}/api/image/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_base64: e.target.result })
        });
        const data = await res.json();
        setImageAnalysis(data);
      } catch (err) {
        console.error('image analyze error', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const commonSymptoms = [
    { name: 'Fever', icon: <FaThermometerHalf />, category: 'General' },
    { name: 'Headache', icon: <FaBrain />, category: 'Neurological' },
    { name: 'Cough', icon: <FaLungs />, category: 'Respiratory' },
    { name: 'Sore Throat', icon: <FaStethoscope />, category: 'Respiratory' },
    { name: 'Fatigue', icon: <FaHeartbeat />, category: 'General' },
    { name: 'Nausea', icon: <FaStethoscope />, category: 'Digestive' },
    { name: 'Dizziness', icon: <FaBrain />, category: 'Neurological' },
    { name: 'Chest Pain', icon: <FaHeartbeat />, category: 'Cardiovascular' },
    { name: 'Shortness of Breath', icon: <FaLungs />, category: 'Respiratory' },
    { name: 'Abdominal Pain', icon: <FaStethoscope />, category: 'Digestive' },
    { name: 'Joint Pain', icon: <FaHeartbeat />, category: 'Musculoskeletal' },
    { name: 'Skin Rash', icon: <FaEye />, category: 'Dermatological' }
  ];

  const handleAddSymptom = () => {
    if (selectedSymptom && duration) {
      const newSymptom = {
        id: Date.now(),
        name: selectedSymptom,
        severity,
        duration,
        timestamp: new Date()
      };
      setSymptoms([...symptoms, newSymptom]);
      addSymptom(newSymptom);
      setSelectedSymptom('');
      setDuration('');
    }
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const result = generateAnalysis(symptoms);
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateAnalysis = (symptoms) => {
    const hasRespiratory = symptoms.some(s => 
      ['Cough', 'Sore Throat', 'Shortness of Breath'].includes(s.name)
    );
    const hasFever = symptoms.some(s => s.name === 'Fever');
    const hasHeadache = symptoms.some(s => s.name === 'Headache');

    if (hasRespiratory && hasFever) {
      return {
        condition: 'Possible Respiratory Infection',
        severity: 'Moderate',
        confidence: 75,
        recommendations: [
          'Rest and stay hydrated',
          'Monitor temperature regularly',
          'Consider consulting a healthcare provider if symptoms worsen',
          'Isolate if symptoms suggest viral infection'
        ],
        urgency: 'medium'
      };
    } else if (hasHeadache && hasFever) {
      return {
        condition: 'Possible Viral Syndrome',
        severity: 'Mild to Moderate',
        confidence: 70,
        recommendations: [
          'Get adequate rest',
          'Stay hydrated with fluids',
          'Take over-the-counter pain relievers as needed',
          'Seek medical attention if symptoms persist beyond 3 days'
        ],
        urgency: 'low'
      };
    } else {
      return {
        condition: 'General Symptom Assessment',
        severity: 'Variable',
        confidence: 60,
        recommendations: [
          'Monitor symptoms closely',
          'Maintain good hygiene and rest',
          'Consult healthcare provider for persistent symptoms',
          'Keep a symptom diary for tracking'
        ],
        urgency: 'low'
      };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200';
      default: return 'text-green-500 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="container-1200 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold tracking-tight font-display mb-4">
            <span className="gradient-text">AI Health Analysis</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Describe your symptoms and get AI-powered preliminary health assessment. 
            Remember, this is not a substitute for professional medical advice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onMouseMove={handleMove}
            className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover-spotlight spotlight-indigo"
          >
            <h2 className="text-2xl font-bold mb-6">Add Symptoms</h2>
            
            {/* Common Symptoms Grid */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Common Symptoms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonSymptoms.map((symptom, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSymptom(symptom.name)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-2 ${
                      selectedSymptom === symptom.name
                        ? 'border-indigo-400 bg-indigo-500/10'
                        : 'border-white/10 hover:border-indigo-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xl">{symptom.icon}</div>
                    <span className="text-sm font-medium text-center">{symptom.name}</span>
                  </button>
                ))}
              </div>
            </div>

          {/* Symptom Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 days, 1 week"
                className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Voice & Image Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={recording ? stopVoice : startVoice}
                className={`w-full py-3 ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg flex items-center justify-center space-x-2 transition-colors`}
              >
                <FaMicrophone />
                <span>{recording ? 'Stop Recording' : 'Speak Symptoms'}</span>
              </button>
              <label className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer">
                <FaCamera />
                <span>Upload Symptom Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e)=> e.target.files?.[0] && onImageSelected(e.target.files[0])} />
              </label>
            </div>

            <button
              onClick={handleAddSymptom}
              disabled={!selectedSymptom || !duration}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              Add Symptom
            </button>
          </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Current Symptoms */}
            <div onMouseMove={handleMove} className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover-spotlight spotlight-purple">
              <h2 className="text-2xl font-bold mb-4">Current Symptoms</h2>
              {symptoms.length > 0 ? (
                <div className="space-y-3">
                  {symptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{symptom.name}</h4>
                        <p className="text-sm text-gray-300">
                          {symptom.severity} • {symptom.duration}
                        </p>
                      </div>
                      <button
                        onClick={() => setSymptoms(symptoms.filter(s => s.id !== symptom.id))}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No symptoms added yet. Select symptoms from the left panel to get started.
                </p>
              )}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Analyze Symptoms</span>
                  </>
                )}
              </button>
            </div>

            {imageAnalysis && (
              <div onMouseMove={handleMove} className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover-spotlight spotlight-rose">
                <h2 className="text-2xl font-bold mb-4">Image Analysis</h2>
                <p className="text-gray-300 mb-2">Tags: {imageAnalysis.tags?.join(', ') || 'N/A'}</p>
                <p className="text-gray-400 mb-4">Confidence: {(imageAnalysis.confidence*100 || 0).toFixed(0)}%</p>
                <div className="space-y-2">
                  {imageAnalysis.recommendations?.map((r, i)=> (
                    <div key={i} className="flex items-start space-x-2">
                      <FaInfoCircle className="text-blue-400 mt-1" />
                      <p className="text-gray-300">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onMouseMove={handleMove}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 hover-spotlight spotlight-cyan"
              >
                <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
                
                <div className={`p-4 rounded-lg border mb-4 ${getUrgencyColor(analysisResult.urgency)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaInfoCircle />
                    <h3 className="font-bold">{analysisResult.condition}</h3>
                  </div>
                  <p className="text-sm">
                    Severity: {analysisResult.severity} • 
                    Confidence: {analysisResult.confidence}%
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Recommendations:</h4>
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
                  <div className="flex items-center space-x-2">
                    <FaExclamationTriangle className="text-yellow-400" />
                    <p className="text-sm text-yellow-300 font-medium">
                      Disclaimer: This is an AI-generated preliminary assessment. 
                      Always consult with a qualified healthcare professional for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysis;
