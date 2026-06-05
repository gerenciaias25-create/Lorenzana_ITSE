// =========================================================================
// 1. INICIALIZACIÓN DEL MAPA
// =========================================================================
const map = L.map('map').setView([23.6345, -102.5528], 5);
let geojsonLayer;

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
}).addTo(map);

// =========================================================================
// 2. DATASET OFICIAL INTEGRAL DE LAS TENSIONES SOCIALES (32 ESTADOS)
// =========================================================================
const dataset = {
  "Sinaloa": { 
    itse: 84.5, nivel: "Crítica", 
    violencia: "Tensión crítica por guerra criminal, homicidio, desapariciones, miedo urbano y crisis de seguridad; IPM/SESNSP y reportes recientes lo ubican como foco central.", 
    conflictos: "Conflicto sectorial muy alto: productores agrícolas de Sinaloa protagonizaron protestas por precios y advirtieron movilizaciones; carretera/aeropuerto como amenaza de presión.",
    gobernabilidad: "Gobernabilidad crítica por seguridad y crisis institucional alrededor del gobierno estatal y crimen organizado."
  },
  "Guerrero": { 
    itse: 81.0, nivel: "Crítica", 
    violencia: "Violencia crítica: homicidios, extorsión, desplazamiento, crimen en Acapulco/Tierra Caliente y riesgo contra autoridades; IPM/SESNSP lo mantienen como entidad de alto riesgo.", 
    conflictos: "Conflicto sectorial muy alto: magisterio, normalistas, transportistas, comunidades, servicios, reconstrucción y carreteras.",
    gobernabilidad: "Gobernabilidad crítica por fragmentación territorial, presión municipal, violencia política/social y debilidad institucional en zonas de conflicto."
  },
  "Michoacán": { 
    itse: 78.1, nivel: "Crítica", 
    violencia: "Violencia alta por crimen organizado, extorsión, homicidio y disputas territoriales; también figura entre entidades con mayor desaparición acumulada.", 
    conflictos: "Conflicto sectorial muy alto: campo, aguacate/limón, normalistas, magisterio, transportistas y bloqueos carreteros.",
    gobernabilidad: "Gobernabilidad alta por control territorial criminal, conflictos productivos y presión a municipios."
  },
  "Guanajuato": { 
    itse: 76.0, nivel: "Crítica", 
    violencia: "Foco nacional de homicidio, crimen organizado, extorsión y violencia contra policías; aparece reiteradamente entre estados de mayor violencia, aunque con descensos recientes.", 
    conflictos: "Conflicto sectorial alto: productores agrícolas, agua, transporte y corredores industriales; entidades del Bajío participaron en movilizaciones del campo.",
    gobernabilidad: "Gobernabilidad alta por violencia persistente, presión municipal e industrial y crisis de seguridad."
  },
  "Chihuahua": { 
    itse: 74.3, nivel: "Alta", 
    violencia: "Uno de los focos de violencia: homicidio, crimen organizado, Sierra Tarahumara, trata/trabajo forzado y presencia de narcolaboratorios; IPM y reportes recientes lo colocan entre estados de violencia elevada.", 
    conflictos: "Conflicto sectorial alto por campo, agua, carreteras y transporte; se reportaron bloqueos campesinos/transportistas en 2026.",
    gobernabilidad: "Gobernabilidad alta por choque institucional, seguridad y controversias sobre operaciones de seguridad; tensión entre niveles de gobierno."
  },
  "México": { 
    itse: 71.3, nivel: "Alta", 
    violencia: "Alta violencia social por volumen poblacional: homicidio, feminicidio, extorsión, desapariciones y percepción de inseguridad urbana; figura entre entidades con más desapariciones acumuladas.", 
    conflictos: "Conflicto sectorial muy alto: agua en Valle de México, transporte concesionado, bloqueos, servicios urbanos y participación en protestas campesinas.",
    gobernabilidad: "Gobernabilidad alta por complejidad metropolitana, municipios grandes, corrupción local y presión de servicios."
  },
  "Jalisco": { 
    itse: 71.2, nivel: "Alta", 
    violencia: "Alta violencia por homicidios, desapariciones, armas y crimen organizado; CIDH y notas sobre desapariciones ubican a Jalisco entre los mayores focos acumulados.", 
    conflictos: "Conflicto sectorial alto: campo, agua, transporte, incendios forestales y presión metropolitana; productores participaron en movilización nacional.",
    gobernabilidad: "Gobernabilidad alta por desapariciones, presión metropolitana, seguridad y crisis de confianza institucional."
  },
  "Veracruz": { 
    itse: 70.8, nivel: "Alta", 
    violencia: "Violencia alta por homicidio, desapariciones, extorsión y corredor Golfo; aparece entre entidades con desapariciones acumuladas relevantes.", 
    conflictos: "Conflicto sectorial alto por transporte, campo, agua, desastres recientes, energía y Pemex.",
    gobernabilidad: "Gobernabilidad alta por seguridad, impactos ambientales de Pemex y reconstrucción/servicios en regiones vulnerables."
  },
  "Zacatecas": { 
    itse: 69.0, nivel: "Alta", 
    violencia: "Violencia alta por disputas criminales, homicidios y miedo; aunque hubo reducciones recientes, conserva memoria social de crisis de seguridad.", 
    conflictos: "Conflicto sectorial alto por campo, agua, carreteras y presencia en agenda de movilizaciones campesinas/magisteriales.",
    gobernabilidad: "Gobernabilidad alta por seguridad, dispersión territorial y presión rural."
  },
  "Oaxaca": { 
    itse: 68.2, nivel: "Alta", 
    violencia: "Violencia media-alta con conflictos comunitarios, homicidio localizado y presión territorial; no es sólo crimen, sino mezcla social-territorial.", 
    conflictos: "Conflicto sectorial crítico: CNTE Sección 22, bloqueos, normalismo, comunidades, transporte y demandas sociales.",
    gobernabilidad: "Gobernabilidad alta por presión magisterial, usos y costumbres, conflictos agrarios y capacidad de bloqueo."
  },
  "Morelos": { 
    itse: 67.8, nivel: "Alta", 
    violencia: "Violencia alta en homicidio, extorsión y percepción; casos de desaparición y Cuautla/Cuernavaca como zonas de presión.", 
    conflictos: "Conflicto sectorial alto: productores BCR (Autopista Siglo XXI) bloquearon por precios, diésel y fertilizantes.",
    gobernabilidad: "Gobernabilidad alta por crisis de seguridad, fiscalía/gobierno y conflictos municipales."
  },
  "Sonora": { 
    itse: 67.3, nivel: "Alta", 
    violencia: "Violencia alta en frontera, homicidio, crimen organizado, desapariciones y corredor migrante.", 
    conflictos: "Conflicto sectorial alto: campo, agua, sequía en norte de Sonora, transporte y frontera.",
    gobernabilidad: "Gobernabilidad media-alta por seguridad fronteriza, agua y comunidades originarias."
  },
  "Tamaulipas": { 
    itse: 66.0, nivel: "Alta", 
    violencia: "Violencia alta por frontera, crimen organizado, desapariciones y extorsión; figura entre estados con más desapariciones acumuladas.", 
    conflictos: "Conflicto sectorial alto por aduanas, transporte, energía, agua y afectaciones de Pemex/Golfo.",
    gobernabilidad: "Gobernabilidad alta por frontera, seguridad, energía y coordinación interinstitucional."
  },
  "Baja California": { 
    itse: 65.5, nivel: "Alta", 
    violencia: "Alta exposure a homicidio, armas, frontera, trata, extorsión y miedo urbano.", 
    conflictos: "Conflictos de agua, movilidad, migración y transporte fronterizo; presión por servicios urbanos en Tijuana/Mexicali y riesgo de protesta por abasto/seguridad.",
    gobernabilidad: "Gobernabilidad tensionada por seguridad, frontera, migración y capacidad policial municipal; no es crisis única, sino estrés institucional persistente."
  },
  "Ciudad de México": { 
    itse: 64.9, nivel: "Alta", 
    violencia: "Percepción de inseguridad urbana relevante, aunque con reducciones reportadas en delitos de alto impacto; concentra victimización urbana, movilización y agenda mediática.", 
    conflictos: "Muy alta conflictividad organizada por ser sede de protestas nacionales: CNTE, campesinos, transportistas, colectivos y servicios urbanos.",
    gobernabilidad: "Gobernabilidad media-alta por presión de movilidad, agua, seguridad, plantones y operación de grandes eventos."
  },
  "Puebla": { 
    itse: 64.3, nivel: "Alta", 
    violencia: "Violencia media-alta por robo en carreteras, huachicol, extorsión, homicidios y percepción urbana.", 
    conflictos: "Conflicto sectorial alto: transporte, campo, agua, carreteras y afectaciones por desastres recientes en sierra.",
    gobernabilidad: "Gobernabilidad media-alta por huachicol, servicios, reconstrucción y corredor logístico."
  },
  "Quintana Roo": { 
    itse: 63.0, nivel: "Alta", 
    violencia: "Violencia media-alta por turismo, extorsión, homicidio, trata y narcomenudeo; percepción urbana en Cancún/Playa del Carmen es sensible.", 
    conflictos: "Conflicto sectorial medio-alto por transporte, taxi/plataformas, turismo, agua y servicios.",
    gobernabilidad: "Gobernabilidad alta por presión turística, seguridad, movilidad y conflictos regulatorios."
  },
  "Nuevo León": { 
    itse: 62.7, nivel: "Alta", 
    violencia: "Violencia media-alta por homicidio, desapariciones y delitos urbanos; figura entre estados con más personas desaparecidas acumuladas.", 
    conflictos: "Conflicto sectorial alto por agua, movilidad, transporte, vivienda, industria y presión metropolitana.",
    gobernabilidad: "Gobernabilidad media-alta por tensiones institucionales, coordinación metropolitana y seguridad."
  },
  "Chiapas": { 
    itse: 62.5, nivel: "Alta", 
    violencia: "Violencia y miedo en aumento por frontera sur, tráfico de personas, disputas territoriales y crimen en regiones rurales; casos de redes criminales en Selva Lacandona muestran captura territorial local.", 
    conflictos: "Conflicto sectorial alto: magisterio, comunidades, tierra, migración, carreteras y servicios; presencia histórica de movilización social organizada.",
    gobernabilidad: "Gobernabilidad tensionada por frontera, control territorial, desplazamientos y conflictos comunitarios."
  },
  "San Luis Potosí": { 
    itse: 62.0, nivel: "Alta", 
    violencia: "Violencia media-alta por carretera, crimen, extorsión y riesgo contra periodistas/activistas.", 
    conflictos: "Conflicto sectorial medio-alto por zona limítrofe con condiciones secas, transporte, industria y comunidades.",
    gobernabilidad: "Gobernabilidad alta por denuncias de persecución a periodistas/activistas y debate sobre reformas penales locales."
  },
  "Tabasco": { 
    itse: 62.0, nivel: "Alta", 
    violencia: "Violencia y extorsión crecientes en un estado antes menos expuesto; delitos de alto impacto y crisis de seguridad local elevan miedo.", 
    conflictos: "Conflicto sectorial alto por energía, Pemex, ambiente, empleo, inundaciones y servicios.",
    gobernabilidad: "Gobernabilidad alta por derrames/fugas petroleras en región Golfo, seguridad y dependencia energética."
  },
  "Colima": { 
    itse: 61.5, nivel: "Alta", 
    violencia: "Históricamente alta violencia letal y delitos de alto impacto asociados a puerto, rutas criminales y armas.", 
    conflictos: "Conflicto sectorial medio: puerto, transporte, servicios y seguridad comunitaria.",
    gobernabilidad: "Gobernabilidad media-alta por capacidad territorial limitada ante crimen y puerto estratégico."
  },
  "Querétaro": { 
    itse: 52.0, nivel: "Media", 
    violencia: "Violencia media-baja respecto a focos nacionales, aunque con percepción urbana y corredor carretero expuesto.", 
    conflictos: "Conflicto sectorial alto por agua: pobladores de Santa Rosa Jáuregui bloquearon la Federal 57 por falta de suministro; presión industrial/urbana.",
    gobernabilidad: "Gobernabilidad media por crecimiento acelerado, agua y movilidad, más que por crimen letal."
  },
  "Hidalgo": { 
    itse: 51.5, nivel: "Media", 
    violencia: "Violencia media: huachicol, robo, violencia familiar y percepción variable; no entre los máximos nacionales de homicidio.", 
    conflictos: "Conflicto sectorial alto por agua, transporte, campo, carreteras y afectaciones regionales; aparece en bloqueos agrotransportistas de 2026.",
    gobernabilidad: "Gobernabilidad media por conflictos municipales, servicios y corredor energético/huachicol."
  },
  "Durango": { 
    itse: 45.5, nivel: "Media", 
    violencia: "Violencia media: no aparece como foco principal nacional, aunque comparte riesgos regionales con corredor norte y sierra.", 
    conflictos: "Conflicto sectorial medio-alto: campo, agua y carreteras; presencia en agenda agropecuaria del norte.",
    gobernabilidad: "Gobernabilidad media-baja: tensiones localizadas, sin escándalo nacional dominante."
  },
  "Tlaxcala": { 
    itse: 42.3, nivel: "Media", 
    violencia: "Violencia baja-media; riesgo más visible en trata, violencia familiar y corredor con Puebla/Edomex.", 
    conflictos: "Conflicto sectorial medio por transporte, agua, campo y cercanía a bloqueos regionales.",
    gobernabilidad: "Gobernabilidad relativamente estable, con vulnerabilidades municipales y de seguridad especializada."
  },
  "Campeche": { 
    itse: 41.0, nivel: "Media", 
    violencia: "Incidencia delictiva comparativamente baja; en DISI enero-abril 2026 aparece entre tasas bajas de delitos de alto impacto.", 
    conflictos: "Tensión sectorial por energía, empleo petrolero, pesca y conflictos laborales; impacto de Pemex en Golfo con riesgos ambientales regionales.",
    gobernabilidad: "Gobernabilidad media por dependencia energética, tensiones laborales y fiscalización local; sin crisis de violencia comparable al norte/occidente."
  },
  "Coahuila": { 
    itse: 39.7, nivel: "Baja", 
    violencia: "Violencia comparativamente menor en tasa de delitos de alto impacto; DISI lo ubica entre entidades con tasas bajas.", 
    conflictos: "Conflictos sectoriales por agua, carbón, empleo industrial y transporte; presión regional, pero sin ola estatal sostenida.",
    gobernabilidad: "Gobernabilidad estable, con riesgos localizados por minería, frontera económica y fiscalización municipal."
  },
  "Nayarit": { 
    itse: 39.5, nivel: "Baja", 
    violencia: "Violencia baja-media frente a occidente; riesgo localizado por frontera con Jalisco/Sinaloa y narcomenudeo.", 
    conflictos: "Conflicto sectorial medio por campo, pesca, turismo, agua y condiciones secas anormales reportadas en occidente.",
    gobernabilidad: "Gobernabilidad baja-media, sin crisis institucional pública de escala nacional."
  },
  "Aguascalientes": { 
    itse: 39.0, nivel: "Baja", 
    violencia: "Violencia por debajo de focos rojos nacionales, pero con exposición a robo, violencia familiar y delitos de alto impacto medida por SESNSP/ENSU.", 
    conflictos: "Conflicto sectorial moderado: presión hídrica regional y efectos de agricultura/transporte en corredores del Bajío, sin movilización sostenida estatal de alta intensidad.",
    gobernabilidad: "Gobernabilidad relativamente estable; el riesgo proviene más de presión urbana y coordinación metropolitana que de crisis institucional abierta."
  },
  "Baja California Sur": { 
    itse: 38.9, nivel: "Baja", 
    violencia: "Violencia baja-media frente al norte fronterizo; riesgos concentrados en violencia familiar, turismo, narcomenudeo y percepción urbana en zonas específicas.", 
    conflictos: "Conflicto sectorial moderado por agua, crecimiento turístico, vivienda, pesca y servicios; no hay señal nacional de movilización masiva sostenida.",
    gobernabilidad: "Gobernabilidad estable con vulnerabilidad por crecimiento urbano-turístico y capacidad de servicios."
  },
  "Yucatán": { 
    itse: 30.3, nivel: "Baja", 
    violencia: "Baja violencia comparativa; suele ubicarse entre las entidades más pacíficas, aunque con delitos patrimoniales y presión urbana creciente.", 
    conflictos: "Conflicto sectorial medio-bajo por agua, desarrollo inmobiliario, servicios y crecimiento metropolitano; sin movilización sostenida nacional.",
    gobernabilidad: "Gobernabilidad baja: estabilidad institucional comparativa, con riesgos por crecimiento y medio ambiente."
  }
};

