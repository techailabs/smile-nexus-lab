
DELETE FROM clinics WHERE vertical IS NOT NULL AND vertical <> 'dental';

UPDATE clinics SET template_key = 'dental-modern-minimal',  primary_color = '#0b6cf2', secondary_color = '#0e1a33' WHERE slug = 'sydney-smile-dental';
UPDATE clinics SET template_key = 'dental-family-friendly', primary_color = '#15b78a', secondary_color = '#0f3b2e' WHERE slug = 'newyork-family-dental';
UPDATE clinics SET template_key = 'dental-luxury-cosmetic', primary_color = '#c9a25a', secondary_color = '#0a0a0a' WHERE slug = 'london-cosmetic-care';
UPDATE clinics SET template_key = 'dental-premium-ortho',   primary_color = '#6d28d9', secondary_color = '#1a1033' WHERE slug = 'dubai-dental-lounge';
UPDATE clinics SET template_key = 'dental-calm-wellness',   primary_color = '#7aa9a0', secondary_color = '#243b3a' WHERE slug = 'singapore-dental-studio';
UPDATE clinics SET template_key = 'dental-modern-minimal',  primary_color = '#0b6cf2', secondary_color = '#0e1a33' WHERE slug = 'toronto-bright-dental';
