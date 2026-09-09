const comunidades = [
  {nome:'Desterro',status:'localizar'},
  {nome:'Grota',status:'localizar'},
  {nome:'Mangabeira',status:'localizar'},
  {nome:'Pedreira',status:'localizar'},
  {nome:'Mato Grosso',status:'localizar'},
  {nome:'Murici',status:'localizar'},
  {nome:'Candeal',status:'referencia'},
  {nome:'Capela',status:'localizar'},
  {nome:'Onze Mil Virgens',status:'visitada'},
  {nome:'Cruzeiro',status:'localizar'},
  {nome:'Timbó',status:'localizar'},
  {nome:'Vitória',status:'localizar'},
  {nome:'Umbalbeira',status:'revisar'},
  {nome:'Serra',status:'localizar'},
  {nome:'Estrada Grande',status:'localizar'},
  {nome:'Teiru',status:'visitada'},
  {nome:'Baixinha da Pindobeira',status:'visitada'},
  {nome:'Quissanga',status:'localizar'},
  {nome:'Limoeiro',status:'localizar'},
  {nome:'Tabua do Cruzeiro',status:'localizar'},
  {nome:'Jaqueira',status:'localizar'},
  {nome:'Bete',status:'revisar'},
  {nome:'Maraçauim',status:'revisar'},
  {nome:'Vieira',status:'localizar'},
  {nome:'Cajazeira',status:'visitada'},
  {nome:'Cruz de Alma',status:'localizar'},
  {nome:'Pau a Pique',status:'localizar'},
  {nome:'Aldeia',status:'localizar'},
  {nome:'Laranjeira',status:'localizar'},
  {nome:'Salgado',status:'localizar'},
  {nome:'Bambuzal',status:'localizar'},
  {nome:'Quilombo',status:'localizar'},
  {nome:'Bete 1',status:'revisar'},
  {nome:'Bete 2',status:'revisar'}
];

/* Pontos entram aqui apenas quando há base cartográfica suficiente para a posição. */
const pontosConfirmados = [
  {nome:'Onze Mil Virgens',lat:-12.5053,lng:-38.9557,status:'visitada',nota:'Comunidade visitada pelo projeto. Posição baseada no setor rural do Censo 2022 do IBGE.'}
];

/* Relações documentadas em entrevistas. Não inserir conexões demonstrativas. */
const conexoesDocumentadas = [];

function etiquetaStatus(status){
  if(status==='referencia') return 'referência encontrada • ponto a confirmar';
  if(status==='revisar') return 'nome / relação territorial a verificar';
  if(status==='visitada') return 'comunidade já visitada pelo projeto';
  if(status==='pesquisa') return 'pesquisa em andamento';
  if(status==='confirmada') return 'localização confirmada';
  return 'localização a confirmar em campo';
}

function renderLista(el, limite){
  if(!el) return;
  const itens = limite ? comunidades.slice(0,limite) : comunidades;
  el.innerHTML = itens.map((c,i)=>`<article class="item-comunidade" data-status="${c.status}">
    <div class="numero-comunidade">${String(i+1).padStart(2,'0')}</div>
    <div><h3>${c.nome}</h3><p>${etiquetaStatus(c.status)}</p></div>
  </article>`).join('');
}

function iniciarMapa(){
  const alvo=document.getElementById('map');
  if(!alvo || !window.L) return;
  const m=L.map('map',{scrollWheelZoom:false}).setView([-12.5078,-38.9978],12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(m);

  L.circleMarker([-12.5078,-38.9978],{
    radius:7,color:'#1d2822',weight:2,fillColor:'#f2eee4',fillOpacity:1
  }).addTo(m).bindPopup('<b>Sede de Conceição da Feira</b><br><span>Ponto de referência municipal. Não conta como comunidade mapeada.</span>');

  pontosConfirmados.forEach(p=>{
    const cor=p.status==='pesquisa'||p.status==='visitada'?'#8b5d3b':'#4d6b58';
    const marcador=L.circleMarker([p.lat,p.lng],{radius:8,color:'#fff',weight:2,fillColor:cor,fillOpacity:1}).addTo(m);
    marcador.bindPopup(`<b>${p.nome}</b><br>${etiquetaStatus(p.status)}${p.nota?`<br><small>${p.nota}</small>`:''}${p.pagina?`<br><a href="${p.pagina}">Conhecer a comunidade</a>`:''}`);
  });

  conexoesDocumentadas.forEach(c=>{
    const a=pontosConfirmados.find(p=>p.nome===c.de);
    const b=pontosConfirmados.find(p=>p.nome===c.para);
    if(a&&b){
      L.polyline([[a.lat,a.lng],[b.lat,b.lng]],{color:'#8b5d3b',weight:3,dashArray:'7 7'}).addTo(m)
       .bindPopup(`<b>${c.de} ↔ ${c.para}</b><br>${c.tipo}<br><small>${c.fonte}</small>`);
    }
  });
}

function atualizarNumeros(){
  const ids={
    'total-comunidades':comunidades.length,
    'total-mapeadas':pontosConfirmados.length,
    'total-pesquisa':comunidades.filter(p=>p.status==='pesquisa'||p.status==='visitada').length,
    'total-conexoes':conexoesDocumentadas.length
  };
  Object.entries(ids).forEach(([id,valor])=>{const el=document.getElementById(id);if(el)el.textContent=valor;});
}

function filtrarComunidades(){
  const campo=document.getElementById('busca-comunidades');
  if(!campo) return;
  campo.addEventListener('input',()=>{
    const termo=campo.value.toLocaleLowerCase('pt-BR').trim();
    document.querySelectorAll('#lista-completa .item-comunidade').forEach(item=>{
      item.hidden=!item.textContent.toLocaleLowerCase('pt-BR').includes(termo);
    });
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  renderLista(document.getElementById('lista-resumo'),12);
  renderLista(document.getElementById('lista-completa'));
  atualizarNumeros();
  iniciarMapa();
  filtrarComunidades();
});