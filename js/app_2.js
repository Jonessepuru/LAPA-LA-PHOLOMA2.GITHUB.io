// Full Lapa La Pholoma - Main JS with TYPABLE Surname, Parent, Lapa
let lang = localStorage.getItem('lapa_lang') || 'nso';
let gender = 'F';
let notes = [];

function applyLang(l){
  window._lang = l; 

  try{
    lang = l;
    localStorage.setItem('lapa_lang', l);
    if(typeof dict !== 'undefined' && dict[l]){
      document.querySelectorAll('[data-t]').forEach(el=>{
        const k = el.getAttribute('data-t');
        if(dict[l][k]) el.innerHTML = dict[l][k];
      });
    }
    const btnEn = document.getElementById('btn-en');
    const btnNso = document.getElementById('btn-nso');
    if(btnEn) btnEn.classList.toggle('active', l==='en');
    if(btnNso) btnNso.classList.toggle('active', l==='nso');
    // Update EST text if needed
    const estEl = document.querySelector('[data-t="hero_est"]');
    if(estEl && l==='nso' && estEl.innerHTML.includes('1920-2025')){
      estEl.innerHTML = 'EST. LIMPOPO. 1854-2026 • BAOBAB';
    }
    console.log('Language switched to', l);
  } catch(e){
    console.error('applyLang error', e);
    // Still toggle active class even if error
    const btnEn = document.getElementById('btn-en');
    const btnNso = document.getElementById('btn-nso');
    if(btnEn) btnEn.classList.toggle('active', l==='en');
    if(btnNso) btnNso.classList.toggle('active', l==='nso');
  }
}

function setG(g){
  gender = g;
  document.getElementById('gF').classList.toggle('active', g==='F');
  document.getElementById('gM').classList.toggle('active', g==='M');
  updatePreview();
}

function addNoteFromInput(){
  const v = document.getElementById('noteInput').value.trim();
  if(!v) return;
  if(!notes.includes(v)) notes.push(v);
  document.getElementById('noteInput').value='';
  renderNotes();
  updatePreview();
}

function addNote(v){
  if(!v) return;
  if(!notes.includes(v)) notes.push(v);
  renderNotes();
  updatePreview();
}

function renderNotes(){
  document.getElementById('noteChips').innerHTML = notes.map(n=>`<span class="chip active" onclick="notes=notes.filter(x=>x!=='${n}');renderNotes();updatePreview()">${n} ✕</span>`).join('');
}

