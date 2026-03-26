// Atualiza ano do rodapé
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Menu mobile Animado
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  nav.style.display = '';

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
    
    if (nav.classList.contains('nav--open')) {
      menuToggle.innerHTML = '✕';
    } else {
      menuToggle.innerHTML = '☰';
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        nav.classList.remove('nav--open');
        menuToggle.innerHTML = '☰';
      }
    });
  });
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ===== Funcionalidade: Copiar Mira CS2 ===== */
const btnCopy = document.getElementById('btn-copy-crosshair');
const codeCrosshair = document.getElementById('cs2wb-crosshair');
const feedback = document.getElementById('cs2wb-feedback');

if (btnCopy && codeCrosshair && feedback) {
  btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeCrosshair.textContent.trim());
      feedback.textContent = "✓ Código da mira copiado!";
      feedback.style.color = "#10b981"; // Verde
      feedback.classList.add('show');
      
      setTimeout(() => {
        feedback.classList.remove('show');
      }, 2500);
    } catch (err) {
      feedback.textContent = "Erro ao copiar.";
      feedback.style.color = "#ef4444"; // Vermelho
      feedback.classList.add('show');
    }
  });
}

/* ===== Funcionalidade: Copiar Mira Valorant ===== */
const btnCopyVal = document.getElementById('btn-copy-val');
const codeCrosshairVal = document.getElementById('val-crosshair');
const feedbackVal = document.getElementById('val-feedback');

if (btnCopyVal && codeCrosshairVal && feedbackVal) {
  btnCopyVal.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeCrosshairVal.textContent.trim());
      feedbackVal.textContent = "✓ Código da mira copiado!";
      feedbackVal.style.color = "#10b981"; // Verde
      feedbackVal.classList.add('show');
      
      setTimeout(() => {
        feedbackVal.classList.remove('show');
      }, 2500);
    } catch (err) {
      feedbackVal.textContent = "Erro ao copiar.";
      feedbackVal.style.color = "#ef4444"; // Vermelho
      feedbackVal.classList.add('show');
    }
  });
}

/* ===== Integração com Lanyard (Discord Status) ===== */
const DISCORD_ID = '310952599757127681';

async function fetchDiscordStatus() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const { data } = await response.json();
    
    if (!data) return;

    const pfp = document.getElementById('ds-pfp');
    const indicator = document.getElementById('ds-indicator');
    const nameEl = document.getElementById('ds-name');
    const activityEl = document.getElementById('ds-activity');

    // 1. Atualiza Foto de Perfil
    if (data.discord_user.avatar) {
      pfp.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`;
      pfp.style.display = 'block';
    }

    // 2. Atualiza Nome
    nameEl.textContent = data.discord_user.display_name || data.discord_user.username;

    // 3. Atualiza a bolinha de Status
    indicator.className = `ds-indicator ${data.discord_status}`;

    // 4. Lógica de Atividade Inteligente (com macete para o VS Code)
    let activityText = 'Apenas chillando'; 
    
    if (data.listening_to_spotify && data.spotify) {
      activityText = `Ouvindo: ${data.spotify.artist} - ${data.spotify.song}`;
    } else if (data.activities && data.activities.length > 0) {
      const mainActivity = data.activities.find(a => a.type !== 4);
      
      if (mainActivity) {
        if (mainActivity.name.toLowerCase().includes("code") || mainActivity.name.toLowerCase().includes("visual studio")) {
          activityText = `Codando em: ${mainActivity.name}`;
        } else {
          activityText = `Jogando: ${mainActivity.name}`;
        }
      } else {
        const customStatus = data.activities.find(a => a.type === 4);
        if (customStatus && customStatus.state) {
          activityText = customStatus.state;
        }
      }
    } else if (data.discord_status === 'offline') {
      activityText = 'Offline no momento';
    }

    activityEl.textContent = activityText;

  } catch (error) {
    console.error('Erro ao buscar o status do Discord:', error);
  }
}

// Inicia a busca imediatamente e atualiza a cada 10s
fetchDiscordStatus();
setInterval(fetchDiscordStatus, 10000);

/* ===== Neve leve (Canvas) — OTIMIZADA ===== */
(function snowEffect() {
  const canvas = document.getElementById('snow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, flakes = [];
  
  let isPlaying = true;
  let animationId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor(width * height / 26000));
    flakes = Array.from({ length: count }, () => newFlake());
  }

  function newFlake() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      s: Math.random() * 0.6 + 0.25,
      w: Math.random() * 1.0 + 0.2,
      a: Math.random() * Math.PI * 2
    };
  }

  function update() {
    if (!isPlaying) return; 

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(200, 220, 245, 0.85)';
    
    for (const f of flakes) {
      f.y += f.s;
      f.x += Math.sin(f.a += 0.01) * f.w;
      
      if (f.y > height + 5) { 
        f.y = -5; 
        f.x = Math.random() * width; 
      }
      if (f.x > width + 5) f.x = -5;
      if (f.x < -5) f.x = width + 5;
      
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    animationId = requestAnimationFrame(update);
  }

  window.addEventListener('resize', resize);
  resize();
  update();

  const heroSection = document.getElementById('inicio');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isPlaying) {
            isPlaying = true;
            update(); 
          }
        } else {
          isPlaying = false;
          cancelAnimationFrame(animationId);
        }
      });
    }, { threshold: 0 }); 
    observer.observe(heroSection);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPlaying = false;
      cancelAnimationFrame(animationId);
    } else {
      const rect = heroSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        isPlaying = true;
        update();
      }
    }
  });
})();

/* ===== Otimização de Vídeos (Play/Pause no Scroll) ===== */
const optimizeVideos = () => {
  const allVideos = document.querySelectorAll('video');

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play(); // Começa a rodar apenas quando visível
      } else {
        entry.target.pause(); // Pausa para economizar CPU/GPU
      }
    });
  }, { threshold: 0.1 }); // Dispara quando 10% do vídeo aparece

  allVideos.forEach(video => videoObserver.observe(video));
};

document.addEventListener('DOMContentLoaded', optimizeVideos);

document.addEventListener('mousemove', function(e) {
  const snowflake = document.createElement('span');
  snowflake.innerHTML = '❄'; // Ou um SVG de floco
  snowflake.style.position = 'fixed';
  snowflake.style.left = e.clientX + 'px';
  snowflake.style.top = e.clientY + 'px';
  snowflake.style.pointerEvents = 'none';
  snowflake.style.color = 'rgba(180, 210, 255, 0.8)';
  snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
  snowflake.style.zIndex = '9999';
  
  // Animação de queda e fade
  const animation = snowflake.animate([
    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
    { transform: `translateY(50px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
  ], { duration: 1000, easing: 'ease-out' });

  document.body.appendChild(snowflake);
  animation.onfinish = () => snowflake.remove();
});

/* ===== Alternador de Tema (Dark/Light) ===== */
const themeToggleBtn = document.getElementById('theme-toggle');

// Recupera o tema guardado ou usa 'light' como predefinição
const currentTheme = localStorage.getItem('theme') || 'light';

// Aplica o tema inicial 
document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    // Inverte o estado do tema
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Aplica a mudança e guarda a preferência do utilizador
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });
}