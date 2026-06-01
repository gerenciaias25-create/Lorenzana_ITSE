// =========================================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN DEL ENTORNO DEL MAPA
// =========================================================================
const map = L.map('map').setView([23.6345, -102.5528], 5);
let geojsonLayer;
// Variable de control global para definir qué métrica renderizar en el mapa ('itse' o 'ivs')
let currentMetric = 'itse'; 

// Azulejos del mapa estilo oscuro sutil (CartoDB DarkMatter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// =========================================================================
// 2. FUENTE DE DATOS GENERAL (MATRIZ DE RIESGO 2027)
// =========================================================================
const dataset = {
  // DATASET ACTUALIZADO: Estudio Nacional de Tensión Social Estatal 2026-2027

  "Sinaloa": { itse: 82, ivs: 91, nivel: "Crítica", impacto: "Crítico", focos: ["Violencia criminal", "Desplazamiento forzado", "Desapariciones", "Tensión institucional"], detalles: ["Violencia/Miedo: 92/100", "Conflictos sectoriales: 70/100", "Gobernabilidad: 82/100"], tesis: "Híbrido de conflictividad múltiple con severo impacto por fragmentación criminal." },
  "Chiapas": { itse: 82, ivs: 89, nivel: "Crítica", impacto: "Crítico", focos: ["Crimen fronterizo", "Tráfico/Migración masiva", "Desplazamiento", "Conflictos comunitarios"], detalles: ["Violencia/Miedo: 84/100", "Conflictos sectoriales: 82/100", "Gobernabilidad: 78/100"], tesis: "Convergencia crítica de vulnerabilidad fronteriza internacional y choques agrarios." },
  "Guerrero": { itse: 82, ivs: 88, nivel: "Crítica", impacto: "Crítico", focos: ["Violencia criminal", "Ataques al transporte", "Crisis turística", "Debilidad municipal"], detalles: ["Violencia/Miedo: 88/100", "Conflictos sectoriales: 80/100", "Gobernabilidad: 76/100"], tesis: "Combinación de alta criminalidad sectorial con parálisis político-administrativa." },
  "Michoacán": { itse: 80, ivs: 85, nivel: "Crítica", impacto: "Crítico", focos: ["Extorsión agrícola", "Aguacate y limón", "Movilización CNTE", "Bloqueos viales"], detalles: ["Violencia/Miedo: 84/100", "Conflictos sectoriales: 82/100", "Gobernabilidad: 72/100"], tesis: "Presión constante sobre cadenas agroexportadoras estratégicas y activismo gremial." },
  "Guanajuato": { itse: 75, ivs: 84, nivel: "Crítica", impacto: "Crítico", focos: ["Homicidio doloso", "Extorsión comercial", "Corredores industriales", "Disputa delictiva"], detalles: ["Violencia/Miedo: 90/100", "Conflictos sectoriales: 60/100", "Gobernabilidad: 70/100"], tesis: "Persistente conflicto letal que afecta de manera colateral perímetros industriales." },
  "Estado de México": { itse: 75, ivs: 77, nivel: "Crítica", impacto: "Alto", focos: ["Robo al transporte", "Estrés hídrico", "Feminicidios", "Extorsión urbana"], detalles: ["Violencia/Miedo: 76/100", "Conflictos sectoriales: 78/100", "Gobernabilidad: 70/100"], tesis: "Irritación social acumulada por deficiencias crónicas en servicios y alta victimización." },
  "Morelos": { itse: 74, ivs: 81, nivel: "Crítica", impacto: "Crítico", focos: ["Violencia letal", "Feminicidios", "Desconfianza institucional", "Crisis de seguridad"], detalles: ["Violencia/Miedo: 82/100", "Conflictos sectoriales: 62/100", "Gobernabilidad: 78/100"], tesis: "Agotamiento institutional agudo combinado con impunidad penal percibida." },
  "Zacatecas": { itse: 73, ivs: 77, nivel: "Crítica", impacto: "Alto", focos: ["Inseguridad carretera", "Parálisis minera", "Crisis del campo", "Desplazamiento rural"], detalles: ["Violencia/Miedo: 80/100", "Conflictos sectoriales: 68/100", "Gobernabilidad: 68/100"], tesis: "Vulnerabilidad en ejes logísticos de carga y estancamiento productivo regional." },
  "Veracruz": { itse: 72, ivs: 76, nivel: "Crítica", impacto: "Alto", focos: ["Incidentes energéticos", "Demandas de agua", "Disputas municipales", "Movilizaciones"], detalles: ["Violencia/Miedo: 74/100", "Conflictos sectoriales: 72/100", "Gobernabilidad: 70/100"], tesis: "Fricciones recurrentes en zonas de extracción de hidrocarburos y sindicatos locales." },
  "Tabasco": { itse: 72, ivs: 75, nivel: "Crítica", impacto: "Alto", focos: ["Riesgos climatológicos", "Inundaciones", "Conflictos petroleros", "Delincuencia urbana"], detalles: ["Violencia/Miedo: 72/100", "Conflictos sectoriales: 76/100", "Gobernabilidad: 68/100"], tesis: "Vulnerabilidad ambiental combinada con reajustes contractuales del sector energético." },
  "Oaxaca": { itse: 72, ivs: 82, nivel: "Crítica", impacto: "Alto", focos: ["Paros magisteriales", "Conflictos agrarios", "Megaproyectos", "Tenencia de tierra"], detalles: ["Violencia/Miedo: 62/100", "Conflictos sectoriales: 86/100", "Gobernabilidad: 66/100"], tesis: "Histórica organización sectorial en fricción con obras federales de infraestructura." },
  "Baja California": { itse: 71, ivs: 79, nivel: "Crítica", impacto: "Alto", focos: ["Contención migratoria", "Aduanas saturadas", "Violencia metropolitana"], detalles: ["Violencia/Miedo: 78/100", "Conflictos sectoriales: 65/100", "Gobernabilidad: 68/100"], tesis: "Estrés de servicios urbanos e infraestructura derivado de flujos internacionales masivos." },
  "Tamaulipas": { itse: 71, ivs: 76, nivel: "Crítica", impacto: "Alto", focos: ["Cruces fronterizos", "Ejes carreteros", "Instalaciones de Pemex", "Flujo migratorio"], detalles: ["Violencia/Miedo: 78/100", "Conflictos sectoriales: 65/100", "Gobernabilidad: 68/100"], tesis: "Disputas delictivas por aduanas y presión humanitaria persistente en municipios del norte." },
  "Colima": { itse: 70, ivs: 78, nivel: "Crítica", impacto: "Crítico", focos: ["Homicidios", "Puerto de Manzanillo", "Rutas marítimas", "Inseguridad pública"], detalles: ["Violencia/Miedo: 90/100", "Conflictos sectoriales: 50/100", "Gobernabilidad: 66/100"], tesis: "Fuerte disputa territorial focalizada en accesos logísticos de comercio exterior." },
  "Ciudad de México": { itse: 68, ivs: 77, nivel: "Alta", impacto: "Alto", focos: ["Protestas nacionales", "Escasez hídrica", "Saturación transporte", "Gentrificación"], detalles: ["Violencia/Miedo: 58/100", "Conflictos sectoriales: 82/100", "Gobernabilidad: 64/100"], tesis: "Epicentro de movilización que resiente presiones de costo de vida y servicios básicos." },
  "Sonora": { itse: 67, ivs: 72, nivel: "Alta", impacto: "Alto", focos: ["Sequía severa", "Demandas étnicas", "Yaquis", "Actividad transfronteriza"], detalles: ["Violencia/Miedo: 70/100", "Conflictos sectoriales: 66/100", "Gobernabilidad: 62/100"], tesis: "Fricciones por derechos de agua en el campo que intersectan con problemáticas agrarias." },
  "Nuevo León": { itse: 66, ivs: 73, nivel: "Alta", impacto: "Alto", focos: ["Disponibilidad hídrica", "Movilidad urbana", "Calidad del aire", "Nearshoring"], detalles: ["Violencia/Miedo: 62/100", "Conflictos sectoriales: 72/100", "Gobernabilidad: 64/100"], tesis: "Desafíos estructurales derivados de una expansión industrial superior a los servicios." },
  "Chihuahua": { itse: 66, ivs: 72, nivel: "Alta", impacto: "Alto", focos: ["Sequía agrícola", "Albergues migrantes", "Inseguridad serrana"], detalles: ["Violencia/Miedo: 72/100", "Conflictos sectoriales: 62/100", "Gobernabilidad: 62/100"], tesis: "Estrés climático en zonas de riego comercial que coincide con retos de vecindad fronteriza." },
  "Jalisco": { itse: 66, ivs: 71, nivel: "Alta", impacto: "Alto", focos: ["Colectivos de búsqueda", "Desapariciones", "Seguridad metropolitana"], detalles: ["Violencia/Miedo: 68/100", "Conflictos sectoriales: 66/100", "Gobernabilidad: 64/100"], tesis: "Tensión social focalizada en demandas de justicia penal y derechos humanos urbanos." },
  "Puebla": { itse: 65, ivs: 68, nivel: "Alta", impacto: "Alto", focos: ["Extracción ilícita", "Huachicol", "Comités de agua", "Disputas políticas"], detalles: ["Violencia/Miedo: 62/100", "Conflictos sectoriales: 70/100", "Gobernabilidad: 64/100"], tesis: "Conflictos comunitarios por recursos locales y mercados informales de combustibles." },
  "San Luis Potosí": { itse: 63, ivs: 66, nivel: "Alta", impacto: "Acumulativo", focos: ["Vías comerciales", "Robo de carga", "Infraestructura hídrica"], detalles: ["Violencia/Miedo: 64/100", "Conflictos sectoriales: 62/100", "Gobernabilidad: 62/100"], tesis: "Riesgos de tránsito en carreteras federales y requerimientos de suelo industrial servido." },
  "Quintana Roo": { itse: 62, ivs: 66, nivel: "Alta", impacto: "Acumulativo", focos: ["Desarrollo inmobiliario", "Residuos sólidos", "Zonas hoteleras"], detalles: ["Violencia/Miedo: 66/100", "Conflictos sectoriales: 56/100", "Gobernabilidad: 62/100"], tesis: "Brechas de servicios públicos entre los centros turísticos de lujo y las colonias obreras." },
  "Durango": { itse: 56, ivs: 59, nivel: "Alta", impacto: "Acumulativo", focos: ["Pérdidas ganaderas", "Sequía de largo plazo", "Aislamiento serrano"], detalles: ["Violencia/Miedo: 56/100", "Conflictos sectoriales: 58/100", "Gobernabilidad: 54/100"], tesis: "Urgencia económica en ejidos tradicionales por ausencia prolongada de precipitaciones." },
  "Baja California Sur": { itse: 55, ivs: 58, nivel: "Alta", impacto: "Acumulativo", focos: ["Fuentes de agua dulce", "Costo de suelo", "Gentrificación"], detalles: ["Violencia/Miedo: 54/100", "Conflictos sectoriales: 56/100", "Gobernabilidad: 54/100"], tesis: "Fuerte encarecimiento habitacional y escasez de acuíferos potables disponibles." },
  "Coahuila": { itse: 55, ivs: 58, nivel: "Alta", impacto: "Acumulativo", focos: ["Estabilidad automotriz", "Derechos de agua", "Pasivos del carbón"], detalles: ["Violencia/Miedo: 52/100", "Conflictos sectoriales: 58/100", "Gobernabilidad: 54/100"], tesis: "Demandas del sector obrero metalúrgico y retos de remediación ambiental minera." },
  "Nayarit": { itse: 53, ivs: 56, nivel: "Media", impacto: "Acumulativo", focos: ["Zonas costeras", "Litigios pesqueros", "Comunidades ejidales"], detalles: ["Violencia/Miedo: 52/100", "Conflictos sectoriales: 54/100", "Gobernabilidad: 52/100"], tesis: "Fricciones localizadas por uso de playas frente a proyectos inmobiliarios." },
  "Hidalgo": { itse: 53, ivs: 56, nivel: "Media", impacto: "Acumulativo", focos: ["Conectividad AIFA", "Movilidad metropolitana", "Pozos vecinales"], detalles: ["Violencia/Miedo: 50/100", "Conflictos sectoriales: 56/100", "Gobernabilidad: 54/100"], tesis: "Tensiones vecinales por administración de redes locales de distribución de agua dulce." },
  "Querétaro": { itse: 52, ivs: 55, nivel: "Media", impacto: "Acumulativo", focos: ["Saturación vehicular", "Redes de conducción", "Nearshoring"], detalles: ["Violencia/Miedo: 48/100", "Conflictos sectoriales: 58/100", "Gobernabilidad: 50/100"], tesis: "Demandas de infraestructura de transporte masivo ante acelerado crecimiento habitacional." },
  "Campeche": { itse: 46, ivs: 50, nivel: "Media", impacto: "Estabilidad relativa", focos: ["Sindicatos marítimos", "Ciudad del Carmen", "Pesca artesanal"], detalles: ["Violencia/Miedo: 42/100", "Conflictos sectoriales: 48/100", "Gobernabilidad: 48/100"], tesis: "Inconformidades de índole gremial y laboral concentradas en el sector de proveeduría petrolera." },
  "Aguascalientes": { itse: 45, ivs: 48, nivel: "Media", impacto: "Estabilidad relativa", focos: ["Suministro hídrico", "Blindaje perimetral", "Parques industriales"], detalles: ["Violencia/Miedo: 44/100", "Conflictos sectoriales: 46/100", "Gobernabilidad: 46/100"], tesis: "Entorno general pacífico enfocado en la prevención operativa del abasto urbano." },
  "Tlaxcala": { itse: 45, ivs: 49, nivel: "Media", impacto: "Estabilidad relativa", focos: ["Delitos de género", "Redes de trata", "Carreteras colindantes"], detalles: ["Violencia/Miedo: 40/100", "Conflictos sectoriales: 50/100", "Gobernabilidad: 46/100"], tesis: "Alertas concentradas en agendas específicas de colectivos civiles de derechos humanos." },
  "Yucatán": { itse: 40, ivs: 44, nivel: "Media", impacto: "Estabilidad relativa", focos: ["Expansión urbana", "Mérida periférica", "Servicios residenciales"], detalles: ["Violencia/Miedo: 34/100", "Conflictos sectoriales: 46/100", "Gobernabilidad: 40/100"], tesis: "Óptimas condiciones de gobernabilidad con presiones menores por ordenamiento territorial." }
};

