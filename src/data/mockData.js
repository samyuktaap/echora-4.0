// Mock data for demo/development use
// Replace with real Supabase/Firebase queries in production

export const mockVolunteers = [
  { id: 1, name: 'Aarav Sharma', skills: ['Teaching', 'First Aid'], languages: ['Hindi', 'English'], location: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.877, experience: 'Intermediate', points: 340, badges: ['Early Bird', 'Helper'], tasksCompleted: 12 },
  { id: 2, name: 'Priya Nair', skills: ['Cooking', 'Counseling'], languages: ['Malayalam', 'English'], location: 'Kochi', state: 'Kerala', lat: 9.931, lng: 76.267, experience: 'Expert', points: 520, badges: ['Star Volunteer', 'Mentor'], tasksCompleted: 21 },
  { id: 3, name: 'Rahul Verma', skills: ['Tech Support', 'Teaching'], languages: ['Hindi', 'Punjabi'], location: 'Delhi', state: 'Delhi', lat: 28.613, lng: 77.209, experience: 'Beginner', points: 120, badges: ['Newcomer'], tasksCompleted: 4 },
  { id: 4, name: 'Sneha Reddy', skills: ['Medical', 'First Aid'], languages: ['Telugu', 'English'], location: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.486, experience: 'Expert', points: 680, badges: ['Life Saver', 'Star Volunteer'], tasksCompleted: 30 },
  { id: 5, name: 'Arjun Patel', skills: ['Construction', 'Logistics'], languages: ['Gujarati', 'Hindi'], location: 'Ahmedabad', state: 'Gujarat', lat: 23.022, lng: 72.571, experience: 'Intermediate', points: 290, badges: ['Builder'], tasksCompleted: 9 },
  { id: 6, name: 'Meena Iyer', skills: ['Teaching', 'Counseling'], languages: ['Tamil', 'English'], location: 'Chennai', state: 'Tamil Nadu', lat: 13.082, lng: 80.270, experience: 'Expert', points: 460, badges: ['Educator', 'Mentor'], tasksCompleted: 18 },
  { id: 7, name: 'Vikram Singh', skills: ['Logistics', 'Tech Support'], languages: ['Hindi', 'English'], location: 'Jaipur', state: 'Rajasthan', lat: 26.912, lng: 75.787, experience: 'Intermediate', points: 210, badges: ['Helper'], tasksCompleted: 7 },
  { id: 8, name: 'Ananya Das', skills: ['Cooking', 'Medical'], languages: ['Bengali', 'English'], location: 'Kolkata', state: 'West Bengal', lat: 22.572, lng: 88.363, experience: 'Beginner', points: 90, badges: ['Newcomer'], tasksCompleted: 3 },
];

export const mockNGORequests = [
  { id: 1, ngoName: 'Hope Foundation', location: 'Bangalore', state: 'Karnataka', lat: 12.971, lng: 77.594, taskDescription: 'Need food distribution volunteers for weekend camp', urgency: 'High', requiredSkills: ['Cooking', 'Logistics'], createdAt: '2026-04-15' },
  { id: 2, ngoName: 'EduCare Trust', location: 'Delhi', state: 'Delhi', lat: 28.613, lng: 77.209, taskDescription: 'Tutors needed for underprivileged children in science & math', urgency: 'Medium', requiredSkills: ['Teaching'], createdAt: '2026-04-16' },
  { id: 3, ngoName: 'Green Earth NGO', location: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.877, taskDescription: 'Tree plantation drive volunteers needed', urgency: 'Low', requiredSkills: ['Construction'], createdAt: '2026-04-17' },
  { id: 4, ngoName: 'MedReach India', location: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.486, taskDescription: 'Medical camp volunteers for rural areas - first aid trained preferred', urgency: 'High', requiredSkills: ['Medical', 'First Aid'], createdAt: '2026-04-18' },
  { id: 5, ngoName: 'TechForAll', location: 'Pune', state: 'Maharashtra', lat: 18.520, lng: 73.856, taskDescription: 'Digital literacy trainers for senior citizens', urgency: 'Medium', requiredSkills: ['Tech Support', 'Teaching'], createdAt: '2026-04-19' },
  { id: 6, ngoName: 'Flood Relief Org', location: 'Patna', state: 'Bihar', lat: 25.594, lng: 85.137, taskDescription: 'Emergency relief volunteers - logistics and cooking', urgency: 'High', requiredSkills: ['Cooking', 'Logistics'], createdAt: '2026-04-20' },
];

