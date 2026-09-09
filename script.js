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

const pontosConfirmados = [
  {nome:'Onze Mil Virgens',lat:-12.502039,lng:-38.954933,status:'visitada',precisao:'referencia-local',referencia:'Escola Constantino Ferreira de Miranda',nota:'Comunidade visitada. Marcador refinado por coordenada publicada para a Escola Constantino Ferreira de Miranda, cujo endereço é Povoado das Onze Mil Virgens. O IBGE também registra Onze Mil Virgens como povoado rural.'},
  {nome:'Mangabeira',lat:-12.475,lng:-38.980,status:'cartografica',precisao:'cartografica',referencia:'Escola Manoel Ribeiro Brandão',nota:'Localidade identificada na cartografia do IBGE e em registros escolares municipais. A escola funciona como referência documental; o ponto permanece aproximado até conferência em campo.'},
  {nome:'Mato Grosso',lat:-12.518,lng:-39.015,status:'cartografica',precisao:'cartografica',nota:'Localidade identificada na cartografia do IBGE. Posição aproximada, a confirmar em campo.'},
  {nome:'Murici',lat:-12.501,lng:-39.050,status:'cartografica',precisao:'cartografica',nota:'Localidade identificada na cartografia do IBGE. Posição aproximada, a confirmar em campo.'},
  {nome:'Timbó',lat:-12.519,lng:-38.966,status:'cartografica',precisao:'cartografica',nota:'Localidade identificada na cartografia do IBGE. Posição aproximada, a confirmar em campo.'},
  {nome:'Serra',lat:-12.532,lng:-38.990,status:'cartografica',precisao:'cartografica',referencia:'Escola Marcos Evangelista Serra',nota:'Localidade identificada na cartografia do IBGE e em registros escolares municipais. Ponto aproximado, a confirmar em campo.'},
  {nome:'Vieira',lat:-12.526,lng:-39.012,status:'cartografica',precisao:'cartografica',nota:'Localidade identificada na cartografia do IBGE. Posição aproximada, a confirmar em campo.'},
  {nome:'Jaqueira',lat:-12.517,lng:-38.944,status:'cartografica',precisao:'cartografica',nota:'Localidade identificada na cartografia do IBGE. Não confundir com Cajazeira. Posição aproximada, a confirmar em campo.'},
  {nome:'Baixinha da Pindobeira',lat:-12.507,lng:-38.956,status:'visitada',precisao:'cartografica',referencia:'Escola Maria Eunice Xavier Borja / USF Moacyr Ozório Pascoal',nota:'Comunidade visitada. A existência e o nome atual são corroborados por escola municipal e unidade de saúde com endereço no Povoado Baixinha da Pindobeira. O marcador ainda deriva da leitura cartográfica e precisa ser conferido pela equipe.'},
  {nome:'Teiru',lat:-12.480,lng:-38.975,status:'visitada',precisao:'cartografica',referencia:'Estrada Teru–Taperinha em documento territorial estadual',nota:'Comunidade visitada. A documentação territorial registra a variante Teru na estrada Teru–Taperinha. O marcador permanece aproximado: a referência de estrada não define o centro da comunidade.'}
];

const conexoesDocumentadas = [];

function etiquetaStatus(status){
  if(status==='referencia') return 'referência encontrada • ponto a confirmar';
  if(status==='cartografica') return 'localização cartográfica • a confirmar em campo';
  if(status==='revisar') return 'nome / relação territorial a verificar';
  if(status==='visitada') return 'comunidade já visitada pelo projeto';
  if(status==='pesquisa') return 'pesquisa em andamento';
  if(status==='confirmada') return 'localização confirmada em campo';
  return 'localização a confirmar em campo';
}

function legendaPrecisao(precisao){
  if(precisao==='campo') return 'Coordenada conferida em campo';
  if(precisao==='referencia-local') return 'Ponto de referência localizado dentro da comunidade';
  return 'Posição cartográfica aproximada — não é coordenada definitiva';
}

function urlComunidade(nome){
  return `comunidade.html?nome=${encodeURIComponent(nome)}`;
}

