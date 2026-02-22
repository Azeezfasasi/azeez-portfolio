'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const LanguageIcon = ({ icon, name }) => {
  // Check if icon is an image URL
  if (icon?.startsWith('http') || icon?.startsWith('data:')) {
    return (
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // For emoji or text-based icons
  return (
    <div className="w-16 h-16 flex items-center justify-center text-4xl">
      {icon}
    </div>
  );
};

export default function MyLanguagesServices() {
  const [languages, setLanguages] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [langRes, servRes] = await Promise.all([
        fetch('/api/language-services?type=language'),
        fetch('/api/language-services?type=service'),
      ]);

      if (!langRes.ok || !servRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const langData = await langRes.json();
      const servData = await servRes.json();

      setLanguages(langData.data || []);
      setServices(servData.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching languages and services:', err);
      setError(err.message);
      // Set default data if fetch fails
      setLanguages(defaultLanguages);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const defaultLanguages = [
    { _id: '1', name: 'React', icon: '⚛️' },
    { _id: '2', name: 'HTML', icon: '🔴' },
    { _id: '3', name: 'CSS', icon: '🟦' },
    { _id: '4', name: 'Tailwind CSS', icon: '💨' },
    { _id: '5', name: 'JavaScript', icon: '📝' },
    { _id: '6', name: 'WordPress', icon: '🔵' },
  ];

  const defaultServices = [
    {
      _id: '1',
      name: 'Web Design and Development',
      description: 'Create stunning and functional websites tailored to your needs',
      image: '/images/services/web-design.jpg',
    },
    {
      _id: '2',
      name: 'Website Management',
      description: 'Professional maintenance and updates for your online presence',
      image: '/images/services/website-management.jpg',
    },
    {
      _id: '3',
      name: 'Tutorship',
      description: 'Learn web development and programming from expert instructors',
      image: '/images/services/tutorship.jpg',
    },
    {
      _id: '4',
      name: 'IT Consultancy',
      description: 'Strategic tech solutions to drive your business forward',
      image: '/images/services/it-consultancy.jpg',
    },
  ];

  const displayLanguages = languages.length > 0 ? languages : defaultLanguages;
  const displayServices = services.length > 0 ? services : defaultServices;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[url('/img/Hero.svg')] bg-cover bg-center relative">
      <div className="max-w-7xl mx-auto bg-white/60 p-10 rounded-xl shadow-lg backdrop-blur-[25px]">
        {/* Languages Section */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Languages
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {displayLanguages.map((lang) => (
              <div
                key={lang._id}
                className="group flex flex-col items-center justify-center p-5 sm:p-6 lg:p-8 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 cursor-pointer"
              >
                <div className="mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <LanguageIcon icon={lang.icon} name={lang.name} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 text-center group-hover:text-blue-600 transition-colors line-clamp-2">
                  {lang.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Services
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {displayServices.map((service) => (
              <div
                key={service._id}
                className="group h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Service Image */}
                <div className="relative w-full h-full">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-6xl opacity-50">💼</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                    <div className="w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