// =========================================================================
// 3. LOGICA DE CONTROL DE PESTAÑAS Y COLORES ANÁLITICOS
// =========================================================================

function normalizeStateName(name) { 
    if (name === "México" || name === "Edomex") return "Estado de México"; 
    return name;
} 

// =========================================================================
// AJUSTE DE ESCALAS COGNITIVAS (ITSE vs IVS) - METODOLOGÍA 2026-2027
// =========================================================================

// Devuelve el color exacto según la métrica activa y su respectiva escala oficial
function getColorByScore(score, metric = currentMetric) {
    if (metric === 'itse') {
        if (score >= 70) return '#d9534f'; // Crítica (Rojo)
        if (score >= 55) return '#f0ad4e'; // Alta (Naranja)
        if (score >= 35) return '#4e87f0'; // Media (Azul)
        return '#5cb85c';                 // Baja (Verde)
    } else { 
        // Escala oficial para IVS
        if (score >= 80) return '#d9534f'; // Crítica (Rojo)
        if (score >= 60) return '#f0ad4e'; // Alta (Naranja)
        if (score >= 40) return '#4e7ff0'; // Moderada (Azul)
        return '#5cb85c';                 // Baja (Verde)
    }
}

// Devuelve el texto oficial del nivel según la métrica evaluada
function getNivelByScore(score, metric = currentMetric) {
    if (metric === 'itse') {
        if (score >= 70) return 'Crítica';
        if (score >= 55) return 'Alta';
        if (score >= 35) return 'Media';
        return 'Baja';
    } else {
        if (score >= 80) return 'Crítica';
        if (score >= 60) return 'Alta';
        if (score >= 40) return 'Moderada';
        return 'Baja';
    }
}

