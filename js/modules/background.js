export function initBackgroundGraph() {
    const canvas = document.getElementById('backgroundCanvas');
    if (!canvas) {
        console.warn("Background canvas not found.");
        return;
    }
    
    const ctx = canvas.getContext('2d');



    function hexToRgbComponents(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }   

    const rootStyles = window.getComputedStyle(document.documentElement); 
    const NODE_RGB = hexToRgbComponents(rootStyles.getPropertyValue('--node-rgb').trim());
    const EDGE_RGB = hexToRgbComponents(rootStyles.getPropertyValue('--edge-rgb').trim());
    const BASE_OPACITY = 0.4;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); 


    let nodes = [];
    let edges = [];
    const MAX_NODES = 50;
    const CONNECTION_DISTANCE = 150;
    const NODE_RADIUS = 3;
    const ANIMATION_SPEED = 0.5;
    const NODE_GLOW_RATIO = 1.8;

    function createNode(x, y) {
        return {
            x: x,
            y: y,
            radius: NODE_RADIUS,
            color: 'rgba(var(--color-text-rgb), 0.5)',
            opacity: 0, 
            targetOpacity: 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        };
    }

function drawNode(node) {
    const finalAlpha = node.opacity * BASE_OPACITY;
    const finalR = NODE_RGB.r;
    const finalG = NODE_RGB.g;
    const finalB = NODE_RGB.b;
    
    const glowRadius = node.radius * NODE_GLOW_RATIO;
    const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,                      
        node.x, node.y, glowRadius            
    );

    gradient.addColorStop(0, `rgba(${finalR}, ${finalG}, ${finalB}, ${finalAlpha})`);
    gradient.addColorStop(0.5, `rgba(${finalR}, ${finalG}, ${finalB}, ${finalAlpha * 0.5})`); 
    gradient.addColorStop(1, `rgba(${finalR}, ${finalG}, ${finalB}, 0)`); 

    ctx.beginPath();
    ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 0.7, 0, Math.PI * 2); 
    ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${finalAlpha * 1.5})`;
    ctx.fill();
}

    function drawEdge(node1, node2, opacity) {
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        const finalAlpha = opacity * BASE_OPACITY;
        ctx.strokeStyle = `rgba(${EDGE_RGB.r}, ${EDGE_RGB.g}, ${EDGE_RGB.b}, ${finalAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }

    let lastTime = 0;
    function animate(currentTime) {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (nodes.length < MAX_NODES && Math.random() < 0.2) {
            nodes.push(createNode(Math.random() * canvas.width, Math.random() * canvas.height));
        }

        nodes.forEach(node => {
            if (node.opacity < node.targetOpacity) {
                node.opacity += 0.01; 
            }

            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

            drawNode(node);
        });

        edges = []; 
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                const dx = node1.x - node2.x;
                const dy = node1.y - node2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONNECTION_DISTANCE) {
                    const opacity = (1 - (distance / CONNECTION_DISTANCE)) * Math.min(node1.opacity, node2.opacity);
                    drawEdge(node1, node2, opacity);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate(0); 
}