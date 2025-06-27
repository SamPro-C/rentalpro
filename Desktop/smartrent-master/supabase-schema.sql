-- Apartments Table
CREATE TABLE apartments (
  id SERIAL PRIMARY KEY,
  landlord_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  amenities TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Units Table
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  apartment_id INT NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  number_of_rooms INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Rooms Table
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Vacant',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tenants Table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES users(id),
  apartment_id INT NOT NULL REFERENCES apartments(id),
  unit_id INT NOT NULL REFERENCES units(id),
  room_id INT NOT NULL REFERENCES rooms(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  national_id VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  move_in_date DATE,
  monthly_rent NUMERIC(12, 2),
  security_deposit NUMERIC(12, 2),
  lease_start_date DATE,
  lease_end_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Workers Table
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  national_id VARCHAR(100),
  role VARCHAR(100),
  assigned_apartments INT[],
  working_hours JSONB,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Payments Table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  apartment_id INT NOT NULL REFERENCES apartments(id),
  unit_id INT NOT NULL REFERENCES units(id),
  room_id INT NOT NULL REFERENCES rooms(id),
  amount NUMERIC(12, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT now(),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Service Requests Table
CREATE TABLE service_requests (
  id SERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  apartment_id INT NOT NULL REFERENCES apartments(id),
  unit_id INT NOT NULL REFERENCES units(id),
  room_id INT NOT NULL REFERENCES rooms(id),
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  priority VARCHAR(50) DEFAULT 'Normal',
  assigned_worker_id UUID REFERENCES workers(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tasks Table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  worker_id UUID NOT NULL REFERENCES workers(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  apartment_id INT NOT NULL REFERENCES apartments(id),
  unit_id INT NOT NULL REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id),
  status VARCHAR(50) DEFAULT 'Pending',
  assigned_date TIMESTAMP DEFAULT now(),
  due_date TIMESTAMP,
  completed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Shop Products Table
CREATE TABLE shop_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price NUMERIC(12, 2) NOT NULL,
  sku VARCHAR(100),
  inventory_quantity INT DEFAULT 0,
  images TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Shop Orders Table
CREATE TABLE shop_orders (
  id SERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  order_date TIMESTAMP DEFAULT now(),
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'Pending',
  order_status VARCHAR(50) DEFAULT 'New',
  delivery_address TEXT,
  delivery_instructions TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Shop Order Items Table
CREATE TABLE shop_order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES shop_products(id),
  quantity INT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Admin Logs Table
CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);