export const mockMeetups = [
  { id: 1, name: 'Volunteer Connect Bangalore', date: '2026-04-27', location: 'Cubbon Park, Bangalore', state: 'Karnataka', description: 'Monthly meetup for volunteers across South India. Network, share stories, plan future drives.', attendees: 45, image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400' },
  { id: 2, name: 'NGO Summit Delhi', date: '2026-05-03', location: 'India Habitat Centre, Delhi', state: 'Delhi', description: 'Annual summit bringing together NGOs and volunteers to discuss impact and collaboration.', attendees: 120, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
  { id: 3, name: 'Coastal Cleanup Drive', date: '2026-05-10', location: 'Marina Beach, Chennai', state: 'Tamil Nadu', description: 'Join us for a massive coastal cleanup drive. Equipment provided. All skill levels welcome.', attendees: 80, image: 'https://images.unsplash.com/photo-1618477460930-d8ac68e3ec47?w=400' },
  { id: 4, name: 'Tech for Good Hackathon', date: '2026-05-17', location: 'IIT Bombay, Mumbai', state: 'Maharashtra', description: 'Build solutions for social problems. Teams of 3-5. Prizes worth ₹2,00,000.', attendees: 200, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400' },
  { id: 5, name: 'Rural Health Camp', date: '2026-05-24', location: 'Nagpur District', state: 'Maharashtra', description: 'Medical volunteers needed for a 2-day rural health camp. Food & accommodation provided.', attendees: 35, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400' },
  { id: 6, name: 'Youth Leadership Workshop', date: '2026-06-01', location: 'Hyderabad Convention Centre', state: 'Telangana', description: 'Workshop for young volunteers looking to take on leadership roles in NGOs.', attendees: 60, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400' },
];

export const mockNotes = [
  { id: 1, volunteerId: 1, task: 'Food Distribution - Hope Foundation', note: 'Amazing experience! Helped 200+ families. The team was very organized.', rating: 5, date: '2026-04-10' },
  { id: 2, volunteerId: 1, task: 'Tree Plantation - Green Earth', note: 'Planted 50 saplings. Hard work but very rewarding.', rating: 4, date: '2026-04-05' },
];

export const mockImpactStats = {
  totalVolunteers: 1248,
  tasksCompleted: 3672,
  ngosSupported: 89,
  citiesCovered: 42,
  hoursContributed: 18540,
  skillDistribution: [
    { skill: 'Teaching', count: 312 },
    { skill: 'Medical', count: 198 },
    { skill: 'Cooking', count: 245 },
    { skill: 'Tech Support', count: 167 },
    { skill: 'Logistics', count: 189 },
    { skill: 'Counseling', count: 137 },
    { skill: 'Construction', count: 98 },
    { skill: 'First Aid', count: 224 },
  ],
  monthlyGrowth: [
    { month: 'Nov', volunteers: 780, tasks: 1900 },
    { month: 'Dec', volunteers: 890, tasks: 2200 },
    { month: 'Jan', volunteers: 960, tasks: 2600 },
    { month: 'Feb', volunteers: 1050, tasks: 2900 },
    { month: 'Mar', volunteers: 1150, tasks: 3200 },
    { month: 'Apr', volunteers: 1248, tasks: 3672 },
  ],
};

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export const SKILLS_LIST = [
  'Teaching', 'Medical', 'First Aid', 'Cooking', 'Tech Support',
  'Logistics', 'Counseling', 'Construction', 'Photography', 'Design',
  'Legal Aid', 'Translation', 'Driving', 'Farming', 'Music/Arts',
];

export const LANGUAGES_LIST = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil',
  'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu',
  'Assamese', 'Maithili', 'Sanskrit',
];

export const STATE_COORDS = {
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'Arunachal Pradesh': { lat: 28.2180, lng: 94.7278 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Bihar': { lat: 25.0961, lng: 85.3131 },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
  'Goa': { lat: 15.2993, lng: 74.1240 },
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'Haryana': { lat: 29.0588, lng: 76.0856 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'Jharkhand': { lat: 23.6102, lng: 85.2799 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Manipur': { lat: 24.6637, lng: 93.9063 },
  'Meghalaya': { lat: 25.4670, lng: 91.3662 },
  'Mizoram': { lat: 23.1645, lng: 92.9376 },
  'Nagaland': { lat: 26.1584, lng: 94.5624 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Punjab': { lat: 31.1471, lng: 75.3412 },
  'Rajasthan': { lat: 27.0238, lng: 74.2179 },
  'Sikkim': { lat: 27.5330, lng: 88.5122 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'Telangana': { lat: 18.1124, lng: 79.0193 },
  'Tripura': { lat: 23.9408, lng: 91.9882 },
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Jammu and Kashmir': { lat: 33.7782, lng: 76.5762 },
  'Ladakh': { lat: 34.1526, lng: 77.5771 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Puducherry': { lat: 11.9416, lng: 79.8083 },
  'Andaman and Nicobar Islands': { lat: 11.7401, lng: 92.6586 },
  'Lakshadweep': { lat: 10.5667, lng: 72.6417 },
  'Dadra and Nagar Haveli and Daman and Diu': { lat: 20.1809, lng: 73.0169 },
};
