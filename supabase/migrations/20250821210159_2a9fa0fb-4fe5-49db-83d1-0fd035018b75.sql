-- Fix security warning: Set search_path for the validation function
CREATE OR REPLACE FUNCTION validate_product_images()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
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
$$;