function styleFeature(feature) { 
    const rawName = feature.properties.name;
    const normalizedName = normalizeStateName(rawName); 
    const info = dataset[normalizedName] || { itse: 0, ivs: 0 }; 
    const score = info[currentMetric] || 0;
    
    return { 
        fillColor: getColorByScore(score, currentMetric), 
        weight: 1.2, 
        opacity: 1, 
        color: '#0D0D0D', 
        fillOpacity: 0.8 
    }; 
}

// CORRECCIÓN DEFINITIVA DE LA PESTAÑA: Admite invocaciones manuales y automáticas sin error
function switchTab(tabId, e) { 
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active')); 
    
    if (e && e.currentTarget) { 
        e.currentTarget.classList.add('active'); 
    } else {
        // Enlace alternativo si la pestaña se cambia al hacer clic sobre el mapa izquierdo
        const targetBtn = document.querySelector(`button[onclick*="'${tabId}'"]`);
        if (targetBtn) targetBtn.classList.add('active');
    }
    
    const pane = document.getElementById('pane-' + tabId);
    if (pane) pane.classList.add('active'); 
} 

// Renderiza un arco semicircular dinámico adaptado para despliegues independientes o en paralelo
function renderGauge(score, nivel, labelMetric = "Métrica", metricKey = "itse") { 
    const color = getColorByScore(score, metricKey);
    const angle = (score / 100) * 180 - 90; 
    const radius = 90; 
    const circumference = Math.PI * radius; 
    const strokeDashoffset = circumference - (score / 100) * circumference; 
    
    return `
      <div class="gauge-wrapper" style="margin-bottom: 0;">
        <svg class="gauge-svg" viewBox="0 0 220 115" style="width: 100%; height: auto; max-width: 160px;">
          <path class="gauge-bg" d="M 20 105 A 90 90 0 0 1 200 105" />
          <path class="gauge-fill" d="M 20 105 A 90 90 0 0 1 200 105" 
                style="stroke: ${color}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeDashoffset};" />
          <line class="gauge-needle" x1="110" y1="105" x2="110" y2="25" 
                stroke-width="4" stroke-linecap="round" stroke="#FFF" style="transform: rotate(${angle}deg);" />
        </svg>
        <div class="gauge-value" style="color: ${color}; font-size: 1.8rem; margin-top: -10px;">${score}</div>
        <div class="gauge-label" style="font-size: 0.65rem; font-weight: bold; margin-top: 2px;">${labelMetric}: ${nivel}</div>
      </div>
    `;
} 

