const form = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const messageDiv = document.getElementById('message');
const petalsContainer = document.getElementById('petalsContainer');
function showMessage(text, isError = false) {
  messageDiv.textContent = text;
  messageDiv.className = isError ? 'message error' : 'message success';
  
  // Clear message after 5 seconds
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }, 5000);
}

function createRosePetals() {
  // Clear any existing petals
  petalsContainer.innerHTML = '';
  
  // Create MANY more petals - 100+ for a spectacular effect!
  const petalCount = 120;
  
  // Vibrant, colorful rose palette
  const colors = [
    '#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#dc143c', // Pinks & Reds
    '#ff0080', '#ff3399', '#ff66cc', '#ff99ff', '#ff00ff', // Magentas
    '#ff1744', '#e91e63', '#c2185b', '#ad1457', '#880e4f', // Deep Pinks
    '#f50057', '#f06292', '#ec407a', '#e91e63', '#c2185b', // Rose Pinks
    '#ff4081', '#ff80ab', '#ffb2d1', '#ffcce0', '#ffe0f0', // Light Pinks
    '#ff1744', '#d50000', '#c51162', '#aa00ff', '#e1bee7', // Purples & Violets
    '#ff6ec7', '#ff8cc8', '#ffa8d5', '#ffc4e1', '#ffe0ed'  // Soft Pinks
  ];
  
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Random starting position across full width
    const startX = Math.random() * 100;
    petal.style.left = `${startX}%`;
    petal.style.top = '-20px';
    
    // Random vibrant color
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Varied sizes for more visual interest
    const size = 8 + Math.random() * 16; // 8px to 24px
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    
    // Random animation duration (2-7 seconds) for varied speeds
    const duration = 2 + Math.random() * 5;
    petal.style.animationDuration = `${duration}s`;
    
    // Staggered delays for continuous falling effect
    petal.style.animationDelay = `${Math.random() * 1.5}s`;
    
    // More dramatic horizontal drift
    const drift = (Math.random() - 0.5) * 400;
    petal.style.setProperty('--drift', `${drift}px`);
    
    // More rotation for dynamic effect
    const rotation = 360 + Math.random() * 360;
    petal.style.setProperty('--rotation', `${rotation}deg`);
    
    // Add fall animation with rotation
    petal.style.animation = `fall ${duration}s linear ${Math.random() * 1.5}s forwards`;
    
    petalsContainer.appendChild(petal);
    
    // Remove petal after animation
    setTimeout(() => {
      if (petal.parentNode) {
        petal.remove();
      }
    }, (duration + 1.5) * 1000);
  }
  
  // Create a second wave after a short delay for continuous effect
  setTimeout(() => {
    for (let i = 0; i < 60; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      
      const startX = Math.random() * 100;
      petal.style.left = `${startX}%`;
      petal.style.top = '-20px';
      petal.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      const size = 8 + Math.random() * 16;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      
      const duration = 2 + Math.random() * 5;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${Math.random() * 1.5}s`;
      
      const drift = (Math.random() - 0.5) * 400;
      petal.style.setProperty('--drift', `${drift}px`);
      petal.style.setProperty('--rotation', `${360 + Math.random() * 360}deg`);
      petal.style.animation = `fall ${duration}s linear ${Math.random() * 1.5}s forwards`;
      
      petalsContainer.appendChild(petal);
      
      setTimeout(() => {
        if (petal.parentNode) {
          petal.remove();
        }
      }, (duration + 1.5) * 1000);
    }
  }, 500);
}


// PCB Preview functionality
let draggedComponent = null;
let placedComponents = [];

const componentPalette = document.querySelector('.component-palette');
const pcbSvg = document.querySelector('.pcb-svg');
const placedComponentsGroup = document.getElementById('placedComponents');

// Component definitions
const components = {
  battery: { width: 20, height: 30, color: '#FFD700', label: '9V', shape: 'rect' },
  resistor: { width: 30, height: 12, color: '#8B4513', label: 'R', shape: 'rect' },
  led: { width: 15, height: 20, color: '#FF0000', label: 'LED', shape: 'rect' },
  lightbulb: { width: 18, height: 24, color: '#FFD700', label: 'BULB', shape: 'circle' },
  wire: { width: 40, height: 2, color: '#000000', label: '', shape: 'line' }
};

// Make components draggable
componentPalette.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('component-item')) {
    draggedComponent = e.target.dataset.type;
    e.dataTransfer.effectAllowed = 'copy';
  }
});

// Allow drop on PCB
pcbSvg.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

pcbSvg.addEventListener('drop', (e) => {
  e.preventDefault();
  if (!draggedComponent) return;
  
  const rect = pcbSvg.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 300;
  const y = ((e.clientY - rect.top) / rect.height) * 200;
  
  // Create component on PCB
  const comp = components[draggedComponent];
  const componentId = `comp-${Date.now()}`;
  
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.id = componentId;
  g.classList.add('placed-component');
  g.setAttribute('transform', `translate(${x}, ${y})`);
  
  // Component body based on shape
  if (comp.shape === 'circle') {
    // Light bulb
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    circle.setAttribute('r', comp.width / 2);
    circle.setAttribute('fill', comp.color);
    circle.setAttribute('stroke', '#000000');
    circle.setAttribute('stroke-width', '1');
    g.appendChild(circle);
    
    // Bulb filament
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', -4);
    line1.setAttribute('y1', 0);
    line1.setAttribute('x2', 4);
    line1.setAttribute('y2', 0);
    line1.setAttribute('stroke', '#000000');
    line1.setAttribute('stroke-width', '0.5');
    g.appendChild(line1);
    
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', -2);
    line2.setAttribute('y1', -2);
    line2.setAttribute('x2', 2);
    line2.setAttribute('y2', 2);
    line2.setAttribute('stroke', '#000000');
    line2.setAttribute('stroke-width', '0.5');
    g.appendChild(line2);
  } else if (comp.shape === 'line') {
    // Wire
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', -comp.width / 2);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', comp.width / 2);
    line.setAttribute('y2', 0);
    line.setAttribute('stroke', comp.color);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');
    g.appendChild(line);
  } else {
    // Rectangular components
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectEl.setAttribute('x', -comp.width / 2);
    rectEl.setAttribute('y', -comp.height / 2);
    rectEl.setAttribute('width', comp.width);
    rectEl.setAttribute('height', comp.height);
    rectEl.setAttribute('fill', comp.color);
    rectEl.setAttribute('stroke', '#000000');
    rectEl.setAttribute('stroke-width', '1');
    g.appendChild(rectEl);
  }
  
  // Label (if not wire)
  if (comp.label) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 0);
    text.setAttribute('y', comp.shape === 'circle' ? 6 : 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '7');
    text.setAttribute('font-family', 'Helvetica');
    text.setAttribute('font-weight', '600');
    text.setAttribute('fill', comp.shape === 'circle' ? '#000000' : '#ffffff');
    text.textContent = comp.label;
    g.appendChild(text);
  }
  
  // Rotation for wires
  let rotation = 0;
  let rotateBtn = null;
  let rotateText = null;
  
  if (comp.shape === 'line') {
    // Add rotation button for wires
    rotateBtn = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotateBtn.setAttribute('cx', comp.width / 2 + 8);
    rotateBtn.setAttribute('cy', -8);
    rotateBtn.setAttribute('r', '6');
    rotateBtn.setAttribute('fill', '#000000');
    rotateBtn.setAttribute('cursor', 'pointer');
    rotateBtn.style.cursor = 'pointer';
    rotateBtn.setAttribute('class', 'rotate-button');
    
    rotateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    rotateText.setAttribute('x', comp.width / 2 + 8);
    rotateText.setAttribute('y', -4);
    rotateText.setAttribute('text-anchor', 'middle');
    rotateText.setAttribute('font-size', '8');
    rotateText.setAttribute('font-family', 'Helvetica');
    rotateText.setAttribute('font-weight', '700');
    rotateText.setAttribute('fill', '#ffffff');
    rotateText.textContent = '↻';
    rotateText.setAttribute('class', 'rotate-button');
    
    rotateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      rotation = (rotation + 45) % 360;
      const match = g.getAttribute('transform').match(/translate\(([^,]+),([^)]+)\)/);
      if (match) {
        g.setAttribute('transform', `translate(${match[1]}, ${match[2]}) rotate(${rotation})`);
      }
    });
    
    g.appendChild(rotateBtn);
    g.appendChild(rotateText);
  }
  
  // Make draggable
  g.addEventListener('mousedown', (e) => {
    // Don't drag if clicking rotation button
    if (e.target.classList && e.target.classList.contains('rotate-button')) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startTransform = g.getAttribute('transform');
    const match = startTransform.match(/translate\(([^,]+),([^)]+)\)/);
    let offsetX = parseFloat(match[1]);
    let offsetY = parseFloat(match[2]);
    
    const move = (e) => {
      const rect = pcbSvg.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 300;
      const newY = ((e.clientY - rect.top) / rect.height) * 200;
      
      // Preserve rotation if it exists
      const rotMatch = startTransform.match(/rotate\(([^)]+)\)/);
      const rot = rotMatch ? rotMatch[1] : '0';
      g.setAttribute('transform', `translate(${newX}, ${newY}) rotate(${rot})`);
    };
    
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      updateConnections();
    };
    
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
  
  // Double click to remove
  g.addEventListener('dblclick', () => {
    g.remove();
    updateConnections();
  });
  
  placedComponentsGroup.appendChild(g);
  draggedComponent = null;
  
  // Update connections immediately
  setTimeout(updateConnections, 50);
});

// Check connections and light up bulb - SIMPLIFIED: just needs battery and bulb on PCB
function updateConnections() {
  const components = placedComponentsGroup.querySelectorAll('.placed-component');
  let hasBattery = false;
  let hasBulb = null;
  
  components.forEach(comp => {
    const id = comp.id;
    if (id.includes('battery')) hasBattery = true;
    if (id.includes('lightbulb')) hasBulb = comp;
  });
  
  // Simple: If battery and bulb are both on PCB, light up the bulb
  if (hasBattery && hasBulb) {
    const circle = hasBulb.querySelector('circle');
    if (circle) {
      // Make bulb bright yellow and add glow
      circle.setAttribute('fill', '#FFEB3B');
      circle.setAttribute('opacity', '1');
      
      // Ensure defs exists
      let defs = pcbSvg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        pcbSvg.insertBefore(defs, pcbSvg.firstChild);
      }
      
      // Add or update glow filter
      let filter = defs.querySelector('#glow');
      if (!filter) {
        filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'glow');
        filter.setAttribute('x', '-50%');
        filter.setAttribute('y', '-50%');
        filter.setAttribute('width', '200%');
        filter.setAttribute('height', '200%');
        
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '4');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        filter.appendChild(feGaussianBlur);
        
        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feMerge);
        
        defs.appendChild(filter);
      }
      
      circle.setAttribute('filter', 'url(#glow)');
      
      // Add pulsing animation
      if (!hasBulb.querySelector('animate')) {
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'opacity');
        animate.setAttribute('values', '1;0.7;1');
        animate.setAttribute('dur', '1s');
        animate.setAttribute('repeatCount', 'indefinite');
        circle.appendChild(animate);
      }
    }
  } else if (hasBulb) {
    // Bulb off - dim and no glow
    const circle = hasBulb.querySelector('circle');
    if (circle) {
      circle.setAttribute('fill', '#FFD700');
      circle.setAttribute('opacity', '0.4');
      circle.removeAttribute('filter');
      // Remove animation
      const animate = circle.querySelector('animate');
      if (animate) animate.remove();
    }
  }
}

// Update connections when components are moved or added
pcbSvg.addEventListener('mouseup', () => {
  setTimeout(updateConnections, 50);
});

// Also check on component drop
setTimeout(updateConnections, 100);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  
  if (!email) {
    showMessage('Email is required', true);
    return;
  }

  // Disable form during submission
  const submitButton = form.querySelector('button');
  submitButton.disabled = true;
  submitButton.textContent = 'Joining...';
  messageDiv.textContent = '';


try {
  const payload = { email };

  if (SRC_CODE) {
    payload.src = SRC_CODE;
  }

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.ok && data.success) {
    showMessage(data.message, false);
    emailInput.value = '';
    createRosePetals();
  } else {
    showMessage(data.message || 'An error occurred', true);
  }
} catch (error) {
  showMessage('Network error. Please try again.', true);
} finally {
  submitButton.disabled = false;
  submitButton.textContent = 'Join';
}

});

