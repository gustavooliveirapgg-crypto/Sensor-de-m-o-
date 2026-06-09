// JavaScript
const video = document.getElementById('video');
const canvas = document.getElementById('tela');
const ctx = canvas.getContext('2d');

// Ajusta o tamanho do canvas para a tela
function ajustarTamanho() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
ajustarTamanho();
window.addEventListener('resize', ajustarTamanho);

// Configuração da detecção de mãos
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 0,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Função que roda toda vez que uma mão é detectada
hands.onResults((resultado) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Se nenhuma mão for vista, para aqui
  if (!resultado.multiHandLandmarks.length) return;

  // Pega os pontos da mão detectada
  const pontos = resultado.multiHandLandmarks[0];

  // Desenha a "mão virtual" - você pode mudar isso para o que quiser!
  ctx.fillStyle = '#00ff88';
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 4;

  // Liga os pontos para formar o formato da mão
  const ligacoes = [
    [0,1],[1,2],[2,3],[3,4], // Dedo polegar
    [0,5],[5,6],[6,7],[7,8], // Indicador
    [0,9],[9,10],[10,11],[11,12], // Médio
    [0,13],[13,14],[14,15],[15,16], // Anelar
    [0,17],[17,18],[18,19],[19,20] // Mindinho
  ];

  ligacoes.forEach(par => {
    const p1 = pontos[par[0]];
    const p2 = pontos[par[1]];
    // Converte as posições (que vão de 0 a 1) para o tamanho da tela
    ctx.beginPath();
    ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
    ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
    ctx.stroke();
  });

  // Desenha bolinhas em cada ponto
  pontos.forEach(ponto => {
    ctx.beginPath();
    ctx.arc(ponto.x * canvas.width, ponto.y * canvas.height, 8, 0, Math.PI * 2);
    ctx.fill();
  });
});

// Liga a câmera e começa a detecção
const camera = new Camera(video, {
  onFrame: async () => await hands.send({image: video}),
  width: 1280,
  height: 720
});
camera.start();

