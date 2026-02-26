# Specialty Images

This folder contains images for medical specialties displayed on the "Find Your Doctor" page.

## How to Add Images

1. **Add your images** to this folder
2. **Name them** using the format: `{specialty-name}-{number}.jpg`
   - Examples: `cardiology-1.jpg`, `radiology-1.jpg`, `neurology-2.jpg`

3. **Update** the specialty data in `lib/specialities.js`:
   ```javascript
   {
     name: "Radiology",
     icon: <CircleDot className="h-5 w-5" />,
     images: [
       "/images/specialties/radiology-1.jpg",
       "/images/specialties/radiology-2.jpg"
     ]
   }
   ```

## Image Recommendations

- **Format**: JPG, PNG, or WebP
- **Dimensions**: 800x600px or 16:9 aspect ratio
- **File size**: Under 200KB per image (compress if needed)
- **Content**: Professional medical images related to the specialty

## Specialty List

Here are all the specialties that need images:

1. general-medicine
2. cardiology
3. dermatology
4. endocrinology
5. gastroenterology
6. neurology
7. obstetrics-gynecology
8. oncology
9. ophthalmology
10. orthopedics
11. pediatrics
12. psychiatry
13. pulmonology
14. radiology
15. urology
16. other

## Example Image Ideas

- **Radiology**: X-ray images, CT scanner, MRI machine
- **Cardiology**: Heart diagram, ECG monitor, cardiac equipment
- **Dermatology**: Skin examination, dermatology tools
- **Pediatrics**: Children's healthcare, pediatric examination
- **Neurology**: Brain scan, neurological examination

## Note

- The first image in the `images` array will be displayed as the card background
- If no images are provided, the card will show the original icon-only design
