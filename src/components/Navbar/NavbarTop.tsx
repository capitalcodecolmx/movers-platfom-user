import React from 'react';
import { COMPANY_INFO } from '../../data/mockData';
import { Icon } from '@iconify/react';

const NavbarTop: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white py-2.5 px-4 text-sm hidden md:block">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex space-x-6">
                    <a
                        href={`tel:${COMPANY_INFO.phone}`}
                        className="flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200"
                    >
                        <Icon icon="ph:phone-fill" width="14" height="14" />
                        <span>{COMPANY_INFO.phone}</span>
                    </a>
                    <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="flex items-center gap-2 hover:text-cyan-300 transition-colors duration-200"
                    >
                        <Icon icon="ph:envelope-fill" width="14" height="14" />
                        <span>{COMPANY_INFO.email}</span>
                    </a>
                </div>
                <div className="flex items-center space-x-4">
                    <a
                        href={COMPANY_INFO.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors duration-200"
                    >
                        <Icon icon="ri:facebook-fill" width="14" height="14" />
                        <span className="text-xs">Facebook</span>
                    </a>
                    <a
                        href={COMPANY_INFO.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors duration-200"
                    >
                        <Icon icon="ri:instagram-fill" width="14" height="14" />
                        <span className="text-xs">Instagram</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NavbarTop;