function renderTree(){
  const gen1 = members.filter(m=>m.gen===1);
  const gen2 = members.filter(m=>m.gen===2);
  const gen3Pula = members.filter(m=>m.lapa==='Lapa la Pula');
  const genWives = members.filter(m=>m.lapa.includes('Leka'));
  const genMoloto = members.filter(m=>m.bio.includes('Leka le Moloto'));

  const gen1El = document.getElementById('gen1');
  if(gen1El) gen1El.innerHTML = gen1.map(m=>`
    <div class="node-card">
      <div style="display:flex;align-items:center"><div class="avatar" style="background:${m.gender==='M'?'#60a5fa':'#f472b6'}">${m.first[0]}</div>
      <div><b style="font-size:12px">${m.first} ${m.last} ${m.surname}</b><div style="font-size:10px;color:#64748b">${m.lapa}</div></div></div>
    </div>`).join('');

  const gen2El = document.getElementById('gen2');
  if(gen2El) gen2El.innerHTML = gen2.map(m=>`
    <div class="node-card ${m.note.includes('timela')?'faded':''}">
      <div style="display:flex;align-items:center"><div class="avatar" style="background:${m.gender==='M'?'#60a5fa':'#f472b6'}">${m.first[0]}</div>
      <div><b style="font-size:11px">${m.first} ${m.surname}</b><div style="font-size:9px;color:#64748b">${m.last} ${m.aka?'/ '+m.aka:''}</div></div></div>
      ${m.lapa?`<span class="badge badge-lapa">${m.lapa}</span>`:''}
      ${m.surname?`<span class="badge badge-note">${m.surname}</span>`:''}
      ${m.note?`<span class="badge badge-note">${m.note}</span>`:''}
    </div>`).join('');

  const genPulaEl = document.getElementById('genPula');
  if(genPulaEl) genPulaEl.innerHTML = gen3Pula.map(m=>`
    <div class="node-card"><div style="display:flex;align-items:center"><div class="avatar" style="background:#f472b6">${m.first[0]}</div>
    <div><b style="font-size:11px">${m.first} ${m.last} ${m.surname}</b></div></div><span class="badge badge-lapa">Lapa la Pula - ${m.surname}</span></div>`).join('');

  const genLekaEl = document.getElementById('genLeka');
  if(genLekaEl) genLekaEl.innerHTML = `
    <div style="width:100%;text-align:center;margin:8px 0;font-size:12px;color:#64748b">Basadi ba Leka: Ngwana Moloto & Ngwana Chokoe</div>
    ${genWives.map(m=>`<div class="node-card"><b style="font-size:11px">${m.first} ${m.last} ${m.surname}</b><br><span class="badge badge-lapa">${m.lapa}</span></div>`).join('')}
    <div style="width:100%;text-align:center;margin:12px 0;color:#cbd5e1">↓ Bana ba Moloto (7)</div>
    ${genMoloto.map(m=>`<div class="node-card"><b style="font-size:11px">${m.first} ${m.last} ${m.surname}</b></div>`).join('')}
  `;

  const grid = document.getElementById('membersGrid');
  if(grid) grid.innerHTML = members.map(m=>`
    <div class="member-card">
      <div style="display:flex;gap:8px;align-items:center"><div class="avatar" style="background:${m.gender==='M'?'#60a5fa':'#f472b6'}">${m.first[0]}</div>
      <div><b style="font-size:13px">${m.first} ${m.last} ${m.surname}</b><div style="font-size:11px;color:#64748b">${m.aka?'/ '+m.aka:''} • Gen${m.gen}</div></div></div>
      ${m.lapa?`<span class="badge badge-lapa">${m.lapa}</span>`:''}
      ${m.surname?`<span class="badge badge-note">Surname: ${m.surname}</span>`:''}
      ${m.note?`<span class="badge badge-note">${m.note}</span>`:''}
      <div style="font-size:11px;color:#94a3b8;margin-top:6px">Gen${m.gen} • ${m.gender} • ${m.surname}</div>
    </div>`).join('');

  // Update parent datalist and select
  const parentList = document.getElementById('parentList');
  const parentSelect = document.getElementById('parentSelect');
  const parentHidden = document.getElementById('parent');
  if(parentList){
    parentList.innerHTML = members.map(mem=>`<option value="${mem.first} ${mem.last} ${mem.surname}">`).join('');
  }
  if(parentSelect){
    parentSelect.innerHTML = '<option value="">Or choose from list (31 members)...</option>' + members.map(mem=>`<option value="${mem.id}">${mem.first} ${mem.last} ${mem.surname} (Gen${mem.gen}) - ${mem.lapa}</option>`).join('');
  }
  if(parentHidden && members.length>0 && !parentHidden.value){
    parentHidden.value = members[0].id;
  }
}

