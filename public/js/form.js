const profesorSelect = document.getElementById('profesor');
const form = document.getElementById('evalForm');
const toast = document.getElementById('toast');

function showToast(msg, ok=true){
  toast.textContent = msg;
  toast.style.display = 'block';
  toast.style.borderColor = ok ? '#214c37' : '#5a1f25';
  toast.style.color = ok ? '#c7ffe7' : '#ffd7dc';
  setTimeout(()=> toast.style.display='none', 2200);
}

async function loadProfesores(){
  try {
    const res = await fetch('/api/profesores');
    const data = await res.json();
    if(!data.ok) throw new Error('No se pudo cargar profesores');
    profesorSelect.innerHTML = `<option value="">Seleccione...</option>` +
      data.data.map(p => `<option value="${p.id}">${p.nombre} — ${p.curso}</option>`).join('');
  } catch (e) {
    showToast('Error cargando catedráticos', false);
    console.error(e);
  }
}

function buildStars(){
  document.querySelectorAll('.stars').forEach(wrapper=>{
    const field = wrapper.getAttribute('data-field');
    wrapper.innerHTML = '';
    for (let i=1; i<=5; i++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'star';
      btn.textContent = i;
      btn.dataset.value = i;
      btn.addEventListener('click', ()=>{
        Array.from(wrapper.children).forEach(ch=>{
          ch.classList.toggle('active', Number(ch.dataset.value) <= i);
        });
        wrapper.dataset.selected = i;
      });
      wrapper.appendChild(btn);
    }
    wrapper.dataset.selected = 5;
    Array.from(wrapper.children).forEach(ch=> ch.classList.add('active'));
  });
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const profesor_id = Number(profesorSelect.value);
  if(!profesor_id){ showToast('Selecciona un catedrático', false); return; }

  const payload = { profesor_id };
  document.querySelectorAll('.stars').forEach(w=>{
    const field = w.getAttribute('data-field'); 
    payload[field] = Number(w.dataset.selected || 0);
  });

  const comentario = document.getElementById('comentario').value.trim();
  if(!comentario){ showToast('El comentario es obligatorio', false); return; }
  payload.comentario = comentario;

  try{
    const res = await fetch('/api/evaluaciones', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(!res.ok || !data.ok){
      const msg = data?.errors?.[0]?.msg || data?.message || 'Error al registrar';
      showToast(msg, false);
      return;
    }
    showToast('¡Evaluación registrada!');
    form.reset();
    buildStars();
  }catch(err){
    console.error(err);
    showToast('Error de red', false);
  }
});

window.addEventListener('DOMContentLoaded', ()=>{
  buildStars();
  loadProfesores();
});
