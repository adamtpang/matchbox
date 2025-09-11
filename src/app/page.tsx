'use client'

import React, { useState } from 'react'

interface Item {
  id: number
  name: string
  description: string
  cost: number
  pledged: number
  image: string
}

const initialItems: Item[] = [
  {
    id: 1,
    name: 'Drum Kit',
    description: 'Professional acoustic drum set for community music sessions',
    cost: 500,
    pledged: 125,
    image: '🥁'
  },
  {
    id: 2,
    name: 'Projector',
    description: 'High-resolution projector for presentations and movie nights',
    cost: 300,
    pledged: 75,
    image: '📽️'
  },
  {
    id: 3,
    name: 'Folding Tables',
    description: 'Set of 6 portable folding tables for events and workshops',
    cost: 150,
    pledged: 90,
    image: '🪑'
  }
]

export default function Home() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [suggestion, setSuggestion] = useState('')

  const handlePledge = (id: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, pledged: item.pledged + 25 } 
        : item
    ))
  }

  const handleSuggestion = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New suggestion:', suggestion)
    setSuggestion('')
    alert('Thank you for your suggestion!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Matchbox</h1>
          <p className="text-lg text-gray-600">Network School Community Crowdfunding</p>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {items.map(item => {
            const nsMatch = item.pledged
            const totalRaised = item.pledged + nsMatch
            const progress = Math.min((totalRaised / item.cost) * 100, 100)
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="text-4xl text-center mb-4">{item.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>${totalRaised} / ${item.cost}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Community pledged:</span>
                      <span className="font-medium">${item.pledged}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">NS match (1:1):</span>
                      <span className="font-medium">${nsMatch}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total raised:</span>
                      <span>${totalRaised}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePledge(item.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    disabled={totalRaised >= item.cost}
                  >
                    {totalRaised >= item.cost ? 'Fully Funded!' : 'Pledge $25'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Suggestion Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Suggest an Item</h2>
          <form onSubmit={handleSuggestion} className="space-y-4">
            <div>
              <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to see funded?
              </label>
              <textarea
                id="suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the item, its purpose, and estimated cost..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Submit Suggestion
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}