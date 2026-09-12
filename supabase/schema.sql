-- ANTARCTICNAV AI - SUPABASE DATABASE SCHEMA MIGRATION
-- Copy and run this script in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)

-- 1. VESSEL LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS vessel_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_name VARCHAR(100) NOT NULL DEFAULT 'RV Polar Star II',
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  speed_knots NUMERIC(5, 2) DEFAULT 12.5,
  heading_degrees NUMERIC(5, 2) DEFAULT 215.0,
  source VARCHAR(50) DEFAULT 'GPS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TELEMETRY & RISK LOGS TABLE
CREATE TABLE IF NOT EXISTS telemetry_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  overall_risk_score INT NOT NULL,
  risk_status VARCHAR(20) NOT NULL,
  sea_ice_risk INT,
  iceberg_collision_risk INT,
  weather_risk INT,
  ocean_risk INT,
  vessel_risk INT,
  temperature_c NUMERIC(5, 2),
  wind_speed_knots NUMERIC(5, 2),
  wave_height_meters NUMERIC(5, 2),
  location_name VARCHAR(150),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SAVED SETTINGS TABLE
CREATE TABLE IF NOT EXISTS saved_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_name VARCHAR(100) DEFAULT 'RV Polar Star II',
  ice_class VARCHAR(100) DEFAULT 'PC5 (Polar Class 5)',
  max_speed_knots NUMERIC(5, 2) DEFAULT 16.5,
  iceberg_proximity_nm INT DEFAULT 10,
  sea_ice_threshold_percent INT DEFAULT 70,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ/WRITE POLICIES
ALTER TABLE vessel_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on vessel_locations" ON vessel_locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on vessel_locations" ON vessel_locations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on telemetry_logs" ON telemetry_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on telemetry_logs" ON telemetry_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on saved_settings" ON saved_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on saved_settings" ON saved_settings FOR INSERT WITH CHECK (true);
