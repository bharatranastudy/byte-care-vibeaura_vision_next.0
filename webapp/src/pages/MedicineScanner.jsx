import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCamera, 
  FaUpload, 
  FaQrcode, 
  FaSearch, 
  FaPills,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaFileImage,
  FaTrash
} from 'react-icons/fa';

const MedicineScanner = () => {
  const [scannedImage, setScannedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      medicineName: 'Paracetamol 500mg',
      scannedAt: '2024-09-15',
      dosage: '500mg',
      manufacturer: 'Generic Pharma',
      expiryDate: '2025-12-31',
      batchNumber: 'PCM2024001'
    },
    {
      id: 2,
      medicineName: 'Amoxicillin 250mg',
      scannedAt: '2024-09-10',
      dosage: '250mg',
      manufacturer: 'MediCorp',
      expiryDate: '2025-06-30',
      batchNumber: 'AMX2024002'
    }
  ]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScannedImage(e.target.result);
        performOCR(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScannedImage(e.target.result);
        performOCR(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const API_BASE = process.env.REACT_APP_API_URL || '';

  const performOCR = async (imageData) => {
    try {
      setIsScanning(true);
      const res = await fetch(`${API_BASE}/api/ocr/medicine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imageData })
      });
      const data = await res.json();
      const result = {
        medicineName: data.medicineName || 'Unknown',
        manufacturer: data.manufacturer || 'Unknown',
        batchNumber: data.batchNumber || 'N/A',
        expiryDate: data.expiryDate || 'N/A',
        dosage: data.dosage || 'N/A',
        composition: data.composition || (data.medicineName ? `${data.medicineName}` : 'N/A'),
        indications: data.indications || 'General usage information not available',
        dosageInstructions: data.dosageInstructions || 'Follow clinician guidance or package instructions',
        sideEffects: data.sideEffects || 'Consult leaflet/clinician',
        contraindications: data.contraindications || 'Consult clinician if uncertain',
        storage: data.storage || 'Store in a cool, dry place',
        warnings: data.warnings || 'Use as directed'
      };
      setScanResult(result);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        ...result,
        scannedAt: new Date().toISOString().split('T')[0]
      };
      setScanHistory([newHistoryItem, ...scanHistory]);
    } catch (e) {
      console.error('OCR error', e);
    } finally {
      setIsScanning(false);
    }
  };

  const clearScan = () => {
    setScannedImage(null);
    setScanResult(null);
  };

  const quickScanOptions = [
    {
      title: 'Upload Photo',
      icon: <FaUpload className="text-2xl text-blue-500" />,
      description: 'Upload medicine package photo',
      action: () => fileInputRef.current?.click(),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Take Photo',
      icon: <FaCamera className="text-2xl text-green-500" />,
      description: 'Use camera to scan medicine',
      action: () => cameraInputRef.current?.click(),
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'QR Code',
      icon: <FaQrcode className="text-2xl text-purple-500" />,
      description: 'Scan medicine QR code',
      action: () => alert('QR Code scanner coming soon!'),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Manual Search',
      icon: <FaSearch className="text-2xl text-orange-500" />,
      description: 'Search medicine database',
      action: () => alert('Manual search coming soon!'),
      color: 'from-orange-500 to-yellow-500'
    }
  ];

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
          <h1 className="text-4xl font-bold font-display text-white mb-4">
            Medicine Scanner
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Scan medicine packages to get detailed information about dosage, side effects, 
            expiry dates, and safety warnings using advanced OCR technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Scan Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Scan Medicine</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickScanOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty('--x', `${x}px`);
                      e.currentTarget.style.setProperty('--y', `${y}px`);
                    }}
                    className={`group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover-spotlight ${
                      index === 0 ? 'spotlight-cyan' : index === 1 ? 'spotlight-emerald' : index === 2 ? 'spotlight-purple' : 'spotlight-amber'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                    <div className="relative z-10 text-center">
                      <div className="mb-4">{option.icon}</div>
                      <h3 className="text-lg font-semibold font-display text-white mb-2">{option.title}</h3>
                      <p className="text-sm text-gray-300">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </motion.div>

            {/* Scanned Image Display */}
            {scannedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Scanned Image</h3>
                  <button
                    onClick={clearScan}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={scannedImage}
                    alt="Scanned medicine"
                    className="w-full max-h-64 object-contain rounded-lg border border-white/10"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Analyzing medicine package...</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Scan Results */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Scan Results</h3>
                
                {/* Medicine Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Medicine Name</label>
                      <p className="text-lg font-semibold text-white">{scanResult.medicineName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Manufacturer</label>
                      <p className="text-gray-300">{scanResult.manufacturer}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Batch Number</label>
                      <p className="text-gray-300">{scanResult.batchNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Dosage</label>
                      <p className="text-lg font-semibold text-cyan-300">{scanResult.dosage}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                      <p className="text-gray-300">{scanResult.expiryDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Composition</label>
                      <p className="text-gray-300">{scanResult.composition}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  <div className="p-4 bg-blue-500/15 border-l-4 border-blue-500 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaInfoCircle className="text-blue-500" />
                      <h4 className="font-semibold text-blue-300">Indications</h4>
                    </div>
                    <p className="text-blue-200">{scanResult.indications}</p>
                  </div>

                  <div className="p-4 bg-green-500/15 border-l-4 border-green-500 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCheckCircle className="text-green-500" />
                      <h4 className="font-semibold text-green-300">Dosage Instructions</h4>
                    </div>
                    <p className="text-green-200">{scanResult.dosageInstructions}</p>
                  </div>

                  <div className="p-4 bg-yellow-500/15 border-l-4 border-yellow-500 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaExclamationTriangle className="text-yellow-500" />
                      <h4 className="font-semibold text-yellow-300">Side Effects</h4>
                    </div>
                    <p className="text-yellow-200">{scanResult.sideEffects}</p>
                  </div>

                  <div className="p-4 bg-red-500/15 border-l-4 border-red-500 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaExclamationTriangle className="text-red-500" />
                      <h4 className="font-semibold text-red-300">Contraindications</h4>
                    </div>
                    <p className="text-red-200">{scanResult.contraindications}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Storage</h4>
                      <p className="text-gray-300">{scanResult.storage}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-semibold text-white mb-2">Warnings</h4>
                      <p className="text-gray-300">{scanResult.warnings}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scan History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--x', `${x}px`);
                e.currentTarget.style.setProperty('--y', `${y}px`);
              }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md hover:shadow-2xl hover-spotlight spotlight-indigo"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Scans</h3>
              <div className="space-y-3">
                {scanHistory.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <FaPills className="text-blue-400 text-sm" />
                      <h4 className="font-medium text-white text-sm">{item.medicineName}</h4>
                    </div>
                    <p className="text-xs text-gray-300">Scanned: {item.scannedAt}</p>
                    <p className="text-xs text-gray-300">Expires: {item.expiryDate}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Safety Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--x', `${x}px`);
                e.currentTarget.style.setProperty('--y', `${y}px`);
              }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:shadow-2xl hover-spotlight spotlight-amber"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Always check expiry dates before taking medicine</li>
                <li>• Store medicines in cool, dry places</li>
                <li>• Never share prescription medicines</li>
                <li>• Read all warnings and contraindications</li>
                <li>• Consult a doctor for drug interactions</li>
                <li>• Keep medicines away from children</li>
              </ul>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--x', `${x}px`);
                e.currentTarget.style.setProperty('--y', `${y}px`);
              }}
              className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 backdrop-blur-md hover:shadow-2xl hover-spotlight spotlight-rose"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Contacts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Poison Control:</span>
                  <span className="font-medium text-white">1066</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Medical Emergency:</span>
                  <span className="font-medium text-white">108</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Health Helpline:</span>
                  <span className="font-medium text-white">1075</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineScanner;
