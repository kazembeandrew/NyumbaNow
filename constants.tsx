import React from 'react';
import { UserRole, ListingCategory } from './types';
import type { Listing, Conversation, Message, Notification, Landlord, Review } from './types';

export const MOCK_LANDLORDS: Landlord[] = [
    { id: 1, name: 'John Phiri' },
    { id: 2, name: 'Jane Banda' },
    { id: 3, name: 'Thoko Moyo' },
    { id: 4, name: 'Events & Co.' },
    { id: 5, name: 'AutoDeals Malawi' },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    authorName: 'Chris M',
    rating: 5,
    comment: 'Amazing place! The landlord was very helpful and the location is perfect. Highly recommend.',
    timestamp: '2 weeks ago',
    authorImageUrl: 'https://picsum.photos/seed/rev1/100',
  },
  {
    id: 2,
    authorName: 'Linda P',
    rating: 4,
    comment: 'Great value for money. The house was clean and spacious. Minor issue with the plumbing but it was fixed promptly.',
    timestamp: '1 month ago',
    authorImageUrl: 'https://picsum.photos/seed/rev2/100',
  },
  {
    id: 3,
    authorName: 'Samuel J',
    rating: 4,
    comment: 'The flat is modern and well-maintained. The security is top-notch. My only complaint is the noise from the nearby road.',
    timestamp: '3 days ago',
    authorImageUrl: 'https://picsum.photos/seed/rev3/100',
  },
];