function renderLista(el, limite){
  if(!el) return;
  const itens = limite ? comunidades.slice(0,limite) : comunidades;
  el.innerHTML = itens.map((c,i)=>`<a class="item-comunidade" data-status="${c.status}" href="${urlComunidade(c.nome)}">
    <div class="numero-comunidade">${String(i+1).padStart(2,'0')}</div>
    <div><h3>${c.nome}</h3><p>${etiquetaStatus(c.status)}</p><span class="abrir-comunidade">Abrir comunidade</span></div>
  </a>`).join('');
}

function iniciarMapa(){
  const alvo=document.getElementById('map');
  if(!alvo || !window.L) return;
  const m=L.map('map',{scrollWheelZoom:false}).setView([-12.5078,-38.9978],12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(m);

  L.circleMarker([-12.5078,-38.9978],{radius:7,color:'#1d2822',weight:2,fillColor:'#f2eee4',fillOpacity:1})
   .addTo(m).bindPopup('<b>Sede de Conceição da Feira</b><br><span>Ponto de referência municipal. Não conta como comunidade mapeada.</span>');

  pontosConfirmados.forEach(p=>{
    const visitada=p.status==='pesquisa'||p.status==='visitada';
    const precisa=p.precisao==='campo'||p.precisao==='referencia-local';
    const cor=visitada?'#8b5d3b':'#4d6b58';
    const marcador=L.circleMarker([p.lat,p.lng],{
      radius:visitada?9:7,
      color:precisa?'#fff':'#f2eee4',
      weight:precisa?2:3,
      dashArray:precisa?null:'3 3',
      fillColor:cor,
      fillOpacity:precisa?1:.72
    }).addTo(m);
    marcador.bindPopup(`<b>${p.nome}</b><br>${etiquetaStatus(p.status)}<br><em>${legendaPrecisao(p.precisao)}.</em>${p.referencia?`<br><strong>Referência:</strong> ${p.referencia}`:''}${p.nota?`<br><small>${p.nota}</small>`:''}<br><a class="popup-botao" href="${urlComunidade(p.nome)}">Conhecer a comunidade</a>`);
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

function renderPaginaComunidade(){
  const titulo=document.getElementById('nome-comunidade');
  if(!titulo) return;
  const params=new URLSearchParams(window.location.search);
  const nome=params.get('nome') || '';
  const comunidade=comunidades.find(c=>c.nome===nome);
  if(!comunidade){
    titulo.textContent='Comunidade não encontrada';
    const intro=document.getElementById('intro-comunidade');
    if(intro) intro.textContent='Volte à cartografia para escolher uma comunidade identificada pela pesquisa.';
    return;
  }
  document.title=`${comunidade.nome} | Comunidades de Memória`;
  titulo.textContent=comunidade.nome;
  const status=document.getElementById('status-comunidade');
  if(status) status.textContent=etiquetaStatus(comunidade.status);
  const intro=document.getElementById('intro-comunidade');
  if(intro) intro.textContent=comunidade.status==='visitada'
    ? 'Esta comunidade já foi visitada pelo projeto. A página será ampliada com as fontes, trajetórias, fotografias, objetos, lugares e questões produzidas na pesquisa de campo.'
    : 'Esta página faz parte da cartografia aberta do projeto. Ela será ampliada à medida que a pesquisa reunir fontes, trajetórias, fotografias, objetos, lugares e questões sobre a comunidade.';
  const ponto=pontosConfirmados.find(p=>p.nome===comunidade.nome);
  const carto=document.getElementById('cartografia-comunidade');
  if(carto){
    carto.innerHTML=ponto
      ? `<p><b>Situação cartográfica:</b> ${legendaPrecisao(ponto.precisao)}.</p>${ponto.referencia?`<p><b>Referência:</b> ${ponto.referencia}</p>`:''}${ponto.nota?`<p>${ponto.nota}</p>`:''}<p><a href="index.html#cartografia">Ver no mapa geral</a></p>`
      : '<p>A localização desta comunidade ainda não possui marcador publicado. Confirmar a posição é parte da própria pesquisa.</p><p><a href="index.html#cartografia">Ver mapa geral</a></p>';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  renderLista(document.getElementById('lista-resumo'),12);
  renderLista(document.getElementById('lista-completa'));
  atualizarNumeros();
  iniciarMapa();
  filtrarComunidades();
  renderPaginaComunidade();
});