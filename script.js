const comunidades = [
  {nome:'Desterro',status:'localizar'},
  {nome:'Grota',status:'localizar'},
  {nome:'Mangabeira',status:'cartografica'},
  {nome:'Pedreira',status:'localizar'},
  {nome:'Mato Grosso',status:'cartografica'},
  {nome:'Murici',status:'cartografica'},
  {nome:'Candeal',status:'referencia'},
  {nome:'Capela',status:'localizar'},
  {nome:'Onze Mil Virgens',status:'visitada'},
  {nome:'Cruzeiro',status:'localizar'},
  {nome:'Timbó',status:'cartografica'},
  {nome:'Vitória',status:'localizar'},
  {nome:'Umbalbeira',status:'revisar'},
  {nome:'Serra',status:'cartografica'},
  {nome:'Estrada Grande',status:'localizar'},
  {nome:'Teiru',status:'visitada'},
  {nome:'Baixinha da Pindobeira',status:'visitada'},
  {nome:'Quissanga',status:'localizar'},
  {nome:'Limoeiro',status:'localizar'},
  {nome:'Tabua do Cruzeiro',status:'revisar'},
  {nome:'Jaqueira',status:'cartografica'},
  {nome:'Bete',status:'revisar'},
  {nome:'Maraçauim',status:'revisar'},
  {nome:'Vieira',status:'cartografica'},
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

/*
  Pontos cartográficos da primeira versão.
  'cartografica' = posição aproximada lida nos mapas municipais/estatísticos do IBGE;
  deve ser conferida em campo antes de ser tratada como coordenada definitiva.
  'visitada' = comunidade já visitada pelo PIBID; a nota informa a origem da posição.
*/
const pontosConfirmados = [
  {nome:'Onze Mil Virgens',lat:-12.5053,lng:-38.9557,status:'visitada',precisao:'confirmada',nota:'Comunidade visitada pelo projeto. Posição baseada no setor rural do Censo 2022 do IBGE.'},
  {nome:'Mangabeira',lat:-12.475,lng:-38.980,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Mato Grosso',lat:-12.518,lng:-39.015,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Murici',lat:-12.501,lng:-39.050,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Timbó',lat:-12.519,lng:-38.966,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Serra',lat:-12.532,lng:-38.990,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Vieira',lat:-12.526,lng:-39.012,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Jaqueira',lat:-12.517,lng:-38.944,status:'cartografica',precisao:'aproximada',nota:'Localidade identificada no mapa estatístico do IBGE. Ponto aproximado, a confirmar em campo.'},
  {nome:'Baixinha da Pindobeira',lat:-12.507,lng:-38.956,status:'visitada',precisao:'aproximada',nota:'Comunidade visitada pelo projeto e identificada como Baixinha/Baixinha da Pindobeira nas fontes. Ponto cartográfico aproximado, a confirmar com registro de campo.'},
  {nome:'Teiru',lat:-12.480,lng:-38.975,status:'visitada',precisao:'aproximada',nota:'Comunidade visitada pelo projeto. Posição aproximada a partir da cartografia de referência; confirmar com registro de campo.'}
];

/* Cajazeira já foi visitada, mas ainda não recebeu ponto: o mapa enviado mostra Jaqueira, que não deve ser confundida com Cajazeira. */

/* Relações documentadas em entrevistas. Não inserir conexões demonstrativas. */
const conexoesDocumentadas = [];

function etiquetaStatus(status){
  if(status==='referencia') return 'referência encontrada • ponto a confirmar';
  if(status==='cartografica') return 'localização cartográfica • a confirmar em campo';
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
    const visitada=p.status==='pesquisa'||p.status==='visitada';
    const cor=visitada?'#8b5d3b':'#4d6b58';
    const marcador=L.circleMarker([p.lat,p.lng],{
      radius:visitada?9:7,
      color:p.precisao==='aproximada'?'#f2eee4':'#fff',
      weight:p.precisao==='aproximada'?3:2,
      dashArray:p.precisao==='aproximada'?'3 3':null,
      fillColor:cor,
      fillOpacity:p.precisao==='aproximada'?.72:1
    }).addTo(m);
    marcador.bindPopup(`<b>${p.nome}</b><br>${etiquetaStatus(p.status)}${p.precisao==='aproximada'?'<br><em>Posição aproximada — não é coordenada definitiva.</em>':''}${p.nota?`<br><small>${p.nota}</small>`:''}${p.pagina?`<br><a href="${p.pagina}">Conhecer a comunidade</a>`:''}`);
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