// =========================================================================
// 3. NORMALIZACIÓN ORTOGRÁFICA PARA GEOJSON
// =========================================================================
function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "")
                .trim();
}

function obtenerLlaveDataset(nombreGeoJSON) {
    if (!nombreGeoJSON) return null;
    let geoNorm = normalizarTexto(nombreGeoJSON);
    if (geoNorm === "mexico") return "México";
    return Object.keys(dataset).find(key => normalizarTexto(key) === geoNorm) || null;
}

// =========================================================================
// 4. ESCALA OFICIAL DE COLORES SEGÚN RANGOS DEL ESTUDIO
// =========================================================================
function getColor(value) {
    if (value >= 75) return '#9b0b06';   // Crítica
    if (value >= 60) return '#fe0000eb'; // Alta
    if (value >= 40) return '#ff7e1c';   // Media
    return '#5cb85c';                    // Baja
}

function style(feature) {
    const estadoNombre = feature.properties.NOM_ENT || feature.properties.name || "";
    const llave = obtenerLlaveDataset(estadoNombre);
    const valor = (llave && dataset[llave]) ? dataset[llave].itse : 0;

    return {
        fillColor: getColor(valor),
        weight: 1.5,
        opacity: 1,
        color: 'rgba(255,255,255,0.12)',
        fillOpacity: 0.75
    };
}

