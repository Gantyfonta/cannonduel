/* =========================================================================
   PROJECTILE EDITOR UI MODULE
   ========================================================================= */
(() => {
  const modal = document.getElementById('editorModal');
  const openBtn = document.getElementById('editProjBtn');
  const closeBtn = document.getElementById('closeEditorBtn');
  const listEl = document.getElementById('editorProjList');
  const form = document.getElementById('projForm');

  if (!modal || !openBtn) return;

  // Open & Close
  openBtn.addEventListener('click', () => {
    refreshList();
    modal.hidden = false;
  });

  closeBtn.addEventListener('click', () => {
    modal.hidden = true;
  });

  // Render the current list of projectiles with controls
  function refreshList() {
    if (!window.ProjectileCreator) return;
    const all = window.ProjectileCreator.getAll();

    listEl.innerHTML = all.map(p => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.08); padding:8px 12px; border-radius:8px; font-size:0.9rem;">
        <div>
          <b style="color:var(--teal);">${p.name}</b> <small style="opacity:0.7;">(${p.id})</small>
          <div style="font-size:0.75rem; opacity:0.8;">Bounces: ${p.maxBounces} | Gravity: ${p.gravityMult}x | Blast: ${p.blast}</div>
        </div>
        <div style="display:flex; gap:6px;">
          <button type="button" onclick="ProjectileEditor.loadIntoForm('${p.id}')" style="background:#2c3845; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">Edit</button>
          <button type="button" onclick="ProjectileCreator.${p.enabled ? 'disable' : 'enable'}('${p.id}'); ProjectileEditor.refresh();" style="background:${p.enabled ? '#ff5f59' : '#46a95a'}; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">
            ${p.enabled ? 'Disable' : 'Enable'}
          </button>
          <button type="button" onclick="ProjectileCreator.remove('${p.id}'); ProjectileEditor.refresh();" style="background:#8a2a27; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">Delete</button>
        </div>
      </div>
    `).join('');
  }

  // Populate form for editing existing projectile
  function loadIntoForm(id) {
    const p = window.ProjectileCreator.get(id);
    if (!p) return;

    document.getElementById('f_id').value = p.id;
    document.getElementById('f_name').value = p.name;
    document.getElementById('f_r').value = p.r;
    document.getElementById('f_blast').value = p.blast;
    document.getElementById('f_gravity').value = p.gravityMult;
    document.getElementById('f_airRes').value = p.airRes;
    document.getElementById('f_bounces').value = p.maxBounces;
    document.getElementById('f_bounciness').value = p.bounciness;
    document.getElementById('f_speedBase').value = p.speedBase;
    document.getElementById('f_speedMult').value = p.speedMult;
    document.getElementById('f_desc').value = p.description || '';
    document.getElementById('f_color').value = p.color || '#14b8f2';
  }

  // Form submission: Create or Update Projectile
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!window.ProjectileCreator) return;

    const id = document.getElementById('f_id').value.trim().toLowerCase();
    const color = document.getElementById('f_color').value;

    window.ProjectileCreator.register(id, {
      name: document.getElementById('f_name').value.trim(),
      r: parseFloat(document.getElementById('f_r').value),
      blast: parseFloat(document.getElementById('f_blast').value),
      gravityMult: parseFloat(document.getElementById('f_gravity').value),
      airRes: parseFloat(document.getElementById('f_airRes').value),
      maxBounces: parseInt(document.getElementById('f_bounces').value, 10),
      bounciness: parseFloat(document.getElementById('f_bounciness').value),
      speedBase: parseFloat(document.getElementById('f_speedBase').value),
      speedMult: parseFloat(document.getElementById('f_speedMult').value),
      description: document.getElementById('f_desc').value.trim(),
      color: color,
      draw: (ctx, p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin || 0);
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.strokeStyle = '#0b0a10';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });

    refreshList();
    form.reset();
  });

  // Expose helper to global scope for button inline callbacks
  window.ProjectileEditor = {
    refresh: refreshList,
    loadIntoForm: loadIntoForm
  };
})();
