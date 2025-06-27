import { supabase } from '@/lib/config';

// Shop Products
export async function getShopProducts() {
  const { data, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('is_active', true);

  if (error) {
    throw error;
  }
  return data;
}

export async function getShopProductById(id: number) {
  const { data, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createShopProduct(product: {
  name: string;
  description?: string;
  category?: string;
  price: number;
  sku?: string;
  inventory_quantity?: number;
  images?: string;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from('shop_products')
    .insert([product])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateShopProduct(id: number, updates: Partial<{
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  sku?: string;
  inventory_quantity?: number;
  images?: string;
  is_active?: boolean;
}>) {
  const { data, error } = await supabase
    .from('shop_products')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteShopProduct(id: number) {
  const { error } = await supabase
    .from('shop_products')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}

// Shop Orders
export async function getShopOrdersByTenant(tenantId: string) {
  const { data, error } = await supabase
    .from('shop_orders')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) {
    throw error;
  }
  return data;
}

export async function getShopOrderById(id: number) {
  const { data, error } = await supabase
    .from('shop_orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function createShopOrder(order: {
  tenant_id: string;
  total_amount: number;
  payment_status?: string;
  order_status?: string;
  delivery_address?: string;
  delivery_instructions?: string;
}) {
  const { data, error } = await supabase
    .from('shop_orders')
    .insert([order])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateShopOrder(id: number, updates: Partial<{
  total_amount?: number;
  payment_status?: string;
  order_status?: string;
  delivery_address?: string;
  delivery_instructions?: string;
}>) {
  const { data, error } = await supabase
    .from('shop_orders')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteShopOrder(id: number) {
  const { error } = await supabase
    .from('shop_orders')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}

// Shop Order Items
export async function getShopOrderItemsByOrder(orderId: number) {
  const { data, error } = await supabase
    .from('shop_order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    throw error;
  }
  return data;
}

export async function createShopOrderItem(item: {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}) {
  const { data, error } = await supabase
    .from('shop_order_items')
    .insert([item])
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function updateShopOrderItem(id: number, updates: Partial<{
  quantity?: number;
  price?: number;
}>) {
  const { data, error } = await supabase
    .from('shop_order_items')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

export async function deleteShopOrderItem(id: number) {
  const { error } = await supabase
    .from('shop_order_items')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return true;
}