function onEachFeature(feature, layer) {
    const estadoNombreGeo = feature.properties.NOM_ENT || feature.properties.name || "";
    const llave = obtenerLlaveDataset(estadoNombreGeo);
    
    if (llave && dataset[llave]) {
        const data = dataset[llave];
        
        layer.bindTooltip(`<b>${llave}</b><br>ITSE: ${data.itse} (${data.nivel})`, {
            className: 'leaflet-tooltip-custom',
            sticky: true
        });
        
        layer.on('click', () => {
            switchTab('mapa');
            abrirAcordeonEstado(llave);
        });
    }
}

if (typeof mexicoGeoJSON !== 'undefined') {
    geojsonLayer = L.geoJson(mexicoGeoJSON, { style: style, onEachFeature: onEachFeature }).addTo(map);
} else {
    fetch('https://raw.githubusercontent.com/angelnm98/vector-mexico/master/estados.json')
        .then(res => res.json())
        .then(data => {
            geojsonLayer = L.geoJson(data, { style: style, onEachFeature: onEachFeature }).addTo(map);
        });
}

// =========================================================================
// 5. GENERACIÓN DINÁMICA DEL ACORDEÓN DE DIAGNÓSTICOS (32 ESTADOS)
// =========================================================================
function generarAcordeonDiagnostico() {
    const contenedor = document.getElementById("lista-diagnostico-acordeon");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    Object.entries(dataset)
      .sort((a, b) => b[1].itse - a[1].itse)
      .forEach(([nombreEstado, datos]) => {
        const item = document.createElement("div");
        item.className = "acordeon-item";
        item.setAttribute("data-estado", nombreEstado);

        let badgeClass = "badge-diag-media";
        if (datos.nivel === "Crítica") badgeClass = "badge-diag-critica";
        if (datos.nivel === "Alta") badgeClass = "badge-diag-alta";
        if (datos.nivel === "Baja") badgeClass = "badge-diag-baja";

        item.innerHTML = `
            <button class="acordeon-header" onclick="toggleAcordeon(this)">
                <div class="acordeon-header-left">
                    <span class="badge-nivel-diag ${badgeClass}">${datos.nivel}</span>
                    <span style="font-weight:700;">${nombreEstado}</span>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                   <span style="font-size:0.75rem; color:var(--text2);">ITSE: <b>${datos.itse}</b></span>
                   <span class="flecha">▼</span>
                </div>
            </button>
            <div class="acordeon-body">
                <div class="contenido-diagnostico" style="padding: 1rem 1rem 1rem 2rem;">
                    <ul style="margin: 0; padding: 0; list-style-type: disc; color: var(--text);">
                        <li style="margin-bottom: 0.5rem; line-height: 1.4;">${datos.violencia}</li>
                        <li style="margin-bottom: 0.5rem; line-height: 1.4;">${datos.conflictos}</li>
                        <li style="margin-bottom: 0; line-height: 1.4;">${datos.gobernabilidad}</li>
                    </ul>
                </div>
            </div>
        `;
        contenedor.appendChild(item);
    });
}

