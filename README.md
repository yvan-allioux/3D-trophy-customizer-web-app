# 3D Trophy Customizer Web App

This project is a web application that allows users to customize a 3D trophy model by adding text, then generate and download an STL file ready for 3D printing, directly from their browser.

## Features

- **Display and manipulate a 3D model** - View a golden trophy in 3D with full rotation and zoom controls
- **Add custom text** - Type and add custom text to your trophy
- **Position, rotate, and resize the text** - Fine-tune text placement with intuitive sliders
  - Position controls (X, Y, Z axes)
  - Rotation controls (X, Y, Z axes)
  - Font size adjustment
- **Export as STL file** - Download the customized trophy as an STL file for 3D printing

## Technologies Used

- **Three.js** - 3D graphics library for rendering and manipulation
- **HTML5/CSS3** - Modern web interface
- **JavaScript (ES6 modules)** - Application logic

## How to Use

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
2. Wait for the 3D trophy to load
3. Enter your desired text in the "Text" input field
4. Click "Add Text" to add the text to the trophy
5. Use the sliders to adjust:
   - **Font Size** - Make the text larger or smaller
   - **Position (X, Y, Z)** - Move the text around the trophy
   - **Rotation (X, Y, Z)** - Rotate the text for the perfect angle
6. Use mouse controls to view the trophy:
   - **Left click + drag** - Rotate the view
   - **Right click + drag** - Pan the view
   - **Scroll wheel** - Zoom in/out
7. Click "Export STL" to download your customized trophy as an STL file

## Running the Application

This is a static web application that runs entirely in the browser. You can run it in several ways:

### Option 1: Direct File Opening
Simply open the `index.html` file in a web browser.

### Option 2: Local Web Server (Recommended)
For the best experience, serve the files using a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (with http-server package)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

## Browser Compatibility

This application requires a modern browser with support for:
- ES6 modules
- WebGL
- Import maps

Recommended browsers:
- Chrome/Edge 89+
- Firefox 108+
- Safari 16.4+

## File Structure

```
3D-trophy-customizer-web-app/
├── index.html          # Main HTML file
├── style.css           # Styling and layout
├── app.js              # Three.js application logic
└── README.md           # Documentation
```

## Credits

- Three.js library and examples
- Font: Helvetiker Bold (from Three.js examples)