export const MOCK_LISTINGS: Listing[] = [
  {
    id: 1,
    title: '3 Bedroom in Area 49',
    price: 180000,
    priceType: 'per month',
    location: 'Area 49, Lilongwe',
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://picsum.photos/seed/house1/400/300',
    description: 'A beautiful and spacious 3-bedroom house located in a serene neighborhood of Area 49. Perfect for a family, with modern amenities and a large garden.',
    images: ['https://picsum.photos/seed/house1a/800/600', 'https://picsum.photos/seed/house1b/800/600', 'https://picsum.photos/seed/house1c/800/600'],
    status: 'Pending',
    sellerId: 1,
    sellerName: 'John Phiri',
    category: ListingCategory.HOUSE_RENTAL,
    phoneNumber: '+265999123456',
    email: 'john.phiri@example.com',
    reviews: MOCK_REVIEWS.slice(0, 2),
  },
  {
    id: 2,
    title: 'Modern 2 Bedroom Flat',
    price: 250000,
    priceType: 'per month',
    location: 'Nyambadwe, Blantyre',
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://picsum.photos/seed/house2/400/300',
    description: 'A stylish and modern 2-bedroom flat in the heart of Nyambadwe. Close to shopping centers and schools. Comes fully furnished with 24/7 security.',
    images: ['https://picsum.photos/seed/house2a/800/600', 'https://picsum.photos/seed/house2b/800/600'],
    status: 'Available',
    sellerId: 2,
    sellerName: 'Jane Banda',
    category: ListingCategory.HOUSE_RENTAL,
    phoneNumber: '+265888789012',
    email: 'jane.banda.agent@example.com',
    reviews: [MOCK_REVIEWS[2]],
  },
  {
    id: 5,
    title: 'Lakeside Wedding Venue',
    price: 300000,
    priceType: 'per day',
    location: 'Mangochi, Lake Malawi',
    imageUrl: 'https://picsum.photos/seed/venue1/400/300',
    description: 'Stunning lakeside venue perfect for weddings, corporate events, and parties. Includes seating for 150 guests and a catering area.',
    images: ['https://picsum.photos/seed/venue1a/800/600', 'https://picsum.photos/seed/venue1b/800/600'],
    status: 'Available',
    sellerId: 4,
    sellerName: 'Events & Co.',
    category: ListingCategory.EVENT_VENUE_HIRE,
    phoneNumber: '+265991112233',
    email: 'events@example.com',
  },
  {
    id: 6,
    title: 'Toyota Hilux for Hire',
    price: 60000,
    priceType: 'per day',
    location: 'Blantyre',
    imageUrl: 'https://picsum.photos/seed/car1/400/300',
    description: 'Reliable Toyota Hilux 4x4 available for daily hire. Perfect for both city driving and off-road adventures. Driver available upon request.',
    images: ['https://picsum.photos/seed/car1a/800/600'],
    status: 'Available',
    sellerId: 5,
    sellerName: 'AutoDeals Malawi',
    category: ListingCategory.CAR_HIRE,
    phoneNumber: '+265888445566',
    email: 'autodeals@example.com',
  },
  {
    id: 7,
    title: '4 Bedroom House for Sale',
    price: 85000000,
    priceType: 'one-time',
    location: 'Area 10, Lilongwe',
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: 'https://picsum.photos/seed/housesale1/400/300',
    description: 'A beautiful family home for sale in the prestigious Area 10. Features a large garden, swimming pool, and staff quarters.',
    images: ['https://picsum.photos/seed/housesale1a/800/600', 'https://picsum.photos/seed/housesale1b/800/600'],
    status: 'Available',
    sellerId: 2,
    sellerName: 'Jane Banda',
    category: ListingCategory.HOUSE_SALE,
    phoneNumber: '+265888789012',
    email: 'jane.banda.agent@example.com',
  },
  {
    id: 8,
    title: 'Slightly Used Dell Laptop',
    price: 350000,
    priceType: 'one-time',
    location: 'Zomba',
    imageUrl: 'https://picsum.photos/seed/laptop1/400/300',
    description: 'Dell Latitude E7450, Core i5, 8GB RAM, 256GB SSD. In excellent condition with long battery life. Perfect for students and professionals.',
    images: ['https://picsum.photos/seed/laptop1a/800/600'],
    status: 'Available',
    sellerId: 3,
    sellerName: 'Thoko Moyo',
    category: ListingCategory.ELECTRONICS_SALE,
    phoneNumber: '+265884556677',
    email: 'thoko.moyo.agent@example.com',
  },
   {
    id: 3,
    title: 'Cozy 1 Bedroom Cottage',
    price: 95000,
    priceType: 'per month',
    location: 'Kaning\'ina, Mzuzu',
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: 'https://picsum.photos/seed/house3/400/300',
    description: 'A cozy and private 1-bedroom cottage with a beautiful garden. Ideal for a single professional or a couple. Water and electricity included.',
    images: ['https://picsum.photos/seed/house3a/800/600'],
    status: 'Rented',
    sellerId: 1,
    sellerName: 'John Phiri',
    category: ListingCategory.HOUSE_RENTAL,
    phoneNumber: '+265991223344',
    email: 'john.phiri@example.com',
  },
    {
    id: 4,
    title: '4 Bedroom Villa',
    price: 450000,
    priceType: 'per month',
    location: 'Zomba Central',
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: 'https://picsum.photos/seed/house4/400/300',
    description: 'A luxurious 4-bedroom villa with a swimming pool and stunning views of Zomba Plateau. Perfect for executive living. Ample parking space available.',
    images: ['https://picsum.photos/seed/house4a/800/600', 'https://picsum.photos/seed/house4b/800/600', 'https://picsum.photos/seed/house4c/800/600'],
    status: 'Under Maintenance',
    sellerId: 3,
    sellerName: 'Thoko Moyo',
    category: ListingCategory.HOUSE_RENTAL,
    phoneNumber: '+265884556677',
    email: 'thoko.moyo.agent@example.com',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    { id: 1, name: 'Seller - John Phiri', lastMessage: 'Yes, viewing is possible tomorrow at 10 AM.', avatarUrl: 'https://picsum.photos/seed/avatar1/100' },
    { id: 2, name: 'Seller - Properties Inc.', lastMessage: 'The contract is ready for signing.', avatarUrl: 'https://picsum.photos/seed/avatar2/100' },
];

export const MOCK_MESSAGES: Message[] = [
    { id: 1, sender: 'other', text: 'Hello, is this item still available?', timestamp: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hi, yes it is. Are you interested?', timestamp: '10:01 AM' },
    { id: 3, sender: 'other', text: 'Yes, can I see it tomorrow at 10 AM?', timestamp: '10:05 AM' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, title: 'New Message', body: 'You have a new message from John Phiri.', timestamp: '2 hours ago' },
    { id: 2, title: 'Payment Reminder', body: 'Your rental for "3 Bedroom in Area 49" is due in 3 days.', timestamp: '1 day ago' },
    { id: 3, title: 'New Listing Alert', body: 'A new 2 bedroom property is available in Lilongwe.', timestamp: '3 days ago' },
];

export const MarketPaLineLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7.5 6.5l-1 10.5h11l-1-10.5"></path>
        <path d="M6 6h12"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        <path d="M12 11v5"></path>
        <path d="M15.5 11l-1 5"></path>
        <path d="M8.5 11l1 5"></path>
    </svg>
);

export const HouseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const BedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 3v18h20V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path>
    <path d="M2 12h20"></path>
    <path d="M2 8h8"></path>
    <path d="M14 8h6"></path>
  </svg>
);

export const BathIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 8c0-2.2-1.8-4-4-4H7a4 4 0 0 0-4 4v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8zM5 8v12h14V8M5 12h14"></path>
    <path d="M12 12v8"></path>
    <path d="M9 16h6"></path>
  </svg>
);

export const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
);

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

export const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
);

export const MapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);

export const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);


export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

// FIX: Corrected the malformed viewBox attribute which was causing a parsing error.
export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
);

export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.73l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

export const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

export const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

export const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

export const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="4" x2="9" y2="20"></line><line x1="15" y1="4" x2="15" y2="20"></line><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line></svg>
);

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

export const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

export const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
);

export const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
);

export const ShareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
);

export const SortIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18M7 12h10M10 18h4"/></svg>
);

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
);

export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export const CarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 16H9m10 0h1.34a2 2 0 0 0 1.9-2.37L20.1 8.23a2.5 2.5 0 0 0-2.3-1.73H6.2a2.5 2.5 0 0 0-2.3 1.73L2.76 13.63A2 2 0 0 0 4.66 16H5m0 0v2m14-2v2m-7-5a2.5 2.5 0 0 1-5 0V9.5a2.5 2.5 0 0 1 5 0V11Z"/></svg>
);

export const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
);

export const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
);

export const WifiIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
);

export const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

export const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2z"/></svg>
);

export const DropletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
);

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" />
    </svg>
);