-- ==============================================================================
-- PANDAL MAP - SUPABASE SCHEMA & SECURITY SETUP
-- ==============================================================================
-- Run this complete script in the Supabase Dashboard SQL Editor.
-- It sets up:
--   1. "pandals" table with status ('pending', 'approved', 'rejected')
--   2. Strict Row Level Security (RLS) policies
--   3. Storage policies for "pandal-photos" bucket (< 2 MB uploads, public read)
--   4. Seed data insertion for the 15 verified Mumbai pandals (status = 'approved')
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.pandals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    description TEXT DEFAULT '',
    photo_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    history TEXT DEFAULT '',
    darshan_timings TEXT NOT NULL,
    aarti_timings TEXT NOT NULL,
    eco_friendly BOOLEAN DEFAULT false,
    is_24_hours BOOLEAN DEFAULT false,
    crowd_level TEXT NOT NULL CHECK (crowd_level IN ('Low', 'Medium', 'High')),
    nearest_station TEXT NOT NULL,
    visarjan_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for performant area & status filtering
CREATE INDEX IF NOT EXISTS idx_pandals_status ON public.pandals(status);
CREATE INDEX IF NOT EXISTS idx_pandals_area ON public.pandals(area);

-- ==============================================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view approved pandals" ON public.pandals;
DROP POLICY IF EXISTS "Authenticated users can view all pandals" ON public.pandals;
DROP POLICY IF EXISTS "Anyone can submit pending pandals" ON public.pandals;
DROP POLICY IF EXISTS "Authenticated users can update pandals" ON public.pandals;
DROP POLICY IF EXISTS "Authenticated users can delete pandals" ON public.pandals;

-- Public (anyone) can ONLY read approved pandals
CREATE POLICY "Public can view approved pandals"
ON public.pandals
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Authenticated admins can read ALL pandals (pending, approved, rejected)
CREATE POLICY "Authenticated users can view all pandals"
ON public.pandals
FOR SELECT
TO authenticated
USING (true);

-- Anyone can submit a pandal, but ONLY with status = 'pending'
CREATE POLICY "Anyone can submit pending pandals"
ON public.pandals
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

-- Only authenticated admins can update pandals (approve, edit details, reject)
CREATE POLICY "Authenticated users can update pandals"
ON public.pandals
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated admins can delete pandals
CREATE POLICY "Authenticated users can delete pandals"
ON public.pandals
FOR DELETE
TO authenticated
USING (true);

-- ==============================================================================
-- 3. STORAGE POLICIES ("pandal-photos" bucket)
-- ==============================================================================
-- Ensure the bucket exists and enforces public read & 2MB max file size
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'pandal-photos',
    'pandal-photos',
    true,
    2097152, -- 2 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public can view pandal photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload pandal photos under 2MB" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage storage objects" ON storage.objects;

-- Allow public read access to photos
CREATE POLICY "Public can view pandal photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pandal-photos');

-- Allow anyone to upload photos under 2 MB to pandal-photos
CREATE POLICY "Anyone can upload pandal photos under 2MB"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
    bucket_id = 'pandal-photos'
    AND (
        (metadata->>'size')::bigint <= 2097152
        OR (metadata->>'size') IS NULL
    )
);

-- Allow authenticated admins full update/delete access on storage objects
CREATE POLICY "Authenticated users can manage storage objects"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'pandal-photos')
WITH CHECK (bucket_id = 'pandal-photos');