function updatePreview(){
  const f = document.getElementById('first').value || 'Leina';
  const l = document.getElementById('last').value || '';
  const a = document.getElementById('aka').value || '';
  const b = document.getElementById('bio').value || '';
  const lapa = document.getElementById('lapaInput').value || '';
  let surname = document.getElementById('surnameInput').value || 'Sepuru';
  const parentTyped = document.getElementById('parentInput').value || '';
  const parentSelectVal = document.getElementById('parentSelect').value || '';
  let parentId = document.getElementById('parent').value || 1;
  // If user typed parent name, try to find ID, else use select
  if(parentSelectVal){
    parentId = parentSelectVal;
    document.getElementById('parent').value = parentId;
  }
  const parentObj = members.find(m=>m.id==parentId) || members.find(m=> (m.first+' '+m.last+' '+m.surname).toLowerCase().includes(parentTyped.toLowerCase()));
  const parentName = parentObj ? `${parentObj.first} ${parentObj.surname}` : (parentTyped || 'Pholoma Sepuru');
  const parentSurname = parentObj ? parentObj.surname : '';
  
  const previewEl = document.getElementById('preview');
  if(previewEl) previewEl.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center"><div class="avatar" style="background:${gender==='M'?'#60a5fa':'#f472b6'}">${f[0]||'?'}</div>
    <div><b>${f} ${l} ${surname}</b><div style="font-size:11px;color:#64748b">${a?'/ '+a:''} • Parent: ${parentName}</div></div></div>
    ${lapa?`<span class="badge badge-lapa">${lapa}</span>`:''}
    <span class="badge badge-note">Surname: ${surname}</span>
    ${notes.map(n=>`<span class="badge badge-note">${n}</span>`).join(' ')}
    <div style="font-size:11px;color:#64748b;margin-top:6px">${b}</div>
    <div style="font-size:10px;color:#94a3b8;margin-top:6px">Parent: ${parentName} (ID: ${parentId})<br>Typed Parent: ${parentTyped}<br>Lapa: ${lapa}<br>Surname: ${surname}</div>`;
  const nid = members.length+1;
  const sqlEl = document.getElementById('sqlBox');
  if(sqlEl) sqlEl.innerText = `-- NEW MEMBER with TYPED Surname, Lapa Label, Parent Name
-- Typed Surname: ${surname}, Typed Lapa: ${lapa}, Typed Parent: ${parentTyped || parentName}
INSERT INTO members (id, first_name, last_name, surname, gender, bio, generation, aka, note, lapa_label) VALUES (${nid}, '${f}', '${l}', '${surname}', '${gender}', '${b.replace(/'/g,"''")}', 2, '${a}', '${notes.join(', ')}', '${lapa}');
-- Parent: ${parentName} (ID ${parentId}) is parent of new member
INSERT INTO relationships (person_id, related_to_id, type) VALUES (${parentId}, ${nid}, 'child');`;
}

function addMember(){
  const f = document.getElementById('first').value.trim();
  if(!f){ alert('Tsenya leina la pele / Enter First Name'); return; }
  let surname = document.getElementById('surnameInput').value.trim();
  if(!surname){ alert('Tsenya Surname / Type Surname - e.g. Sepuru'); return; }
  const lapa = document.getElementById('lapaInput').value.trim();
  if(!lapa){ alert('Tsenya Lapa Label / Type Lapa - e.g. Lapa la Sepuru'); return; }
  let parentId = parseInt(document.getElementById('parent').value);
  const parentTyped = document.getElementById('parentInput').value.trim();
  // If parent typed and not matching ID, try to find member by name, else create as typed name
  let parent = members.find(m=>m.id===parentId);
  if(parentTyped){
    const found = members.find(m=> (m.first+' '+m.last+' '+m.surname).toLowerCase().includes(parentTyped.toLowerCase()) || m.first.toLowerCase()===parentTyped.toLowerCase());
    if(found){ parent = found; parentId = found.id; }
  }
  if(!parentId){ parentId = 1; parent = members[0]; }
  
  const m = {
    id:members.length+1, 
    first:f, 
    last:document.getElementById('last').value.trim(), 
    surname:surname,
    aka:document.getElementById('aka').value.trim(), 
    note:notes.join(', '), 
    lapa:lapa, 
    gen:(parent?parent.gen+1:2), 
    gender:gender, 
    bio:document.getElementById('bio').value.trim(),
    parentId: parentId,
    parentTypedName: parentTyped
  };
  members.push(m);
  relationships.push({p:parentId, c:m.id});
  renderTree();
  updatePreview();
  alert(`${f} ${surname} o okeditšwe!\n\nSurname (typed): ${surname}\nLapa (typed): ${lapa}\nParent (typed): ${parentTyped || parent.first+' '+parent.surname} (ID ${parentId})\n\nGodišitšwe mo setlhareng!`);
  // Reset but keep surname/lapa suggestions
  document.getElementById('first').value='';document.getElementById('last').value='';document.getElementById('aka').value='';document.getElementById('bio').value='';document.getElementById('parentInput').value='';document.getElementById('noteInput').value='';notes=[];renderNotes();
}

function initApp(){
  // Fix SEP/EN toggle - ensure buttons work
  const btnEn = document.getElementById('btn-en');
  const btnNso = document.getElementById('btn-nso');
  if(btnEn){
    btnEn.onclick = (e)=>{
      e.preventDefault();
      applyLang('en');
      console.log('EN clicked');
    };
  }
  if(btnNso){
    btnNso.onclick = (e)=>{
      e.preventDefault();
      applyLang('nso');
      console.log('SEP clicked');
    };
  }
  // Also add event listeners via addEventListener as backup
  if(btnEn) btnEn.addEventListener('click', ()=>applyLang('en'));
  if(btnNso) btnNso.addEventListener('click', ()=>applyLang('nso'));
  
  applyLang(lang);
  renderTree();
  updatePreview();
  
  ['first','last','aka','bio','surnameInput','lapaInput','parentInput','noteInput'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', updatePreview);
  });
  
  const parentSelect = document.getElementById('parentSelect');
  if(parentSelect){
    parentSelect.addEventListener('change', (e)=>{
      const hidden = document.getElementById('parent');
      if(hidden) hidden.value = e.target.value;
      const mem = members.find(m=>m.id==e.target.value);
      const parentInput = document.getElementById('parentInput');
      if(mem && parentInput) parentInput.value = `${mem.first} ${mem.last} ${mem.surname}`;
      updatePreview();
    });
  }
  
  const searchEl = document.getElementById('search');
  if(searchEl){
    searchEl.addEventListener('input', e=>{
      const q = e.target.value.toLowerCase();
      const filtered = members.filter(m=>(m.first+m.last+m.surname+m.aka+m.lapa+m.note).toLowerCase().includes(q));
      const grid = document.getElementById('membersGrid');
      if(grid) grid.innerHTML = filtered.map(m=>`<div class="member-card"><b>${m.first} ${m.last} ${m.surname}</b> ${m.aka?'/ '+m.aka:''}<br><span class="badge badge-lapa">${m.lapa||''}</span><br><span class="badge badge-note">${m.surname}</span></div>`).join('');
    });
  }
  
  const fGenEl = document.getElementById('fGen');
  if(fGenEl){
    fGenEl.addEventListener('change', e=>{
      const v = e.target.value;
      const filt = v==='all'?members:members.filter(m=>m.gen==v);
      const grid = document.getElementById('membersGrid');
      if(grid) grid.innerHTML = filt.map(m=>`<div class="member-card"><b>${m.first} ${m.surname}</b><br><span class="badge">${m.lapa||'Gen'+m.gen}</span></div>`).join('');
    });
  }
  
  console.log('App initialized - SEP/EN buttons fixed');
}

// Run init even if DOMContentLoaded already fired
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Also run after short delay as backup for SEP/EN
setTimeout(()=>{
  const btnEn = document.getElementById('btn-en');
  const btnNso = document.getElementById('btn-nso');
  if(btnEn && !btnEn.onclick) btnEn.onclick = ()=>applyLang('en');
  if(btnNso && !btnNso.onclick) btnNso.onclick = ()=>applyLang('nso');
}, 500);


window.applyLang = applyLang;
window.setG = setG;
window.addMember = addMember;
window.addNoteFromInput = addNoteFromInput;