// Interacciones del Acordeón
function toggleAcordeon(headerElement) {
    const item = headerElement.parentElement;
    const body = item.querySelector('.acordeon-body');
    const isActive = headerElement.classList.contains('active');

    document.querySelectorAll('.acordeon-header').forEach(h => {
        h.classList.remove('active');
        h.parentElement.querySelector('.acordeon-body').style.maxHeight = null;
    });

    if (!isActive) {
        headerElement.classList.add('active');
        body.style.maxHeight = body.scrollHeight + "px";
    }
}

function abrirAcordeonEstado(nombreEstado) {
    const item = document.querySelector(`.acordeon-item[data-estado="${nombreEstado}"]`);
    if (item) {
        const header = item.querySelector('.acordeon-header');
        if (header) {
            setTimeout(() => {
                header.scrollIntoView({ behavior: 'smooth', block: 'center' });
                toggleAcordeon(header);
            }, 150);
        }
    }
}

// =========================================================================
// 6. ACTUALIZACIÓN AUTOMÁTICA DE ALERTAS FLOTANTES
// =========================================================================
function calcularContadoresAlertas() {
    let c = 0, a = 0, m = 0, b = 0;
    Object.values(dataset).forEach(d => {
        if (d.itse >= 75) c++;
        else if (d.itse >= 60) a++;
        else if (d.itse >= 40) m++;
        else b++;
    });
    
    if(document.getElementById('count-critica')) document.getElementById('count-critica').innerText = c;
    if(document.getElementById('count-alta')) document.getElementById('count-alta').innerText = a;
    if(document.getElementById('count-media')) document.getElementById('count-media').innerText = m;
    if(document.getElementById('count-baja')) document.getElementById('count-baja').innerText = b;
}

document.addEventListener("DOMContentLoaded", () => {
    generarAcordeonDiagnostico();
    calcularContadoresAlertas();
});