-- ==============================================================================
-- 4. INSERT 15 SEED MUMBAI PANDALS (STATUS: 'approved')
-- ==============================================================================
INSERT INTO public.pandals (
    id, name, area, lat, lng, address, description, photo_url, gallery, history,
    darshan_timings, aarti_timings, eco_friendly, is_24_hours, crowd_level,
    nearest_station, visarjan_date, status
) VALUES
(
    'lalbaugcha-raja',
    'Lalbaugcha Raja',
    'Lalbaug',
    18.9912,
    72.8354,
    'Dr Baba Saheb Ambedkar Rd, Lal Baug, Parel, Mumbai, Maharashtra 400012',
    'Mumbai''s most revered and iconic Ganesha (''Navasacha Ganpati'' - fulfiller of wishes), founded in 1934. Millions of pilgrims queue for the special Navas (feet touching) and Mukh darshan lines.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=1200&q=80'
    ],
    'Founded in 1934 by local Koli fishermen and traders of the Peru Chawl market after their original marketplace was shut down. They vowed to establish a Ganpati pandal if a permanent market was granted. The wish was fulfilled, giving birth to the legend of the ''Navasacha Ganpati''.',
    '24 Hours (Navas line may take 12-24 hrs; Mukh line 3-6 hrs)',
    '12:30 PM (Madhyanha Aarti), 8:30 PM (Sandhya Aarti)',
    false,
    true,
    'High',
    'Chinchpokli / Currey Road',
    'Anant Chaturdashi (Day 10 - Grand Arabian Sea Immersion via Girgaon Chowpatty)',
    'approved'
),
(
    'gsb-seva-mandal-kings-circle',
    'GSB Seva Mandal (Gold Ganpati)',
    'King''s Circle / Sion',
    19.0306,
    72.8598,
    'Guru Ganesh Prerana Mandap, Bhookailash Nagar, Sion East, Mumbai, Maharashtra 400022',
    'Famed as the richest Ganesha mandal in the world, adorned with over 60kg of pure gold ornaments and 250kg of pure silver. Celebrates purely with sacred clay (shadu mati) and traditional South Indian Vedic rituals.',
    'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80'
    ],
    'Established in 1954 by the Gowd Saraswat Brahmin community. Strict adherence to environmental Vedic values with 100% clay idol immersed after 5 days.',
    '6:00 AM - 11:00 PM (Festival days 1 to 5 only)',
    '7:00 AM, 1:00 PM (Maha Puja), 8:30 PM (Maha Aarti)',
    true,
    false,
    'High',
    'King''s Circle (Harbour) / GTB Nagar',
    'Gauri Visarjan (Day 5)',
    'approved'
),
(
    'mumbaicha-raja-ganesh-galli',
    'Mumbaicha Raja (Ganesh Galli)',
    'Lalbaug',
    18.9905,
    72.8341,
    'Lane No. 1, Ganesh Galli, Lalbaug, Parel, Mumbai, Maharashtra 400012',
    'Established in 1928, this pandal is celebrated for pioneering monumental themes, often recreating replica scale models of India''s famous heritage temples like Sun Temple, Kedarnath, or Hampi.',
    'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1609137144822-261557007e60?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80'
    ],
    'Set up in 1928 by mill workers to unite the working-class community during the independence struggle.',
    '6:00 AM - 1:00 AM (Next Day)',
    '8:30 AM (Morning), 8:30 PM (Evening)',
    false,
    false,
    'High',
    'Currey Road / Chinchpokli',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'andhericha-raja',
    'Andhericha Raja (Azad Nagar)',
    'Andheri West',
    19.1245,
    72.8336,
    'Azad Nagar II, Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053',
    'The crown jewel of Mumbai''s Western Suburbs, founded in 1966. Known for royal palace set designs, celebrity attendees, and continuing darshan until Sankashti Chaturthi.',
    'https://images.unsplash.com/photo-1609137144822-261557007e60?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1609137144822-261557007e60?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    'Founded in 1966 by workers of the Golden Tobacco Company and Excel Industries. Traditional dress code strictly enforced.',
    '5:00 AM - 3:00 AM (Next Day)',
    '8:30 AM, 12:30 PM, 8:30 PM',
    false,
    false,
    'High',
    'Azad Nagar Metro / Andheri Station',
    'Sankashti Chaturthi (Day 15/16 - 21 hour immersion procession to Versova Beach)',
    'approved'
),
(
    'khetwadi-12th-lane',
    'Khetwadi 12th Lane (Khetwadicha Raja)',
    'Girgaon / Grant Road',
    18.9587,
    72.8202,
    '12th Khetwadi Lane, Grant Road East, Mumbai, Maharashtra 400004',
    'Famed across India for crafting some of the most colossal and majestic Ganesh idols, often reaching heights of 38-45 feet adorned with intricate traditional ornamentation and diamond crowns.',
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    'In 2000, sculpted a 40-foot Ganesh idol, the tallest idol in Indian history at the time.',
    '7:00 AM - 12:00 Midnight',
    '8:00 AM, 1:00 PM, 9:00 PM',
    false,
    false,
    'High',
    'Grant Road / Charni Road',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'keshavji-naik-chawl',
    'Keshavji Naik Chawl (Mumbai''s 1st Pandal)',
    'Girgaon',
    18.9555,
    72.8188,
    'Keshavji Naik Chawl, Khadilkar Road, Girgaon, Mumbai, Maharashtra 400004',
    'The historic birthplace of Sarvajanik Ganeshotsav in Mumbai, founded in 1893 by freedom fighter Lokmanya Bal Gangadhar Tilak. True to its centenary heritage, it features a modest 2.2-foot eco-friendly clay idol, no commercial sponsors, and warm community devotion.',
    'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1609137144822-261557007e60?auto=format&fit=crop&w=1200&q=80'
    ],
    'In 1893, Lokmanya Tilak transformed Ganesh worship into a public festival to unite citizens against British rule. Keshavji Naik Chawl was the very first in Mumbai.',
    '6:30 AM - 11:00 PM',
    '8:00 AM, 12:30 PM, 8:00 PM',
    true,
    false,
    'Medium',
    'Charni Road (Western Line)',
    'Anant Chaturdashi (Day 10 - Eco Immersion at Girgaon Chowpatty)',
    'approved'
),
(
    'chinchpoklicha-chintamani',
    'Chinchpoklicha Chintamani',
    'Chinchpokli',
    18.9882,
    72.8329,
    'Dattaram Lad Marg, Chinchpokli East, Mumbai, Maharashtra 400012',
    'Founded in 1920 by Chinchpokli Sarvajanik Utsav Mandal. Revered for its breathtaking, serene royal posture and iconic throne designs. The Aagman and Visarjan processions feature world-famous Maharashtrian Dhol-Tasha Pathaks.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=1200&q=80'
    ],
    'Celebrating over a century of heritage as the Wish Granter of Central Mumbai.',
    '7:00 AM - 1:00 AM',
    '9:00 AM, 9:00 PM (Maha Aarti)',
    false,
    false,
    'High',
    'Chinchpokli (Central Line)',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'sahyadri-krida-mandal',
    'Sahyadri Krida Mandal (Tilak Nagar)',
    'Tilak Nagar / Chembur',
    19.0664,
    72.8953,
    'Sahyadri Ground, Tilak Nagar, Chembur, Mumbai, Maharashtra 400089',
    'Known as Eastern Mumbai''s most magnificent pandal, famous for astounding replicas of global and national architectural wonders with synchronized light and laser spectacles.',
    'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80'
    ],
    'Founded in 1975, celebrated for architectural themes advocating harmony and classical Indian art.',
    '6:00 AM - 12:00 Midnight',
    '8:00 AM, 8:00 PM',
    false,
    false,
    'Medium',
    'Tilak Nagar (Harbour) / Kurla (Central)',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'fort-vibhag-sarvajanik',
    'Fortcha Icchapurti (Fort Vibhag)',
    'Fort / South Mumbai',
    18.9372,
    72.8344,
    'Mint Road, Near GPO & CSMT, Fort, Mumbai, Maharashtra 400001',
    'Located in the heritage precinct of South Mumbai right next to CSMT. Known for regal palace facades inspired by Rajasthani and South Indian fort architectures and elegant marigold floral art.',
    'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    'Catters to downtown commuters and visitors stepping off express trains at CSMT.',
    '7:00 AM - 11:30 PM',
    '8:30 AM, 8:30 PM',
    false,
    false,
    'Medium',
    'CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'tejukaya-sarvajanik-mandal',
    'Tejukayacha Raja',
    'Lalbaug',
    18.9928,
    72.8368,
    'Tejukaya Compound, Dr. Baba Saheb Ambedkar Rd, Lalbaug, Mumbai, Maharashtra 400012',
    'Pioneering the green Ganesha movement in the heart of Lalbaug, Tejukaya crafts Mumbai''s largest 100% eco-friendly papier-mâché and clay idols.',
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80'
    ],
    'Made international headlines by creating 22-foot tall idols exclusively from natural clay and paper pulp without Plaster of Paris.',
    '6:00 AM - 12:00 Midnight',
    '8:00 AM, 1:00 PM, 8:30 PM',
    true,
    false,
    'High',
    'Currey Road / Chinchpokli',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'khetwadi-4th-lane',
    'Khetwadi 4th Lane (Khetwadicha Lambodara)',
    'Girgaon / Grant Road',
    18.9569,
    72.8214,
    '4th Khetwadi Lane, Girgaon, Mumbai, Maharashtra 400004',
    'A historic neighborhood pandal nestled among traditional Mumbai chawls, famous for expressive clay sculpting, serene devotional mood, and warm volunteer hospitality towards out-of-town pilgrims.',
    'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80'
    ],
    'Cherished by devotees for maintaining intimate, uncommercialized darshan.',
    '7:00 AM - 11:30 PM',
    '8:30 AM, 8:30 PM',
    true,
    false,
    'Medium',
    'Charni Road / Grant Road',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'rangari-badak-chawl',
    'Rangari Badak Chawl Mandal',
    'Kalachowki / Byculla',
    18.9856,
    72.8401,
    'Rangari Badak Chawl, Dattaram Lad Marg, Kalachowki, Byculla, Mumbai 400033',
    'Over 80 years old, this pandal is celebrated for preserving timeless mill-worker culture, vibrant traditional folk songs, and authentic Maharashtrian street bhajans.',
    'https://images.unsplash.com/photo-1609137144822-261557007e60?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1609137144822-261557007e60?auto=format&fit=crop&w=1200&q=80'
    ],
    'Famous for theatrical Marathi plays (Nataks) staged every evening during the festival.',
    '7:00 AM - 11:00 PM',
    '8:00 AM, 8:00 PM',
    false,
    false,
    'Low',
    'Cotton Green (Harbour) / Chinchpokli',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'tulsiwadi-sarvajanik-mandal',
    'Tulsiwadi Cha Maharaja',
    'Tardeo',
    18.9723,
    72.8165,
    'Tulsiwadi, Tardeo Road, Opposite Heera Panna, Mumbai, Maharashtra 400034',
    'Established in 1939, Tulsiwadi is renowned for presenting socially relevant, educational themes alongside radiant idols sculpted with gold leaf and handcrafted silk shawls.',
    'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1567591414240-e175d275723b?auto=format&fit=crop&w=1200&q=80'
    ],
    'Distinguished for donating festival offerings to rural education and cancer care.',
    '7:00 AM - 12:00 Midnight',
    '8:30 AM, 8:30 PM',
    false,
    false,
    'Medium',
    'Mumbai Central / Grant Road',
    'Anant Chaturdashi (Day 10)',
    'approved'
),
(
    'balgopal-mitra-mandal',
    'Vile Parlecha Raja (Balgopal Mitra Mandal)',
    'Vile Parle East',
    19.0984,
    72.8489,
    'Nehru Road, Near Vile Parle Station, Vile Parle East, Mumbai, Maharashtra 400057',
    'A beloved cultural epicenter in suburban Mumbai. Known for magnificent clay sculptures, massive Rangoli art exhibitions, and disciplined queue arrangements ideal for visiting families.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    'One of the cleanest and best-organized family-friendly pandals in the airport corridor of Mumbai.',
    '6:00 AM - 11:00 PM',
    '7:30 AM, 12:30 PM, 8:00 PM',
    true,
    false,
    'Low',
    'Vile Parle (Western / Harbour)',
    'Anant Chaturdashi (Day 10 - Juhu Beach Immersion)',
    'approved'
),
(
    'gsb-wadala-ram-mandir',
    'GSB Ganeshotsav Samiti (Wadala Ram Mandir)',
    'Wadala',
    19.0195,
    72.8574,
    'Dwarkanath Bhavan, Katrak Road, Wadala East, Mumbai, Maharashtra 400031',
    'Celebrated for traditional Dakshina Kannada rituals, continuous Vedic chanting, and legendary Annadanam - offering thousands of visiting pilgrims free, delicious festive vegetarian meals on banana leaves daily.',
    'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=800&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=1200&q=80'
    ],
    'Dwarkanath Bhavan holds an unbroken 70-year tradition of offering sacred Annadanam.',
    '6:00 AM - 10:30 PM (10 days)',
    '7:30 AM (Kakad Aarti), 1:00 PM (Maha Puja), 8:00 PM (Rathotsav Aarti)',
    true,
    false,
    'Medium',
    'Wadala Road (Harbour Line)',
    'Anant Chaturdashi (Day 10)',
    'approved'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    area = EXCLUDED.area,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    photo_url = EXCLUDED.photo_url,
    gallery = EXCLUDED.gallery,
    history = EXCLUDED.history,
    darshan_timings = EXCLUDED.darshan_timings,
    aarti_timings = EXCLUDED.aarti_timings,
    eco_friendly = EXCLUDED.eco_friendly,
    is_24_hours = EXCLUDED.is_24_hours,
    crowd_level = EXCLUDED.crowd_level,
    nearest_station = EXCLUDED.nearest_station,
    visarjan_date = EXCLUDED.visarjan_date,
    status = EXCLUDED.status;