function calculateGlobalOutputs() { 
    let counts = { critica: 0, alta: 0, media: 0, baja: 0 }; 
    let tableRows = ""; 
    let rankingArray = []; 
    
    for (const key in dataset) { 
        const item = dataset[key]; 
        const valITSE = item.itse; 
        const valIVS = item.ivs; 
        
        const scoreActivo = item[currentMetric];
        
        // Clasificación de alertas en contadores usando la escala correspondiente
        if (currentMetric === 'itse') {
            if (scoreActivo >= 70) counts.critica++; 
            else if (scoreActivo >= 55) counts.alta++; 
            else if (scoreActivo >= 35) counts.media++; 
            else counts.baja++; 
        } else {
            if (scoreActivo >= 80) counts.critica++; 
            else if (scoreActivo >= 60) counts.alta++; 
            else if (scoreActivo >= 40) counts.media++; 
            else counts.baja++; 
        }
        
        rankingArray.push({ name: key, score: scoreActivo }); 
        
        // Filas de la tabla: Pintamos ITSE con su regla e IVS con la suya de forma independiente
        tableRows += `
          <tr>
            <td><strong>${key}</strong></td>
            <td><span style="color:${getColorByScore(valITSE, 'itse')}; font-weight:bold;">${valITSE} pts</span></td>
            <td><span style="color:${getColorByScore(valIVS, 'ivs')}; font-weight:bold;">${valIVS} pts</span></td>
            <td><span class="badge-nivel" style="background: ${getColorByScore(valITSE, 'itse')}22; color: ${getColorByScore(valITSE, 'itse')}; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${item.nivel}</span></td>
            <td><strong>${item.impacto}</strong></td>
            <td class="table-focos">${item.focos.join(', ')}</td>
          </tr>
        `;
    } 
    
    document.getElementById('count-critica').innerText = counts.critica; 
    document.getElementById('count-alta').innerText = counts.alta; 
    document.getElementById('count-media').innerText = counts.media; 
    document.getElementById('count-baja').innerText = counts.baja; 
    
    const labelMedia = document.getElementById('label-media');
    if (labelMedia) {
        labelMedia.innerText = currentMetric === 'ivs' ? 'Volatilidad Moderada' : 'Tensión Media';
    }

    // Actualización dinámica de la etiqueta de la pestaña de clasificación
    const tabRankingLabel = document.getElementById('tab-ranking-label');
    if (tabRankingLabel) {
        tabRankingLabel.innerText = currentMetric === 'ivs' ? 'Ranking IVS' : 'Ranking ITSE';
    }
    
    document.getElementById('tabla-body').innerHTML = tableRows; 
    
    rankingArray.sort((a, b) => b.score - a.score); 
    const rankContainer = document.getElementById('ranking-container'); 
    
    rankContainer.innerHTML = rankingArray.map((item, idx) => `
      <div class="ranking-item">
        <span>${idx + 1}. <strong>${item.name}</strong></span>
        <span style="font-weight:bold; color:${getColorByScore(item.score, currentMetric)}">${item.score} pts (${getNivelByScore(item.score, currentMetric)})</span>
      </div>
    `).join(''); 
}

