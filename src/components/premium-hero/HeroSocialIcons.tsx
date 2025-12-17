import React from 'react';
import { COMPANY_INFO } from '../../data/mockData';
import { Icon } from '@iconify/react';

const HeroSocialIcons: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: 'mdi:instagram',
      url: COMPANY_INFO.social.instagram,
      color: 'hover:text-pink-400'
    },
    {
      name: 'Facebook',
      icon: 'mdi:facebook',
      url: COMPANY_INFO.social.facebook,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Twitter',
      icon: 'mdi:twitter',
      url: '#',
      color: 'hover:text-cyan-400'
    }
  ];

  return (
    <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-4 sm:gap-6">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white/40 ${social.color} transition-all duration-300 hover:scale-110`}
            aria-label={social.name}
          >
            <Icon icon={social.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default HeroSocialIcons;

