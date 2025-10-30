# Diatom Image Gallery

A beautiful, responsive webpage for displaying diatom microscopy images.

## Features

- Responsive grid gallery layout
- Click to enlarge images in a modal view
- Filter images by category (Pennate, Centric, Other)
- Smooth animations and hover effects
- Mobile-friendly design
- Modern gradient background

## Usage

1. Open `index.html` in your web browser
2. Click on any image to view it in full size
3. Use the filter buttons to show specific types of diatoms
4. Press Escape or click the X to close the enlarged view

## Adding Your Own Images

To add your own diatom images:

1. Create an `images` folder in the project directory
2. Add your diatom images to this folder
3. Edit the `index.html` file and update the gallery section with your images:

```html
<div class="gallery-item" data-category="pennate">
    <img src="images/your-image.jpg" alt="Your Diatom">
    <div class="gallery-item-info">
        <h3>Diatom Name</h3>
        <p>Description of your diatom specimen.</p>
    </div>
</div>
```

## Categories

- **Pennate**: Bilateral symmetric diatoms
- **Centric**: Radially symmetric diatoms
- **Other**: Colonial forms and other types

## Browser Compatibility

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

Free to use and modify for educational and research purposes.
