-- Add performance indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON public.products(on_sale) WHERE on_sale = true;
CREATE INDEX IF NOT EXISTS idx_products_placement ON public.products(placement);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

-- Add function to validate product images (prevent large base64 uploads)
CREATE OR REPLACE FUNCTION validate_product_images()
RETURNS TRIGGER AS $$
DECLARE
    img TEXT;
    img_size INTEGER;
BEGIN
    -- Check each image in the array
    IF NEW.images IS NOT NULL THEN
        FOR img IN SELECT unnest(NEW.images)
        LOOP
            -- Check if image is base64 encoded and calculate size
            IF img LIKE 'data:%' THEN
                img_size := length(img);
                -- Reject images larger than 1MB (1,048,576 characters)
                IF img_size > 1048576 THEN
                    RAISE EXCEPTION 'Image size too large: % characters. Please use image URLs or smaller images.', img_size;
                END IF;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate images before insert/update
DROP TRIGGER IF EXISTS validate_product_images_trigger ON public.products;
CREATE TRIGGER validate_product_images_trigger
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION validate_product_images();

-- Remove any existing products with large base64 images (over 1MB)
DELETE FROM public.products 
WHERE EXISTS (
    SELECT 1 FROM unnest(images) AS img 
    WHERE img LIKE 'data:%' AND length(img) > 1048576
);