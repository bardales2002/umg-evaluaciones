const kpiTotal  = document.getElementById('kpi-total');
const kpiProm   = document.getElementById('kpi-prom');
const profList  = document.getElementById('profList');
const profSelect= document.getElementById('profSelect');
const btnDetalle= document.getElementById('btnDetalle');
const detalle   = document.getElementById('detalle');

const toNum = (v) => Number.parseFloat(v ?? 0) || 0;

function setDetalle(html){ detalle.innerHTML = html; }

async function loadStats(){
  try{
    const res = await fetch('/api/stats?_=' + Date.now(), { cache: 'no-store' });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    kpiTotal.textContent = toNum(data?.general?.total_respuestas);
    kpiProm.textContent  = toNum(data?.general?.promedio_general).toFixed(2);

    const lista = data?.por_profesor || [];
    profList.innerHTML = lista.map(p=>`
      <div class="prof-card">
        <h4>${p.nombre}</h4>
        <small>${p.curso}</small>
        <div class="score">Promedio: ${toNum(p.calificacion_promedio).toFixed(2)} (${toNum(p.cantidad_respuestas)} resp.)</div>
      </div>
    `).join('');

    profSelect.innerHTML = lista.map(p=>`
      <option value="${p.profesor_id}">${p.nombre} — ${p.curso}</option>
    `).join('');

    if (lista.length){
      profSelect.value = String(lista[0].profesor_id);
      await loadDetalle(); 
    } else {
      setDetalle('<p>No hay catedráticos.</p>');
    }
  }catch(err){
    console.error('loadStats error:', err);
    setDetalle(`<p style="color:#fbb">Error cargando estadísticas: ${String(err)}</p>`);
  }
}

async function loadDetalle(){
  const id = Number(profSelect.value);
  if(!id){ setDetalle('<p>No hay datos todavía.</p>'); return; }

  setDetalle('<p style="color:#9fb1d7">Cargando detalle…</p>');

  try{
    const url = `/api/stats?profesor_id=${id}&_=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok){
      setDetalle(`<p style="color:#fbb">Error HTTP ${res.status} al pedir ${url}</p>`);
      return;
    }
    const data = await res.json();
    const d = data?.detalle_profesor;

    if(!d){
      setDetalle('<p>No hay datos todavía.</p>');
      return;
    }

    setDetalle(`
      <p><strong>${d.nombre}</strong> — ${d.curso}</p>
      <div class="row">
        <div><b>Q1</b><br>${toNum(d.q1_prom).toFixed(2)}</div>
        <div><b>Q2</b><br>${toNum(d.q2_prom).toFixed(2)}</div>
        <div><b>Q3</b><br>${toNum(d.q3_prom).toFixed(2)}</div>
        <div><b>Q4</b><br>${toNum(d.q4_prom).toFixed(2)}</div>
        <div><b>Q5</b><br>${toNum(d.q5_prom).toFixed(2)}</div>
        <div><b>Prom.</b><br>${toNum(d.promedio).toFixed(2)}</div>
      </div>
      <p style="margin-top:8px;color:#9fb1d7">
        Respuestas: <b>${toNum(d.cantidad_respuestas)}</b> · <small>ID: ${d.profesor_id}</small>
      </p>
    `);
  }catch(err){
    console.error('loadDetalle error:', err);
    setDetalle(`<p style="color:#fbb">Error cargando detalle: ${String(err)}</p>`);
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  loadStats();
  profSelect.addEventListener('change', loadDetalle);
  btnDetalle.addEventListener('click', loadDetalle);
});
