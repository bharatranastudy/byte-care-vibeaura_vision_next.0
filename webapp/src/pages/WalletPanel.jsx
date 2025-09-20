import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWallet, 
  FaCoins, 
  FaEthereum, 
  FaExchangeAlt, 
  FaHistory,
  FaGift,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaMinus,
  FaChartLine,
  FaTrophy,
  FaShoppingCart,
  FaCopy
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const WalletPanel = () => {
  const { wallet, updateWallet } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'earned', amount: 50, description: 'Health quiz completion', date: '2024-09-15', status: 'completed' },
    { id: 2, type: 'earned', amount: 25, description: 'Symptom check', date: '2024-09-14', status: 'completed' },
    { id: 3, type: 'spent', amount: 30, description: 'Premium consultation', date: '2024-09-13', status: 'completed' },
    { id: 4, type: 'earned', amount: 75, description: 'Vaccination reminder set', date: '2024-09-12', status: 'completed' },
    { id: 5, type: 'earned', amount: 100, description: 'Monthly health goal achieved', date: '2024-09-10', status: 'completed' }
  ]);

  const [rewards, setRewards] = useState([
    { id: 1, title: 'Free Health Consultation', cost: 100, description: '30-minute consultation with certified doctor', category: 'healthcare' },
    { id: 2, title: 'Premium Health Report', cost: 75, description: 'Detailed health analysis and recommendations', category: 'reports' },
    { id: 3, title: 'Medicine Discount Coupon', cost: 50, description: '20% off on online medicine purchases', category: 'discounts' },
    { id: 4, title: 'Fitness Tracker Discount', cost: 200, description: '50% off on fitness tracking devices', category: 'devices' },
    { id: 5, title: 'Health Insurance Discount', cost: 150, description: '10% off on health insurance premium', category: 'insurance' }
  ]);

  const walletAddress = '0x742d35Cc6634C0532925a3b8D4C4d1c8b8b8b8b8';
  const [balance, setBalance] = useState(wallet.balance || 0.125);
  const [tokens, setTokens] = useState(wallet.tokens || 350);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaWallet /> },
    { id: 'transactions', label: 'Transactions', icon: <FaHistory /> },
    { id: 'rewards', label: 'Rewards', icon: <FaGift /> },
    { id: 'exchange', label: 'Exchange', icon: <FaExchangeAlt /> }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleRewardPurchase = (reward) => {
    if (tokens >= reward.cost) {
      setTokens(tokens - reward.cost);
      updateWallet({ tokens: tokens - reward.cost });
      // Add transaction
      const newTransaction = {
        id: Date.now(),
        type: 'spent',
        amount: reward.cost,
        description: `Purchased: ${reward.title}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      setTransactions([newTransaction, ...transactions]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Health Wallet
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your blockchain-based health tokens, track earnings from health activities, 
            and redeem rewards for healthcare services.
          </p>
        </motion.div>

        {/* Wallet Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">ETH Balance</h3>
              <FaEthereum className="text-2xl" />
            </div>
            <div className="text-3xl font-bold mb-2">{balance} ETH</div>
            <p className="text-purple-100 text-sm">≈ ${(balance * 2500).toFixed(2)} USD</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Health Tokens</h3>
              <FaCoins className="text-2xl" />
            </div>
            <div className="text-3xl font-bold mb-2">{tokens} HT</div>
            <p className="text-green-100 text-sm">Earned through health activities</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Earned</h3>
              <FaTrophy className="text-2xl" />
            </div>
            <div className="text-3xl font-bold mb-2">1,250 HT</div>
            <p className="text-orange-100 text-sm">All-time earnings</p>
          </motion.div>
        </div>

        {/* Wallet Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Address</h3>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <span className="font-mono text-sm text-gray-700">{walletAddress}</span>
            <button
              onClick={() => copyToClipboard(walletAddress)}
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FaCopy />
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {transaction.type === 'earned' ? (
                              <FaArrowUp className="text-green-500" />
                            ) : (
                              <FaArrowDown className="text-red-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{transaction.date}</p>
                            </div>
                          </div>
                          <span className={`font-semibold ${
                            transaction.type === 'earned' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} HT
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Earning Opportunities</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Daily health check-in</span>
                        <span className="text-green-600 font-semibold">+10 HT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Complete health quiz</span>
                        <span className="text-green-600 font-semibold">+50 HT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Vaccination reminder</span>
                        <span className="text-green-600 font-semibold">+25 HT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Monthly health goal</span>
                        <span className="text-green-600 font-semibold">+100 HT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h4>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'earned' ? (
                            <FaArrowUp className="text-green-500" />
                          ) : (
                            <FaArrowDown className="text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${
                          transaction.type === 'earned' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'earned' ? '+' : '-'}{transaction.amount} HT
                        </span>
                        <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-900">{reward.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {reward.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">{reward.cost} HT</span>
                        <button
                          onClick={() => handleRewardPurchase(reward)}
                          disabled={tokens < reward.cost}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
                        >
                          {tokens >= reward.cost ? 'Redeem' : 'Insufficient Tokens'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exchange Tab */}
            {activeTab === 'exchange' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Token Exchange</h4>
                  <p className="text-gray-600">Convert between ETH and Health Tokens</p>
                </div>
                
                <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="0.00"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>ETH</option>
                          <option>HT</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button className="p-2 bg-blue-100 rounded-full">
                        <FaExchangeAlt className="text-blue-500" />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="0.00"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>HT</option>
                          <option>ETH</option>
                        </select>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
                      Exchange Tokens
                    </button>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Exchange Rate: 1 ETH = 1000 HT</p>
                  <p>Network Fee: 0.001 ETH</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPanel;