function updateMapLayers() { 
    if (geojsonLayer) { 
        geojsonLayer.eachLayer(layer => { 
            geojsonLayer.resetStyle(layer); 
            const rawName = layer.feature.properties.name; 
            const normalizedName = normalizeStateName(rawName); 
            const val = dataset[normalizedName] ? dataset[normalizedName][currentMetric] : 0; 
            const nivelTxt = getNivelByScore(val, currentMetric);
            layer.setTooltipContent(`<strong>${normalizedName}</strong>: ${val} Puntos (${nivelTxt})`); 
        }); 
        calculateGlobalOutputs(); 
    } 
}

// =========================================================================
// 4. INTEGRACIÓN Y CONTROL COMPLETO DEL GEOJSON VINCULADO AL MAPA
// =========================================================================
if (typeof mexicoGeoJSON !== 'undefined') {
    geojsonLayer = L.geoJSON(mexicoGeoJSON, {
        style: styleFeature,
        onEachFeature: function(feature, layer) {
            const rawName = feature.properties.name;
            const normalizedName = normalizeStateName(rawName);
            const val = dataset[normalizedName] ? dataset[normalizedName][currentMetric] : 0;
            const metricLabel = currentMetric.toUpperCase();
            
            layer.bindTooltip(`<strong>${normalizedName}</strong>: ${val} Puntos (${metricLabel})`, {
                permanent: false, 
                direction: 'auto',
                className: 'leaflet-tooltip-custom'
            });
            
            layer.on({
                mouseover: function(e) { 
                    e.target.setStyle({ fillOpacity: 0.9, weight: 2, color: '#FFF' }); 
                },
                mouseout: function(e) { 
                    geojsonLayer.resetStyle(e.target); 
                },
                click: function(e) {
                    const info = dataset[normalizedName];
                    if(!info) return;
                    
                    // Extraer los niveles analíticos de ambas métricas en paralelo
                    const nivelITSE = getNivelByScore(info.itse, 'itse');
                    const nivelIVS = getNivelByScore(info.ivs, 'ivs');

                    const panel = document.getElementById('selectedStatePanel');
                    
                    // Modificación integral del bloque: Integración de análisis DUAL (ITSE vs IVS)
                    panel.innerHTML = `
                      <h2 style="font-family:'Syne', sans-serif; font-size:1.6rem; margin-bottom:1.2rem; border-bottom:2px solid var(--border); padding-bottom:6px; color: #FFF;">
                        ${normalizedName}
                      </h2>
                      
                      <!-- CONTENEDOR DE MEDIDORES DUALES PARALELOS -->
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.2rem;">
                         <div class="data-box" style="padding: 10px; display: flex; flex-direction: column; align-items: center; margin-bottom: 0;">
                            <h3 style="font-size: 0.7rem; color: var(--text2); margin-bottom: 8px;">ITSE (Tensión Actual)</h3>
                            ${renderGauge(info.itse, nivelITSE, "ITSE", "itse")}
                         </div>
                         <div class="data-box" style="padding: 10px; display: flex; flex-direction: column; align-items: center; margin-bottom: 0;">
                            <h3 style="font-size: 0.7rem; color: var(--text2); margin-bottom: 8px;">IVS (Riesgo Prospectivo)</h3>
                            ${renderGauge(info.ivs, nivelIVS, "IVS", "ivs")}
                         </div>
                      </div>
                      
                      <!-- RESUMEN DE BALANCE ESTRATÉGICO -->
                      <div class="data-box">
                        <h3>Balance de Riesgo</h3>
                        <div style="font-size: 0.85rem; margin-bottom: 6px; display: flex; justify-content: space-between;">
                          <span style="color: var(--text2);">Impacto Potencial 2027:</span> 
                          <strong style="color: var(--accent);">${info.impacto}</strong>
                        </div>
                        <div class="progress-bar">
                          <div class="progress-fill" style="width:${info.ivs}%; background: var(--accent);"></div>
                        </div>
                      </div>
                      
                      <!-- DESGLOSE COGNITIVO: POR QUÉ DE SU SITUACIÓN -->
                      <div class="data-box">
                        <h3>Evaluación</h3>
                        
                        <ul class="bullet-list" style="margin-bottom: 12px;">
                          ${info.detalles.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                        
                        <h3 style="font-size: 0.7rem; color: var(--text2); margin-bottom: 6px; border: none; padding: 0;">Focos de Tensión Activos</h3>
                        <div class="focus-badge-container">
                          ${info.focos.map(f => `<span class="focus-badge">${f}</span>`).join('')}
                        </div>
                      </div>
                      
                      <!-- TESIS POLÍTICO-ELECTORAL Y CONTEXTO -->
                      <div class="data-box">
                        <h3>Tesis Político-Electoral & Coyuntura</h3>
                        <p style="font-style: italic; border-left: 3px solid var(--accent); padding-left: 10px; color: #E0E0E0; line-height: 1.4;">
                          "${info.tesis}"
                        </p>
                      </div>
                    `;
                    
                    switchTab('mapa', null); 
                    
                    if(window.innerWidth <= 992) {
                        document.querySelector('.side-panel').scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    }).addTo(map);
    
    calculateGlobalOutputs();

    // =========================================================================
    // 5. INICIALIZACIÓN Y CAPTURA DEL FILTRO DEL SELECTOR (HTML)
    // =========================================================================
    document.addEventListener("DOMContentLoaded", () => {
        const metricSelector = document.getElementById('metric-selector');
        if (metricSelector) {
            metricSelector.addEventListener('change', (e) => {
                currentMetric = e.target.value;
                updateMapLayers();
            });
        }
    });

} else {
    console.error("Error crítico: El objeto global 'mexicoGeoJSON' no está definido. Revisa su importación en el archivo HTML.");
}